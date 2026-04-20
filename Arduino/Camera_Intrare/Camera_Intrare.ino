#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>

// AI-THINKER Pins (Standard)
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22
#define LED_GPIO_NUM       4 

// Hardware Pins
#define IR_SENSOR_PIN     13 
#define SERVO_PIN         14 

#define SEM_RED    2
#define SEM_YELLOW 15
#define SEM_GREEN  12

const char* ssid = "Telekom-9Oq5lD";
const char* password = "abcd1234";

Servo barrierServo;
bool isLocked = false; // Prevents re-triggering while car is still there
unsigned long lastCaptureTime = 0;
const unsigned long throttleInterval = 10000; 

void setup() {
  Serial.begin(115200);
  pinMode(IR_SENSOR_PIN, INPUT);
  
  pinMode(SEM_RED, OUTPUT);
  pinMode(SEM_YELLOW, OUTPUT);
  pinMode(SEM_GREEN, OUTPUT);
    // Start with Red ON
  digitalWrite(SEM_RED, HIGH);

  // Servo Setup
  barrierServo.attach(SERVO_PIN);
  barrierServo.write(0); // Ensure barrier is closed at start

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;
  config.frame_size = FRAMESIZE_XGA;
  config.jpeg_quality = 8;
  config.fb_count = 1;
  config.grab_mode = CAMERA_GRAB_LATEST; 
  config.fb_location = CAMERA_FB_IN_PSRAM;

  ledcAttach(LED_GPIO_NUM, 5000, 8);

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) { Serial.printf("Camera init failed"); return; }

  sensor_t * s = esp_camera_sensor_get();
  s->set_hmirror(s, 1);
  s->set_contrast(s, 2);
  s->set_sharpness(s, 2);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi connected");
}

void setSemaphore(bool r, bool y, bool g) {
  digitalWrite(SEM_RED, r);    // Use SEM_ instead of PIN_
  digitalWrite(SEM_YELLOW, y); 
  digitalWrite(SEM_GREEN, g);
}

void setFlash(int duty) { ledcWrite(LED_GPIO_NUM, duty); }

void openBarrier() {
  Serial.println("🔓 BARRIER OPENING...");
  barrierServo.write(90); // 90 Degrees
  delay(5000);            // Wait 5 seconds for car to pass
  barrierServo.write(0);  // Close
  Serial.println("🔒 BARRIER CLOSED");
}

// Returns "OK", "RETRY", or "ERROR"
String captureAndSend() {
  setFlash(20);
  delay(150);

  camera_fb_t * fb_stale = esp_camera_fb_get();
  if(fb_stale) esp_camera_fb_return(fb_stale);

  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) { setFlash(0); return "ERROR"; }

  HTTPClient http;
  // UPDATED ROUTE
  http.begin("http://192.168.1.14:3000/ESP32/upload");
  http.addHeader("Content-Type", "image/jpeg");

  int httpResponseCode = http.POST(fb->buf, fb->len);
  String response = "ERROR";

  if (httpResponseCode > 0) {
    response = http.getString(); // Get "OK" or "RETRY" from backend
  }

  Serial.printf("Server says: %s\n", response.c_str());

  http.end();
  esp_camera_fb_return(fb);
  setFlash(0);
  return response;
}

void loop() {
  int sensorState = digitalRead(IR_SENSOR_PIN);
  unsigned long currentMillis = millis();

  // 1. Reset logic: If car leaves, allow next detection
  if (sensorState == HIGH) {
    isLocked = false; 
  }

  // 2. Detection logic: Car arrives + Not locked + Cooldown passed
  if (sensorState == LOW && !isLocked && (currentMillis - lastCaptureTime >= throttleInterval)) {
    Serial.println("🚗 Car Detected! Starting attempts...");
    bool accessGranted = false;
    // TRY 3 TIMES
    for (int i = 1; i <= 3; i++) {
      Serial.printf("Attempt %d/3... ", i);
      setSemaphore(LOW, HIGH, LOW); // VERIFICAM MASINA
      String result = captureAndSend();
      if (result == "OK") {
        accessGranted = true;
        setSemaphore(LOW, LOW, HIGH); // VERIFICAM MASINA
        break; // Stop retrying, we got it!
      } else {
        Serial.println("Plate not recognized. Waiting for retry...");
        setSemaphore(HIGH, LOW, LOW); // A FOST EROARE
        delay(2000); // 2 second gap between retries
      }
    }

    if (accessGranted) {
      openBarrier();
    } else {
      Serial.println("❌ Access Denied after 3 shots.");
    }
    setSemaphore(HIGH, LOW, LOW); // A FOST EROARE
    // Lock it so it doesn't trigger again until the car moves away
    isLocked = true;
    lastCaptureTime = millis();
  }
  
  delay(50);
}