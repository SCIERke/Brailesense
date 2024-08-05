#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// called this way, it uses the default address 0x40
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

#define SERVOMIN  125
#define SERVOMAX  575

// our servo # counter
uint8_t servonum = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("16 channel Servo test!");

  pwm.begin();
  
  pwm.setPWMFreq(60);  // Analog servos run at ~60 Hz updates
  //yield();
  pinMode(2 , INPUT_PULLUP);
  pinMode(3 , INPUT_PULLUP);
}

// the code inside loop() has been updated by Robojax
void loop() {
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    // String data = "111111";
    for (int i = 0; i<= 5; i++){
      if (data[i]-'0'){
        Serial.println(i);
        pwm.setPWM(i, 0, 350);
      } else {
        pwm.setPWM(i, 0, 100); 
      }
  }
  // int val_2 = digitalRead(2);

  // int val_3 = digitalRead(3);

  
}

  // for (int i = 0 ; i <= 5 ;i++) {
  //   pwm.setPWM(i, 0, 125 );
//   delay(500);
  //   pwm.setPWM(i, 0, 255 );
//   delay(500);
  //   pwm.setPWM(i, 0, 450 );
//   delay(500);
  //   pwm.setPWM(i, 0, 575 );
//   delay(500);
  // }
  

 
}