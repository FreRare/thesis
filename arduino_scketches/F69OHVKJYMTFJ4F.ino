
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x3F,20,4); 
 
void setup()
{
  lcd.init();
  lcd.backlight();
  lcd.clear();
}

void loop() {
  lcd.setCursor(0, 0);
  lcd.print(" How Use Display :)");
  lcd.setCursor(2, 1);
  lcd.print(" Hd44780 i2c");
  lcd.setCursor(2, 2);
  lcd.print("16x2 and 20x4 ");
  lcd.setCursor(1, 3);
  lcd.print(" ForbiddenBit.com ");
}
