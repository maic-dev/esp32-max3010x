#include <WiFi.h>
#include <WebServer.h>

// Configuración del LED (generalmente GPIO 2)
#define LED_BUILTIN 2

// Credenciales de tu red Wi-Fi
const char* ssid = "CEVALLOS-MIELES";
const char* password = "#KiraPZAMMM.";

// Crear el servidor web en el puerto 80
WebServer server(80);

// Página HTML para controlar el LED
const char webpage[] = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>Control del LED</title>
</head>
<body>
  <h1>Controlar LED ESP32</h1>
  <button onclick="sendRequest('on')">Encender LED</button>
  <button onclick="sendRequest('off')">Apagar LED</button>
  <script>
    function sendRequest(action) {
      fetch('/' + action);
    }
  </script>
</body>
</html>
)rawliteral";

// Manejar solicitud para encender el LED
void handleLEDOn() {
  digitalWrite(LED_BUILTIN, HIGH);
  server.send(200, "text/plain", "LED encendido");
}

// Manejar solicitud para apagar el LED
void handleLEDOff() {
  digitalWrite(LED_BUILTIN, LOW);
  server.send(200, "text/plain", "LED apagado");
}

// Manejar solicitud para servir la página web
void handleRoot() {
  server.send(200, "text/html", webpage);
}

void setup() {
  // Configurar el LED como salida
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  // Conectar al Wi-Fi
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.println("Conectando a Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConexión establecida.");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());

  // Configurar manejadores de rutas
  server.on("/", handleRoot);
  server.on("/on", handleLEDOn);
  server.on("/off", handleLEDOff);

  // Iniciar el servidor
  server.begin();
  Serial.println("Servidor iniciado.");
}

void loop() {
  // Manejar solicitudes del servidor
  server.handleClient();
}
