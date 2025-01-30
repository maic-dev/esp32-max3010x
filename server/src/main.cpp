#include <WiFi.h>
#include <FirebaseESP32.h>
#include <Wire.h>
#include "MAX30105.h"
#include "spo2_algorithm.h"
#include "heartRate.h"

// Credenciales de WiFi
#define WIFI_SSID "CEVALLOS-MIELES"
#define WIFI_PASSWORD "#KiraPZAMMM."

// Configuración de Firebase
#define FIREBASE_HOST "https://esp32-max30102-78020-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "BIiHXr70V0m9dPLvq0nYwfQ6ZtUmszHobnkVNjih"

// Inicializar objetos
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;
MAX30105 particleSensor;

#define MAX_BRIGHTNESS 255
#define LED_PIN 2 // LED del ESP32
#define IR_THRESHOLD 5000 // Umbral de detección

uint32_t irBuffer[100];
uint32_t redBuffer[100];

int32_t bufferLength;
int32_t spo2;
int8_t validSPO2;
int32_t heartRate;
int8_t validHeartRate;

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  // Conectar a WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando a WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado");

  // Configurar Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("Inicializando MAX30102...");
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("Error: No se encontró el MAX30102.");
    while (1);
  }

  // Configuración del sensor
  particleSensor.setup(50, 1, 2, 100, 69, 4096);
  Serial.println("MAX30102 inicializado correctamente.");
}

void loop() {
  if (particleSensor.check() && particleSensor.getIR() > IR_THRESHOLD) {
    digitalWrite(LED_PIN, LOW);
    bufferLength = 100;

    for (byte i = 0; i < bufferLength; i++) {
      while (particleSensor.available() == false) {
        particleSensor.check();
      }

      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.nextSample();

      Serial.print("Red: ");
      Serial.print(redBuffer[i]);
      Serial.print("\t IR: ");
      Serial.println(irBuffer[i]);
    }

    // Calcular SpO2 y frecuencia cardíaca
    maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

    Serial.print("SpO2: ");
    Serial.print(spo2);
    Serial.print(validSPO2 ? " (Válido)" : " (Inválido)");
    Serial.print("\tHR: ");
    Serial.print(heartRate);
    Serial.println(validHeartRate ? " BPM (Válido)" : " BPM (Inválido)");

    // Enviar datos a Firebase
    if (Firebase.setInt(firebaseData, "/sensor/Sp02", spo2)) {
      Serial.println("SpO2 guardado en Firebase");
    } else {
      Serial.print("Error SpO2: ");
      Serial.println(firebaseData.errorReason());
    }

    if (Firebase.setInt(firebaseData, "/sensor/BPM", heartRate)) {
      Serial.println("Frecuencia cardíaca guardada en Firebase");
    } else {
      Serial.print("Error HR: ");
      Serial.println(firebaseData.errorReason());
    }

    delay(1000);
  } else {
    digitalWrite(LED_PIN, HIGH);
    delay(500);
    digitalWrite(LED_PIN, LOW);
    delay(500);
    Serial.println("No se detecta un dedo.");
  }
}