#include <Arduino.h>

#define BATT_PIN 33

#define BATT_LOW 1.6
#define BATT_HIGH 2.3
#define VOLTAGE_DIV 2.0 / 3.0

void initBattery();
int read_battery_pin();