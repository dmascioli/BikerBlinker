#include <Arduino.h>

#define LEFT_BLINKER 25
#define BRAKE 26
#define RIGHT_BLINKER 27

typedef enum BLINKER_STATE
{
    BLINKER_STATE_INIT = 0,
    BLINKER_STATE_GET_COMMAND,
    BLINKER_STATE_SET_COMMAND,
    BLINKER_STATE_LEFT,
    BLINKER_STATE_BRAKE,
    BLINKER_STATE_RIGHT,

    BLINKER_STATE_CNT,
} BlinkerState;

void initBlinkers();
void BlinkerProcess();

void leftOn();
void leftOff();
void leftOnTask(void *parameter);

void TEST_leftOn();
void TEST_leftOff();

void TEST_leftBlinkOn();
void TEST_leftBlinkOff();

void TEST_brakeOn();
void TEST_brakeOff();