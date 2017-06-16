// Libraries
#include <ESP8266WiFi.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_INA219.h>
#include <ArduinoJson.h>


WiFiClient client;


const char* ssid     = "ARI_NET";
const char* password = "raspberry";
 

Adafruit_INA219 ina219;


String family = "Battery";
String name = "House Battery Bank Monitor";
int id = 1;
float shuntvoltage;
float busvoltage;
float current;
float loadvoltage;
  
 StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();

void setup()   {     
             
  Serial.begin(115200);

  //JSON set up


  // Init INA219
  ina219.begin();
  //ina219.setCalibration_16V_400mA();
  ina219.setCalibration_16V_32A();

  // We start by connecting to a WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
 
  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  const int httpPort = 8080;
  if (!client.connect("192.168.10.1", httpPort)) {
    Serial.println("connection to node failed");
    return;
  }
  
}


void loop() {

  measureCurrent();

  delay(1000);

  root["family"] = family;
  root["name"] = name;
  root["shuntvoltage"] = shuntvoltage;
  root["busvoltage"] = busvoltage;
  root["current"] = current;
  root["loadvoltage"] = loadvoltage;

  root.printTo(client);


  delay(1000);
 
}

// Function to measure current
float measureCurrent() {

  // Measure
  shuntvoltage = ina219.getShuntVoltage_mV();
  busvoltage = ina219.getBusVoltage_V();
  current = ina219.getCurrent_mA();
  loadvoltage = busvoltage + (shuntvoltage / 1000);
  
  Serial.print("Bus Voltage:   "); Serial.print(busvoltage); Serial.println(" V");
  Serial.print("Shunt Voltage: "); Serial.print(shuntvoltage); Serial.println(" mV");
  Serial.print("Load Voltage:  "); Serial.print(loadvoltage); Serial.println(" V");
  Serial.print("Current:       "); Serial.print(current); Serial.println(" mA");
  Serial.println("");

  // If negative, set to zero
  if (current < 0) {
    current = 0.0; 
  }
 
  return current;
}

