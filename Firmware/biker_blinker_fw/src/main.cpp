#include <Arduino.h>
#include "bluetooth.h"
#include "blinkers.h"
#include "battery.h"

int batteryLevel = 0;

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  initBluetooth();
  initBlinkers();
  initBattery();
}

void loop()
{

  batteryLevel = read_battery_pin();

  setBatLevel(batteryLevel);

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