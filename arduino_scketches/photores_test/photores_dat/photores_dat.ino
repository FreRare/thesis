#define PHOTORES_PIN A0

int val = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  val = analogRead(PHOTORES_PIN);
  const int value = val;

if(value <= 176){
  Serial.println("Sötét");
}else if(176 < value && value <= 282){
  Serial.println("Árnyékos");
}else if(282 < value && value <= 388){
  Serial.println("Mérsékelt");
}else if(388 < value && value <= 494){
  Serial.println("Világos");
}else if(494 < value){
  Serial.println("Fényes");
}

  delay(1000);
}
