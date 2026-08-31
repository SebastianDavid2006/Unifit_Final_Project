#!/usr/bin/env bash
# =============================================================================
# TEST RUTAS PROTEGIDAS — Script temporal de verificacion manual
# =============================================================================
#
# Valida el middleware verificarEstado y los permisos por rol usando los 5
# perfiles del seed. Este script es temporal, solo para verificacion manual
# durante desarrollo — no forma parte del proyecto final.
#
# NOTA SOBRE PERFILES PENDIENTE Y CAMBIAR:
# Los casos de 'pendiente' (redirect a /usuario/activacion) y 'cambiar'
# (redirect a /cambiar-clave) son de FRONTEND (React Router + ProtectedRoute).
# NO se pueden probar con curl — deben verificarse manualmente en el navegador:
#   1. Login con pendiente@unifit.edu.co / pendiente123
#   2. Intentar navegar a /usuario/inicio → debe redirigir a /usuario/activacion
#   3. Login con cambiar@unifit.edu.co / cambiar123
#   4. Intentar navegar a /usuario/inicio → debe redirigir a /cambiar-clave
#
# Requisitos: curl, jq (opcional pero recomendado)
#   Instalar jq: sudo apt install jq  |  brew install jq  |  choco install jq
# =============================================================================

set -euo pipefail

BASE_URL="http://localhost:3000/api"
PASS=0
FAIL=0
TOTAL=0

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ── Helpers ──────────────────────────────────────────────────────────────────

login() {
  local email="$1"
  local pass="$2"
  local response
  response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email_contacto\":\"$email\",\"password\":\"$pass\"}")

  if command -v jq &>/dev/null; then
    echo "$response" | jq -r '.token // empty' 2>/dev/null
  else
    # Fallback: extraer token sin jq (asume que token es el unico campo largo)
    echo "$response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4
  fi
}

test_case() {
  local desc="$1"
  local expected="$2"
  local actual="$3"
  TOTAL=$((TOTAL + 1))

  if [ "$actual" = "$expected" ]; then
    echo -e "  ${GREEN}✅${NC} $desc → esperado=$expected real=$actual"
    PASS=$((PASS + 1))
  else
    echo -e "  ${RED}❌${NC} $desc → esperado=$expected real=$actual"
    FAIL=$((FAIL + 1))
  fi
}

get_status() {
  local url="$1"
  local token="${2:-}"
  local method="${3:-GET}"
  local data="${4:-}"

  local args=(-s -o /dev/null -w "%{http_code}" -X "$method" "$url")
  [ -n "$token" ] && args+=(-H "Authorization: Bearer $token")
  [ "$method" = "POST" ] || [ "$method" = "PUT" ] && args+=(-H "Content-Type: application/json")
  [ -n "$data" ] && args+=(-d "$data")

  curl "${args[@]}"
}

# ── Login con los 5 perfiles ────────────────────────────────────────────────

echo -e "${YELLOW}=== FASE 1: Login con los 5 perfiles del seed ===${NC}"

TOKEN_ADMIN=$(login "admin@unifit.edu.co" "admin123")
TOKEN_ENT=$(login "entrenador@unifit.edu.co" "entrenador123")
TOKEN_DIR=$(login "directo@unifit.edu.co" "directo123")
TOKEN_PEN=$(login "pendiente@unifit.edu.co" "pendiente123")
TOKEN_CAM=$(login "cambiar@unifit.edu.co" "cambiar123")

[ -n "$TOKEN_ADMIN" ] && echo "  ✅ admin → token obtenido" || echo "  ❌ admin → fallo login"
[ -n "$TOKEN_ENT" ]  && echo "  ✅ entrenador → token obtenido" || echo "  ❌ entrenador → fallo login"
[ -n "$TOKEN_DIR" ]  && echo "  ✅ directo (usuario) → token obtenido" || echo "  ❌ directo → fallo login"
[ -n "$TOKEN_PEN" ]  && echo "  ✅ pendiente → token obtenido" || echo "  ❌ pendiente → fallo login"
[ -n "$TOKEN_CAM" ]  && echo "  ✅ cambiar → token obtenido" || echo "  ❌ cambiar → fallo login"

# ── FASE 2: Probar permisos por rol ─────────────────────────────────────────

echo ""
echo -e "${YELLOW}=== FASE 2: Probar permisos por rol ===${NC}"

echo ""
echo "--- GET /api/maquinas ---"
test_case "admin → 200" "200" "$(get_status "$BASE_URL/maquinas" "$TOKEN_ADMIN")"
test_case "entrenador → 200" "200" "$(get_status "$BASE_URL/maquinas" "$TOKEN_ENT")"
test_case "usuario (directo) → 403" "403" "$(get_status "$BASE_URL/maquinas" "$TOKEN_DIR")"
test_case "sin token → 401" "401" "$(get_status "$BASE_URL/maquinas")"

echo ""
echo "--- POST /api/maquinas (crear) ---"
DATA='{"nombre":"Test Temporal","grupos_musculares":["general"]}'
test_case "admin → 201" "201" "$(get_status "$BASE_URL/maquinas" "$TOKEN_ADMIN" "POST" "$DATA")"
test_case "entrenador → 201" "201" "$(get_status "$BASE_URL/maquinas" "$TOKEN_ENT" "POST" "$DATA")"
test_case "usuario (directo) → 403" "403" "$(get_status "$BASE_URL/maquinas" "$TOKEN_DIR" "POST" "$DATA")"

echo ""
echo "--- GET /api/ejercicios ---"
test_case "admin → 200" "200" "$(get_status "$BASE_URL/ejercicios" "$TOKEN_ADMIN")"
test_case "entrenador → 200" "200" "$(get_status "$BASE_URL/ejercicios" "$TOKEN_ENT")"
test_case "usuario (directo) → 403" "403" "$(get_status "$BASE_URL/ejercicios" "$TOKEN_DIR")"
test_case "sin token → 401" "401" "$(get_status "$BASE_URL/ejercicios")"

echo ""
echo "--- GET /api/ejercicios/:id (UUID fake) ---"
test_case "admin → 404" "404" "$(get_status "$BASE_URL/ejercicios/00000000-0000-0000-0000-000000000000" "$TOKEN_ADMIN")"

echo ""
echo "--- PUT /api/ejercicios/:id (editar) ---"
DATA='{"nombre":"Editado"}'
test_case "admin → 404 (no existe, pero pasa auth)" "404" "$(get_status "$BASE_URL/ejercicios/00000000-0000-0000-0000-000000000000" "$TOKEN_ADMIN" "PUT" "$DATA")"
test_case "entrenador → 403 (no puede editar)" "403" "$(get_status "$BASE_URL/ejercicios/00000000-0000-0000-0000-000000000000" "$TOKEN_ENT" "PUT" "$DATA")"

echo ""
echo "--- GET /api/personal (ruta inexistente) ---"
STATUS=$(get_status "$BASE_URL/personal" "$TOKEN_ADMIN")
if [ "$STATUS" = "404" ]; then
  echo -e "  ${YELLOW}⏭️${NC} GET /api/personal → 404 (ruta no existe, saltada)"
else
  test_case "GET /api/personal → esperado 404" "404" "$STATUS"
fi

echo ""
echo "--- Caso extra: usuario pendiente intenta acceder a ejercicios ---"
test_case "pendiente (rol=usuario) → 403 (verificarEstado bloquea)" "403" "$(get_status "$BASE_URL/ejercicios" "$TOKEN_PEN")"
test_case "pendiente (rol=usuario) → 403 en maquinas" "403" "$(get_status "$BASE_URL/maquinas" "$TOKEN_PEN")"

# ── Resumen ──────────────────────────────────────────────────────────────────

echo ""
echo -e "${YELLOW}=== RESUMEN ===${NC}"
echo "  Total: $TOTAL"
echo -e "  ${GREEN}Pasaron: $PASS${NC}"
echo -e "  ${RED}Fallaron: $FAIL${NC}"
echo ""

if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}✅ TODOS LOS TESTS PASARON${NC}"
else
  echo -e "${RED}❌ HAY TESTS FALLIDOS${NC}"
fi

exit $FAIL
