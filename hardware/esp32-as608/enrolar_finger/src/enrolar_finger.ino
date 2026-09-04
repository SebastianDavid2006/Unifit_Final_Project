#include <Adafruit_Fingerprint.h>
#include "config.h"

HardwareSerial serialSensor(2);
Adafruit_Fingerprint finger(&serialSensor);

void setup() {
  Serial.begin(BAUD_RATE_SERIAL);

  serialSensor.begin(BAUD_RATE_SENSOR, SERIAL_8N1, PIN_SENSOR_RX, PIN_SENSOR_TX);
  delay(1000);

  finger.begin(BAUD_RATE_SENSOR);
  delay(500);

  if (finger.verifyPassword()) {
    Serial.println("{\"tipo\":\"ready\",\"mensaje\":\"AS608 conectado\"}");
  } else {
    Serial.println("{\"tipo\":\"error\",\"mensaje\":\"AS608 no detectado. Revisa cables RX/TX y alimentacion 5V\"}");
  }

  finger.getTemplateCount();
  Serial.print("{\"tipo\":\"info\",\"templates\":");
  Serial.print(finger.templateCount);
  Serial.println("}");
}

void loop() {
  if (Serial.available() == 0) return;

  String comando = Serial.readStringUntil('\n');
  comando.trim();

  if (comando.startsWith("ENROLL:")) {
    int slot = comando.substring(7).toInt();
    procesarEnrolamiento(slot);
  } else if (comando == "VERIFY") {
    procesarVerificacion();
  } else if (comando == "STATUS") {
    Serial.print("{\"tipo\":\"info\",\"templates\":");
    finger.getTemplateCount();
    Serial.print(finger.templateCount);
    Serial.println("}");
  }
}


// Se hacen 2 capturas del mismo dedo para generar un template de calidad
void procesarEnrolamiento(int slot) {
  Serial.println("{\"tipo\":\"enroll_step\",\"paso\":1,\"mensaje\":\"Coloca el dedo\"}");

  int img = capturarHuella();
  if (img != FINGERPRINT_OK) {
    enviarErrorEnrol(img);
    return;
  }

  int res = finger.image2Tz(1);
  if (res != FINGERPRINT_OK) {
    Serial.println("{\"tipo\":\"enroll_result\",\"ok\":false,\"error\":\"No se pudo procesar primera imagen\"}");
    return;
  }

  Serial.println("{\"tipo\":\"enroll_step\",\"paso\":2,\"mensaje\":\"Retira el dedo\"}");
  delay(2000);

  Serial.println("{\"tipo\":\"enroll_step\",\"paso\":3,\"mensaje\":\"Coloca el mismo dedo otra vez\"}");
  img = capturarHuella();
  if (img != FINGERPRINT_OK) {
    enviarErrorEnrol(img);
    return;
  }

  res = finger.image2Tz(2);
  if (res != FINGERPRINT_OK) {
    Serial.println("{\"tipo\":\"enroll_result\",\"ok\":false,\"error\":\"No se pudo procesar segunda imagen\"}");
    return;
  }

  res = finger.createModel();
  if (res != FINGERPRINT_OK) {
    Serial.println("{\"tipo\":\"enroll_result\",\"ok\":false,\"error\":\"Las dos capturas no coinciden, intenta de nuevo\"}");
    return;
  }

  res = finger.storeModel(slot);
  if (res == FINGERPRINT_OK) {
    Serial.print("{\"tipo\":\"enroll_result\",\"ok\":true,\"slot\":");
    Serial.print(slot);
    Serial.println("}");
  } else {
    Serial.print("{\"tipo\":\"enroll_result\",\"ok\":false,\"error\":\"Error al guardar en sensor, slot ");
    Serial.print(slot);
    Serial.println("\"}");
  }
}

void enviarErrorEnrol(int imagen) {
  if (imagen == FINGERPRINT_NOFINGER) {
    Serial.println("{\"tipo\":\"enroll_result\",\"ok\":false,\"error\":\"Sin dedo detectado\"}");
  } else if (imagen == FINGERPRINT_IMAGEFAIL) {
    Serial.println("{\"tipo\":\"enroll_result\",\"ok\":false,\"error\":\"Imagen ilegible, intenta de nuevo\"}");
  } else {
    Serial.println("{\"tipo\":\"enroll_result\",\"ok\":false,\"error\":\"Error de captura\"}");
  }
}

void procesarVerificacion() {
  int resultado = capturarHuella();

  if (resultado != FINGERPRINT_OK) {
    if (resultado == FINGERPRINT_NOFINGER) {
      Serial.println("{\"tipo\":\"verify_result\",\"ok\":false,\"error\":\"Sin dedo detectado\"}");
    } else {
      Serial.println("{\"tipo\":\"verify_result\",\"ok\":false,\"error\":\"Error de captura\"}");
    }
    return;
  }

  int p = finger.image2Tz();
  if (p != FINGERPRINT_OK) {
    Serial.println("{\"tipo\":\"verify_result\",\"ok\":false,\"error\":\"No se pudo procesar imagen\"}");
    return;
  }

  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    Serial.print("{\"tipo\":\"verify_result\",\"ok\":true,\"slot\":");
    Serial.print(finger.fingerID);
    Serial.println("}");
  } else {
    Serial.println("{\"tipo\":\"verify_result\",\"ok\":false,\"error\":\"Huella no encontrada\"}");
  }
}

int capturarHuella() {
  unsigned long inicio = millis();
  int imagen = -1;

  while (millis() - inicio < TIMEOUT_CAPTURA_MS) {
    imagen = finger.getImage();
    if (imagen == FINGERPRINT_OK) return FINGERPRINT_OK;
    if (imagen == FINGERPRINT_NOFINGER) continue;
    return imagen;
  }

  return FINGERPRINT_NOFINGER;
}