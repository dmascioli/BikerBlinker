#include <Arduino.h>
#include "bluetooth.h"

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  initBluetooth();
}

void loop()
{
  // put your main code here, to run repeatedly:
}