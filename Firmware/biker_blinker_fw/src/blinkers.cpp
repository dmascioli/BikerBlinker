#include "blinkers.h"

BlinkerState eBlinkerState;
std::string valueBT = "";

TaskHandle_t leftBlinkTask;
TaskHandle_t rightBlinkTask;

void initBlinkers()
{
    // GPIO Initialization
    pinMode(LEFT_BLINKER, OUTPUT);
    pinMode(BRAKE, OUTPUT);
    pinMode(RIGHT_BLINKER, OUTPUT);

    // state machine initialization
    BlinkerState eBlinkerState = BLINKER_STATE_INIT;
}

void BlinkerProcess()
{
    int retVal = 0;

    switch (eBlinkerState)
    {
    case BLINKER_STATE_INIT:
        break;
    case BLINKER_STATE_GET_COMMAND:
        break;
    case BLINKER_STATE_SET_COMMAND:
        break;
    case BLINKER_STATE_LEFT:
        break;
    case BLINKER_STATE_BRAKE:
        break;
    case BLINKER_STATE_RIGHT:
        break;
    case BLINKER_STATE_CNT:
    default:
        retVal = -1;
        break;
    }
}

void leftOn()
{
    // spawn a task on the second core to blink the indicator instead of just leaving it on
    xTaskCreatePinnedToCore(
        leftOnTask,     /* Function to implement the task */
        "Left Blinker", /* Name of the task */
        10000,          /* Stack size in words */
        NULL,           /* Task input parameter */
        1,              /* Priority of the task */
        &leftBlinkTask, /* Task handle. */
        1);             /* Core where the task should run */
}

void leftOff()
{
    vTaskDelete(leftBlinkTask);
    delay(250);
    digitalWrite(LEFT_BLINKER, LOW);
}

void leftOnTask(void *parameter)
{
    while (1)
    {
        digitalWrite(LEFT_BLINKER, LOW);
        delay(250);
        digitalWrite(LEFT_BLINKER, HIGH);
        delay(250);
    }
}

void TEST_leftOn()
{
    Serial.println("Left On");
    digitalWrite(LEFT_BLINKER, LOW);
}
void TEST_leftOff()
{
    Serial.println("Left Off");
    digitalWrite(LEFT_BLINKER, HIGH);
}
void TEST_leftBlinkOn()
{
    leftOn();
}
void TEST_leftBlinkOff()
{
    leftOff();
}

void TEST_brakeOn()
{
    Serial.println("Brake On");
    digitalWrite(BRAKE, HIGH);
}
void TEST_brakeOff()
{
    Serial.println("Brake Off");
    digitalWrite(BRAKE, LOW);
}