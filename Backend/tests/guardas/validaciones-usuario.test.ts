import { describe, it, expect } from 'vitest'
import { calcularEdad, esStaff, validarEdad, validarDocumento, DOC_REGEX } from '../../src/utils/validaciones-usuario'

function ctxFalso() {
  const issues: { path?: (string | number)[]; message: string }[] = []
  const ctx = {
    addIssue: (i: { code?: string; path?: (string | number)[]; message: string }) => {
      issues.push({ path: i.path, message: i.message })
    },
  } as never
  return { ctx, issues }
}

function aniosAtras(n: number): Date {
  const d = new Date()
  d.setFullYear(d.getFullYear() - n)
  return d
}

describe('calcularEdad', () => {
  it('reste un ano si el cumpleanos aun no ocurre este ano', () => {
    const hoy = new Date()
    const manana = new Date(hoy.getFullYear() - 20, hoy.getMonth(), hoy.getDate() + 1)
    expect(calcularEdad(manana)).toBe(19)
  })
})

describe('esStaff', () => {
  it('reconoce admin y entrenador, no a los demas', () => {
    expect(esStaff('admin')).toBe(true)
    expect(esStaff('entrenador')).toBe(true)
    expect(esStaff('usuario')).toBe(false)
    expect(esStaff(null)).toBe(false)
  })
})

describe('validarEdad - personal (18-70)', () => {
  it('rechaza a un entrenador de 17 anos', () => {
    const { ctx, issues } = ctxFalso()
    validarEdad(aniosAtras(17), 'entrenador', ctx, ['fecha_nacimiento'])
    expect(issues).toHaveLength(1)
    expect(issues[0].message).toContain('18')
  })

  it('rechaza a un admin de 17 anos', () => {
    const { ctx, issues } = ctxFalso()
    validarEdad(aniosAtras(17), 'admin', ctx, ['fecha_nacimiento'])
    expect(issues).toHaveLength(1)
  })

  it('acepta a un entrenador de 18 anos', () => {
    const { ctx, issues } = ctxFalso()
    validarEdad(aniosAtras(18), 'entrenador', ctx, ['fecha_nacimiento'])
    expect(issues).toHaveLength(0)
  })

  it('acepta a un entrenador de 70 anos', () => {
    const { ctx, issues } = ctxFalso()
    validarEdad(aniosAtras(70), 'entrenador', ctx, ['fecha_nacimiento'])
    expect(issues).toHaveLength(0)
  })

  it('rechaza a un entrenador de 71 anos', () => {
    const { ctx, issues } = ctxFalso()
    validarEdad(aniosAtras(71), 'entrenador', ctx, ['fecha_nacimiento'])
    expect(issues).toHaveLength(1)
  })
})

describe('validarEdad - estudiantes (15-70)', () => {
  it('acepta a un miembro del gym de 16 anos', () => {
    const { ctx, issues } = ctxFalso()
    validarEdad(aniosAtras(16), 'usuario', ctx, ['fecha_nacimiento'])
    expect(issues).toHaveLength(0)
  })

  it('rechaza a un miembro del gym de 14 anos', () => {
    const { ctx, issues } = ctxFalso()
    validarEdad(aniosAtras(14), 'usuario', ctx, ['fecha_nacimiento'])
    expect(issues).toHaveLength(1)
  })
})

describe('validarDocumento', () => {
  it('acepta una cedula valida', () => {
    const { ctx, issues } = ctxFalso()
    validarDocumento('12345678', 'CC', ctx, ['documento'])
    expect(issues).toHaveLength(0)
  })

  it('rechaza una cedula con letras', () => {
    const { ctx, issues } = ctxFalso()
    validarDocumento('12A45678', 'CC', ctx, ['documento'])
    expect(issues).toHaveLength(1)
  })

  it('rechaza un pasaporte muy corto', () => {
    const { ctx, issues } = ctxFalso()
    validarDocumento('AB1', 'PA', ctx, ['documento'])
    expect(issues).toHaveLength(1)
  })

  it('el regex de CC solo admite digitos', () => {
    expect(DOC_REGEX.CC.test('12345678')).toBe(true)
    expect(DOC_REGEX.CC.test('ABCDEFGH')).toBe(false)
  })
})
