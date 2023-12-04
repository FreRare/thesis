#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS D4

OneWire oneWire(ONE_WIRE_BUS);

DallasTemperature sensor(&oneWire);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  sensor.begin();
}

void loop() {
  // put your main code here, to run repeatedly:
  sensor.requestTemperatures();
  Serial.print("Temperature: ");
  Serial.print(sensor.getTempCByIndex(0));
  Serial.print((char)176);//shows degrees character
  Serial.println("C");
  delay(5000);
}
