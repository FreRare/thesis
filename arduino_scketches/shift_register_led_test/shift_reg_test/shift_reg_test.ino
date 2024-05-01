#define LATCH 2
#define CLK 3
#define DATA 4

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  while(!Serial);

  pinMode(LATCH, OUTPUT);
  pinMode(CLK, OUTPUT);
  pinMode(DATA, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(LATCH, LOW);
  shiftOut(DATA, CLK, MSBFIRST, B00000001);
  digitalWrite(LATCH, HIGH);
  Serial.println("LED off");
  delay(2000);
  digitalWrite(LATCH, LOW);
  shiftOut(DATA, CLK, MSBFIRST, B00000000);
  digitalWrite(LATCH, HIGH);
  Serial.println("LED on");
  delay(2000);
}
