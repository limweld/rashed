#define FLAG_20 D6
#define FLAG_50 D5
#define FLAG_100 D4
#define FLAG_200 D3
#define FLAG_500 D2
#define FLAG_1000 D1
#define FLAG_FAKE D0


#include <Servo.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <PubSubClientTools.h>
#include <ArduinoJson.h>

#include <Thread.h>             // https://github.com/ivanseidel/ArduinoThread
#include <ThreadController.h>

//#define MQTT_SERVER "192.168.4.1"
#define MQTT_SERVER "192.168.0.150"

//#define WIFI_SSID "UNLIPOP_LTD_UC"
//#define WIFI_PASS "@NiceOne123"

#define WIFI_SSID "_Amethyst07"
#define WIFI_PASS "@realme2020"


const int CLOSE_ANGLE = 0;
const int OPEN_ANGLE = 90;

const char* MQTT_USERNAME = "mulesoft";
const char* MQTT_PASSWORD = "@Wiskyvodka101";

WiFiClient espClient;
PubSubClient client(MQTT_SERVER, 1883, espClient);
PubSubClientTools mqtt(client);

ThreadController threadControl = ThreadController();
Thread thread = Thread();

const int interval = 1500;
//const int interval = 6000;
const String channelNumber = "3";


IPAddress local_IP(192, 168, 0, 148);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);   //optional
IPAddress secondaryDNS(8, 8, 4, 4); //optional


Servo servo_flag_20;
Servo servo_flag_50;
Servo servo_flag_100;
Servo servo_flag_200;
Servo servo_flag_500;
Servo servo_flag_1000;
Servo servo_flag_fake;

const String s = "";

boolean flag_20_OpenTempVar = false;
boolean flag_50_OpenTempVar = false;
boolean flag_100_OpenTempVar = false;
boolean flag_200_OpenTempVar = false;
boolean flag_500_OpenTempVar = false;
boolean flag_1000_OpenTempVar = false;
boolean flag_Fake_OpenTempVar = false;


JsonDocument doc;


void setup() {

  Serial.begin(115200);
  Serial.println();

  servo_flag_20.attach(FLAG_20);
  servo_flag_50.attach(FLAG_50);
  servo_flag_100.attach(FLAG_100);
  servo_flag_200.attach(FLAG_200);
  servo_flag_500.attach(FLAG_500);
  servo_flag_1000.attach(FLAG_1000);
  servo_flag_fake.attach(FLAG_FAKE);

  // Configures static IP address
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("STA Failed to configure");
  }

  // Connect to WiFi
  Serial.print(s+"Connecting to WiFi: "+WIFI_SSID+" ");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("connected");

  // Connect to MQTT
  Serial.print(s+"Connecting to MQTT: "+MQTT_SERVER+" ... ");
  if (client.connect("ESP8266Client",MQTT_USERNAME,MQTT_PASSWORD)) {
    Serial.println("connected");
    
    mqtt.subscribe("flag_sorter",controllerFlagSorter);
    
  } else {
    Serial.println(s+"failed, rc="+client.state());
  }

  // Enable Thread
  thread.onRun(publisher);
  thread.setInterval(interval);
  threadControl.add(&thread);

   pinMode(LED_BUILTIN,OUTPUT);
   digitalWrite(LED_BUILTIN,LOW);


}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str(),MQTT_USERNAME,MQTT_PASSWORD)) {
      Serial.println("connected");

      mqtt.subscribe("flag_sorter",controllerFlagSorter);
      
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}


void loop() {

  if (!client.connected()) {
    reconnect();
  }
  
  client.loop();
  threadControl.run();

  servo_flag_20.write( flag_20_OpenTempVar == false ? CLOSE_ANGLE:OPEN_ANGLE);
  servo_flag_50.write( flag_50_OpenTempVar == false ? CLOSE_ANGLE:OPEN_ANGLE);
  servo_flag_100.write( flag_100_OpenTempVar == false ? CLOSE_ANGLE:OPEN_ANGLE);
  servo_flag_200.write( flag_200_OpenTempVar == false ? CLOSE_ANGLE:OPEN_ANGLE);
  servo_flag_500.write( flag_500_OpenTempVar == false ? CLOSE_ANGLE:OPEN_ANGLE);
  servo_flag_1000.write( flag_1000_OpenTempVar == false ? CLOSE_ANGLE:OPEN_ANGLE);
  servo_flag_fake.write( flag_Fake_OpenTempVar == false ? CLOSE_ANGLE:75);
  
}

void publisher() {

}


void controllerFlagSorter(String topic, String message){

    Serial.println(s+message);
    deserializeJson(doc, message);
    if(doc["flag"]["bill"] == "20" || doc["flag"]["bill"] == "50" || doc["flag"]["bill"] == "100" || doc["flag"]["bill"] == "200" || doc["flag"]["bill"] == "500" || doc["flag"]["bill"] == "1000" || doc["flag"]["bill"] == "fake" ){
      flag_20_OpenTempVar = doc["flag"]["status"];
    }
    
    if(doc["flag"]["bill"] == "50" || doc["flag"]["bill"] == "100" || doc["flag"]["bill"] == "200" || doc["flag"]["bill"] == "500" || doc["flag"]["bill"] == "1000" || doc["flag"]["bill"] == "fake" ){  
      flag_50_OpenTempVar =  doc["flag"]["status"];
    }
    
    if(doc["flag"]["bill"] == "100" || doc["flag"]["bill"] == "200" || doc["flag"]["bill"] == "500" || doc["flag"]["bill"] == "1000" || doc["flag"]["bill"] == "fake" ){
      flag_100_OpenTempVar =  doc["flag"]["status"];
    }
    
    if(doc["flag"]["bill"] == "200" || doc["flag"]["bill"] == "500" || doc["flag"]["bill"] == "1000" || doc["flag"]["bill"] == "fake" ){
      flag_200_OpenTempVar =  doc["flag"]["status"];
    }
    
    if(doc["flag"]["bill"] == "500" || doc["flag"]["bill"] == "1000" || doc["flag"]["bill"] == "fake" ){
      flag_500_OpenTempVar =  doc["flag"]["status"];
    }

    if(doc["flag"]["bill"] == "1000" || doc["flag"]["bill"] == "fake"){
      flag_1000_OpenTempVar =  doc["flag"]["status"];

    }
    
    if(doc["flag"]["bill"] == "fake"){
       flag_Fake_OpenTempVar =  doc["flag"]["status"];
    }

    if(doc["flag"]["bill"] == "all"){
      flag_20_OpenTempVar = doc["flag"]["status"];
      flag_50_OpenTempVar = doc["flag"]["status"];
      flag_100_OpenTempVar = doc["flag"]["status"];
      flag_200_OpenTempVar = doc["flag"]["status"];
      flag_500_OpenTempVar = doc["flag"]["status"];
      flag_1000_OpenTempVar = doc["flag"]["status"]; 
      flag_Fake_OpenTempVar = doc["flag"]["status"];
    }
}
