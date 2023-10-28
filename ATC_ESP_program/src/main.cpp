#include <Arduino.h>
#include <UIHandler.h>
int counter = 0;

void setup()
{
    UIHandler* ui = new UIHandler();
    ui->writeLine("HELLOOO", 1);
    ui->writeLine("SAVE MEEE", 2);
    ui->writeLine("OR JUST KILL ME", 4);
}

void loop() { }