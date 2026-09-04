#include <Adafruit_Fingerprint.h>
#include <ArduinoJson.h>

#define BAUD_RATE_SERIAL   115200
#define BAUD_RATE_SENSOR   57600
#define PIN_SENSOR_RX      16
#define PIN_SENSOR_TX      17

HardwareSerial serialSensor(2);
Adafruit_Fingerprint finger(&serialSensor);

enum TestPhase {
  PHASE_INIT,
  PHASE_WAIT_FINGER_1,
  PHASE_WAIT_REMOVE,
  PHASE_WAIT_FINGER_2,
  PHASE_CREATE_MODEL,
  PHASE_BULK_COPY,
  PHASE_DONE
};

TestPhase phase = PHASE_INIT;
int baseSlot = 1;
int currentTestSlot = 2;
int successCount = 0;
int failCount = 0;
uint8_t lastError = 0;
unsigned long lastActionTime = 0;

void logJSON(const char* tipo, const char* key = nullptr, const char* value = nullptr) {
  JsonDocument doc;
  doc["tipo"] = tipo;
  doc["timestamp"] = millis();
  if (key && value) {
    doc[key] = value;
  }
  serializeJson(doc, Serial);
  Serial.println();
}

void logJSONInt(const char* tipo, const char* key, int value) {
  JsonDocument doc;
  doc["tipo"] = tipo;
  doc["timestamp"] = millis();
  doc[key] = value;
  serializeJson(doc, Serial);
  Serial.println();
}

void logError(const char* msg, uint8_t code) {
  JsonDocument doc;
  doc["tipo"] = "error";
  doc["mensaje"] = msg;
  doc["codigo"] = code;
  serializeJson(doc, Serial);
  Serial.println();
}

void setup() {
  Serial.begin(BAUD_RATE_SERIAL);
  delay(500);

  serialSensor.begin(BAUD_RATE_SENSOR, SERIAL_8N1, PIN_SENSOR_RX, PIN_SENSOR_TX);
  delay(1000);

  finger.begin(BAUD_RATE_SENSOR);
  delay(500);

  if (!finger.verifyPassword()) {
    logError("AS608 no detectado. Revisa cables RX/TX y alimentacion 5V", 0);
    while (1) delay(1000);
  }

  logJSON("ready");

  // Obtener templates actuales
  finger.getTemplateCount();
  logJSONInt("info", "templates_actuales", finger.templateCount);

  // Limpiar base de datos para test limpio
  logJSON("limpiando_base_datos");
  uint8_t r = finger.emptyDatabase();
  if (r == FINGERPRINT_OK) {
    logJSON("base_datos_limpia");
  } else {
    logError("Error limpiando base de datos", r);
  }

  phase = PHASE_WAIT_FINGER_1;
  logJSON("instruccion", "mensaje", "Coloca UN dedo para enrolamiento base (slot 1)");
  lastActionTime = millis();
}

void loop() {
  // Timeout de seguridad
  if (millis() - lastActionTime > 30000) {
    if (phase == PHASE_WAIT_FINGER_1 || phase == PHASE_WAIT_FINGER_2 || phase == PHASE_WAIT_REMOVE) {
      logError("Timeout esperando dedo", 0xFF);
      lastActionTime = millis();
    }
  }

  switch (phase) {
    case PHASE_WAIT_FINGER_1: {
      uint8_t img = finger.getImage();
      if (img == FINGERPRINT_OK) {
        uint8_t r = finger.image2Tz(1);
        if (r == FINGERPRINT_OK) {
          phase = PHASE_WAIT_REMOVE;
          logJSON("instruccion", "mensaje", "Retira el dedo");
          lastActionTime = millis();
        } else {
          logError("Error procesando primera imagen", r);
          phase = PHASE_WAIT_FINGER_1;
        }
      } else if (img != FINGERPRINT_NOFINGER) {
        logError("Error capturando primera imagen", img);
      }
      break;
    }

    case PHASE_WAIT_REMOVE: {
      uint8_t img = finger.getImage();
      if (img == FINGERPRINT_NOFINGER) {
        phase = PHASE_WAIT_FINGER_2;
        logJSON("instruccion", "mensaje", "Vuelve a colocar el MISMO dedo");
        lastActionTime = millis();
      }
      break;
    }

    case PHASE_WAIT_FINGER_2: {
      uint8_t img = finger.getImage();
      if (img == FINGERPRINT_OK) {
        uint8_t r = finger.image2Tz(2);
        if (r == FINGERPRINT_OK) {
          phase = PHASE_CREATE_MODEL;
        } else {
          logError("Error procesando segunda imagen", r);
          phase = PHASE_WAIT_FINGER_1;
        }
      } else if (img != FINGERPRINT_NOFINGER) {
        logError("Error capturando segunda imagen", img);
      }
      break;
    }

    case PHASE_CREATE_MODEL: {
      uint8_t r = finger.createModel();
      if (r == FINGERPRINT_OK) {
        r = finger.storeModel(baseSlot);
        if (r == FINGERPRINT_OK) {
          successCount = 1;
          logJSONInt("enroll_base_ok", "slot", baseSlot);

          currentTestSlot = 2;
          phase = PHASE_BULK_COPY;
          logJSON("iniciando_test_capacidad");
        } else {
          logError("Error guardando enrolamiento base", r);
          phase = PHASE_WAIT_FINGER_1;
        }
      } else {
        logError("Error creando modelo (las dos capturas no coinciden)", r);
        phase = PHASE_WAIT_FINGER_1;
      }
      break;
    }

    case PHASE_BULK_COPY: {
      uint8_t r = finger.loadModel(baseSlot);
      if (r == FINGERPRINT_OK) {
        r = finger.storeModel(currentTestSlot);
        if (r == FINGERPRINT_OK) {
          successCount++;
          logJSONInt("slot_ok", "slot", currentTestSlot);

          currentTestSlot++;
          if (currentTestSlot > 250) {
            phase = PHASE_DONE;
          }
          delay(10);
        } else {
          failCount++;
          lastError = r;
          logJSONInt("slot_fail", "slot", currentTestSlot);
          logJSONInt("slot_fail", "codigo", r);

          if (r == 0x1A || r == 0x0D || r == 0x0A) {
            phase = PHASE_DONE;
          } else {
            currentTestSlot++;
            if (currentTestSlot > 250) phase = PHASE_DONE;
          }
        }
      } else {
        logError("Error cargando modelo base", r);
        phase = PHASE_DONE;
      }
      break;
    }

    case PHASE_DONE: {
      finger.getTemplateCount();

      logJSONInt("resultado_final", "slots_exitosos", successCount);
      logJSONInt("resultado_final", "slots_fallidos", failCount);
      logJSONInt("resultado_final", "ultimo_error", lastError);
      logJSONInt("resultado_final", "templates_en_sensor", finger.templateCount);
      logJSONInt("resultado_final", "capacidad_estimada", successCount);

      const char* interpretacion = "Desconocido";
      if (lastError == 0x1A) interpretacion = "PageID beyond range (slot > capacidad maxima)";
      else if (lastError == 0x0D) interpretacion = "Flash storage full / Database full";
      else if (lastError == 0x0A) interpretacion = "Invalid page ID";
      else if (lastError == 0x18) interpretacion = "Error writing flash";

      JsonDocument doc;
      doc["tipo"] = "interpretacion";
      doc["error_codigo"] = lastError;
      doc["significado"] = interpretacion;
      serializeJson(doc, Serial);
      Serial.println();

      phase = TestPhase(99);
      break;
    }
  }
}