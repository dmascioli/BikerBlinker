#include <Arduino.h>
#include "bluetooth.h"
#include "blinkers.h"

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  initBluetooth();
  initBlinkers();
}

void loop()
{
  /*
  TEST_leftBlinkOn();
  delay(10000);
  TEST_leftBlinkOff();
  delay(2000);

  TEST_brakeOn();
  delay(2000);
  TEST_brakeOff();
  delay(2000);
  */
}