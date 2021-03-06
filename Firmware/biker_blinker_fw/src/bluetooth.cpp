#include "bluetooth.h"
#include "blinkers.h"
#include <string.h>

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define CMD_SERVICE_UUID "dad223bb-67b0-40d0-8a76-4bca05ae04b6"
#define CMD_CHARACTERISTIC_UUID "cda2e29c-d126-4887-9bfc-5a390dfe8255"

#define BAT_CHARACTERISTIC_UUID "fb5929c7-0a1c-42dc-b17a-98c8a3fa9fb9"

#define BAT_SERVICE_UUID BLEUUID("0x180F")
#define BAT_CHARACTERISITC_UUID BLEUUID("0x2A19")

BLECharacteristic *pBatteryCharacteristic;

class CommandCallbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic)
    {
        std::string value = pCharacteristic->getValue();

        processCommand(value);

        if (value.length() > 0)
        {
            Serial.print("New value: ");
            for (int i = 0; i < value.length(); i++)
                Serial.print(value[i]);
            Serial.println("\n");
        }
    }
};

void processCommand(std::string value)
{
    if (value.compare("leftoff") == 0)
    {
        Serial.println("Command received: leftoff");
        leftOff();
    }
    if (value.compare("left") == 0)
    {
        Serial.println("Command received: left");
        leftOn();
    }

    if (value.compare("rightoff") == 0)
    {
        Serial.println("Command received: rightoff");
        //rightOff();
    }
    if (value.compare("right") == 0)
    {
        Serial.println("Command received: right");
        //rightOn();
    }

    if (value.compare("brakeoff") == 0)
    {
        Serial.println("Command received: brakeoff");
        TEST_brakeOff();
    }
    if (value.compare("brake") == 0)
    {
        Serial.println("Command received: brake");
        TEST_brakeOn();
    }
}

void initBluetooth()
{

    BLEDevice::init(DEVICE_NAME);
    BLEServer *pServer = BLEDevice::createServer();

    // create the command service and characteristic, will listen for commands from app
    BLEService *pCommandService = pServer->createService(CMD_SERVICE_UUID);
    BLECharacteristic *pCommandCharacteristic = pCommandService->createCharacteristic(
        CMD_CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE);

    pBatteryCharacteristic = pCommandService->createCharacteristic(
        BAT_CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_READ);

    pCommandCharacteristic->setCallbacks(new CommandCallbacks());
    pCommandCharacteristic->setValue("");
    pBatteryCharacteristic->setValue("");
    pCommandService->start();

    // create service and characteristic to read battery level
    /*
    BLEService *pBatteryService = pServer->createService(BAT_SERVICE_UUID);
    BLECharacteristic *pBatteryCharacteristic = pBatteryService->createCharacteristic(
        BAT_CHARACTERISITC_UUID,
        BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);

    pBatteryCharacteristic->addDescriptor(new BLEDescriptor("Percentage"));
    uint8_t start_battery_level = 100;
    pBatteryCharacteristic->setValue(&start_battery_level, 1);
    pBatteryService->start();
    */
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(CMD_SERVICE_UUID);
    //pAdvertising->addServiceUUID(pBatteryService->getUUID());
    pAdvertising->setScanResponse(true);

    pAdvertising->setMinPreferred(0x06); // functions that help with iPhone connections issue
    pAdvertising->setMinPreferred(0x12);

    BLEDevice::startAdvertising();
}

void setBatLevel(int percentage)
{
    char buf[10] = {0};
    std::string val = itoa(percentage, buf, 10);
    pBatteryCharacteristic->setValue(val);
}