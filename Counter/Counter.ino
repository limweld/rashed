#define IR_SENSOR_PIN A0 // IR sensor pin
#define MOTOR1_ENABLE D5 // Motor 1 enable pin (PWM)
#define MOTOR1_IN1 D1    // Motor 1 direction pin 1
#define MOTOR1_IN2 D2    // Motor 1 direction pin 2
#define MOTOR2_ENABLE D6 // Motor 2 enable pin (PWM)
#define MOTOR2_IN1 D3    // Motor 2 direction pin 1
#define MOTOR2_IN2 D4    // Motor 2 direction pin 2

// Motor Speeds
#define MOTOR1_SPEED_HIGH 255 // Max speed for motor 1
#define MOTOR2_SPEED_LOW 100  // Lower speed for motor 2

#define MOTOR_SPEED 255

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
IPAddress local_IP(192, 168, 0, 146);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

//IPAddress local_IP(192, 168, 4, 31);
//IPAddress gateway(192, 168, 4, 1);
//IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);   //optional
IPAddress secondaryDNS(8, 8, 4, 4); //optional


const long motor1RunTime = 100; // Motor 1 run time in milliseconds
const long motor2RunTime = 10; // Motor 2 run time in milliseconds


const String s = "";

int INFRA_SENSOR_INPUT = D0;

String infraSensorValue = "false"; // variable to store the sensor value
String isMotorARunning = "";
String isMotorBRunning = "";

String isMotorARunningTempVar = "";
String isMotorBRunningTempVar = "";

 JsonDocument doc;


void setup() {

  Serial.begin(115200);
  Serial.println();

    // Motor Pins Setup
  pinMode(MOTOR1_IN1, OUTPUT);
  pinMode(MOTOR1_IN2, OUTPUT);
  pinMode(MOTOR1_ENABLE, OUTPUT);
  pinMode(MOTOR2_ENABLE, OUTPUT);
  pinMode(MOTOR2_IN1, OUTPUT);
  pinMode(MOTOR2_IN2, OUTPUT);

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
    
    mqtt.subscribe("motor_a",controllerMotorASubscribed);
    mqtt.subscribe("motor_b",controllerMotorBSubscribed);
    mqtt.subscribe("motor_stop",controllerMotorStopSubscribed);
    
  } else {
    Serial.println(s+"failed, rc="+client.state());
  }

  // Enable Thread
  thread.onRun(publisher);
  thread.setInterval(interval);
  threadControl.add(&thread);

   pinMode(LED_BUILTIN,OUTPUT);
   digitalWrite(LED_BUILTIN,LOW);

   pinMode(INFRA_SENSOR_INPUT,INPUT);
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

      mqtt.subscribe("motor_a",controllerMotorASubscribed);
      mqtt.subscribe("motor_b",controllerMotorBSubscribed);
      mqtt.subscribe("motor_stop",controllerMotorStopSubscribed);
     
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

    
}

void publisher() {
  infraSensorValue = infraSensor();
  mqtt.publish("infra_sensor","{\"process\":{\"status\":"+ infraSensorValue + "}}");

  if(isMotorARunningTempVar != isMotorARunning){
    mqtt.publish("motor_a","{\"motor1\":{\"status\":"+ isMotorARunning + "}}");
    if(isMotorARunning == "false"){
      mqtt.publish("task","{\"motor1\":{\"job\":\"done\"}}");
    }
    isMotorARunningTempVar = isMotorARunning;
  }
  
  if(isMotorBRunningTempVar != isMotorBRunning){
    mqtt.publish("motor_b","{\"motor2\":{\"status\":"+ isMotorBRunning +"}}");
    if(isMotorBRunning == "false"){
      mqtt.publish("task","{\"motor2\":{\"job\":\"done\"}}");
    }
    isMotorBRunningTempVar = isMotorBRunning;
  }
}

String infraSensor(){
  return digitalRead(INFRA_SENSOR_INPUT) == HIGH ? "false": "true";
}

void controllerMotorASubscribed(String topic, String message){
    Serial.println(s+"Message arrived in function ["+topic+"] "+message);
    deserializeJson(doc, message);
    if(doc["motor1"]["status"] == true){
      runningMotorA();
    }
}

void controllerMotorBSubscribed(String topic, String message){
    Serial.println(s+"Message arrived in function ["+topic+"] "+message);
    deserializeJson(doc, message);
    if(doc["motor2"]["status"] == true){
      runningMotorB();
    }
}

void controllerMotorStopSubscribed(String topic, String message){

    Serial.println(s+"Motor STOP");
    commontStopMottor();
}

void runningMotorA(){

  isMotorARunning = "true";
  isMotorARunningTempVar = "true";
  Serial.println(s+"Motor A is Running");
  
  digitalWrite(MOTOR1_IN1, HIGH);
  digitalWrite(MOTOR1_IN2, LOW);
  analogWrite(MOTOR1_ENABLE, MOTOR_SPEED);

  isMotorARunning = "false";
  digitalWrite(MOTOR2_IN1, LOW);
  digitalWrite(MOTOR2_IN2, LOW);
  analogWrite(MOTOR2_ENABLE, MOTOR_SPEED);

  delay(75);

  commontStopMottor();
  
}

void runningMotorB(){

  isMotorBRunning = "true";
  isMotorBRunningTempVar = "true";
  Serial.println(s+"Motor B is Running");

  digitalWrite(MOTOR2_IN1, HIGH);
  digitalWrite(MOTOR2_IN2, LOW);
  analogWrite(MOTOR2_ENABLE, MOTOR_SPEED);

  isMotorBRunning = "false";
  digitalWrite(MOTOR1_IN1, LOW);
  digitalWrite(MOTOR1_IN2, LOW);
  analogWrite(MOTOR1_ENABLE, MOTOR_SPEED);

  delay(500);

  commontStopMottor();
}



void commontStopMottor(){

    Serial.println(s+"Motor STOP");
  
    digitalWrite(MOTOR1_IN1, LOW);
    digitalWrite(MOTOR1_IN2, LOW);
    digitalWrite(MOTOR1_ENABLE, LOW);

    digitalWrite(MOTOR2_IN1, LOW);
    digitalWrite(MOTOR2_IN2, LOW);
    digitalWrite(MOTOR2_ENABLE, LOW);
    
}
