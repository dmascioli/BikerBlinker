#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEUUID.h>
#include <BLEServer.h>

#define DEVICE_NAME "BikerBlinker"

void initBluetooth();
void processCommand(std::string string);