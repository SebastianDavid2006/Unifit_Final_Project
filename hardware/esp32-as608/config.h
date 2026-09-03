#ifndef CONFIG_H
#define CONFIG_H

#define BAUD_RATE_SERIAL   115200
#define BAUD_RATE_SENSOR   57600

#define PIN_SENSOR_RX      16  // ESP32 RX  <- AS608 TX
#define PIN_SENSOR_TX      17  // ESP32 TX  -> AS608 RX

#define PIN_LED            2   // LED integrado del ESP32

#define MAX_INTENTOS_CAPTURA 3
#define TIMEOUT_CAPTURA_MS   10000

#endif
