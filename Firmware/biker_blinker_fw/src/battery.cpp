#include "battery.h"

int last_analog_read = 0;

void initBattery()
{
    // GPIO Initialization
    pinMode(BATT_PIN, INPUT);
}

int read_battery_pin()
{
    float Aref = 1.1; // ESP32 has 1.1V ADC reference
    unsigned int total = 0;
    float voltage; // converted to volt

    // get average
    for (int i = 0; i < 16; i++)
        total += analogRead(BATT_PIN);

    total = total / (float)16;

    // account for voltage divider
    //total = total * (float)2 / (float)3;

    voltage = total * (3.3 / 4095.0);

    float percentage = (voltage - BATT_LOW) / (float)(BATT_HIGH - BATT_LOW);
    percentage *= 100;

    Serial.printf("%f\t%.2f%\n", voltage, percentage);

    return int(percentage);
}
