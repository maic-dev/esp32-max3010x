#include <Arduino.h>

// Definir el pin del LED (generalmente GPIO 2)
#define LED_BUILTIN 2

void setup() {
  // Configurar el pin del LED como salida
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // Encender el LED
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000); // Esperar 1 segundo

  // Apagar el LED
  digitalWrite(LED_BUILTIN, LOW);
  delay(5000); // Esperar 1 segundo
}
