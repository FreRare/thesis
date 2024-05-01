/*
 * Simple NTP client
 * https://mischianti.org/
 *
 * The MIT License (MIT)
 * written by Renzo Mischianti <www.mischianti.org>
 */
 
const char *ssid     = "<YOURSSID>";
const char *password = "<YOURPASSWD>";
 
#include <NTPClient.h>
// change next line to use with another board/shield
#include <ESP8266WiFi.h>
//#include <WiFi.h> // for WiFi shield
//#include <WiFi101.h> // for WiFi 101 shield or MKR1000
#include <WiFiUdp.h>
#include <TimeLib.h>
#include <time.h>
#include <Timezone.h>    // https://github.com/JChristensen/Timezone
 
/**
 * Input time in epoch format and return tm time format
 * by Renzo Mischianti <www.mischianti.org> 
 */
static tm getDateTimeByParams(long time){
    struct tm *newtime;
    const time_t tim = time;
    newtime = localtime(&tim);
    return *newtime;
}
/**
 * Input tm time format and return String with format pattern
 * by Renzo Mischianti <www.mischianti.org>
 */
static String getDateTimeStringByParams(tm *newtime, char* pattern = (char *)"%d/%m/%Y %H:%M:%S"){
    char buffer[30];
    strftime(buffer, 30, pattern, newtime);
    return buffer;
}
 
/**
 * Input time in epoch format format and return String with format pattern
 * by Renzo Mischianti <www.mischianti.org> 
 */
static String getEpochStringByParams(long time, char* pattern = (char *)"%d/%m/%Y %H:%M:%S"){
//    struct tm *newtime;
    tm newtime;
    newtime = getDateTimeByParams(time);
    return getDateTimeStringByParams(&newtime, pattern);
}
 
WiFiUDP ntpUDP;
 
// By default 'pool.ntp.org' is used with 60 seconds update interval and
// no offset
// NTPClient timeClient(ntpUDP);
 
// You can specify the time server pool and the offset, (in seconds)
// additionaly you can specify the update interval (in milliseconds).
int GTMOffset = 0; // SET TO UTC TIME
NTPClient timeClient(ntpUDP, "europe.pool.ntp.org", GTMOffset*60*60, 60*60*1000);
 
// Central European Time (Frankfurt, Paris)
TimeChangeRule CEST = {"CEST", Last, Sun, Mar, 2, 120};     // Central European Summer Time
TimeChangeRule CET = {"CET ", Last, Sun, Oct, 3, 60};       // Central European Standard Time
Timezone CE(CEST, CET);
 
void setup(){
  Serial.begin(115200);
  WiFi.begin(ssid, password);
 
  while ( WiFi.status() != WL_CONNECTED ) {
    delay ( 500 );
    Serial.print ( "." );
  }
 
  timeClient.begin();
  delay ( 1000 );
  if (timeClient.update()){
     Serial.print ( "Adjust local clock" );
     unsigned long epoch = timeClient.getEpochTime();
     setTime(epoch);
  }else{
     Serial.print ( "NTP Update not WORK!!" );
  }
 
}
 
void loop() {
  // I print the time from local clock but first I check DST 
  // to add hours if needed
  Serial.println(getEpochStringByParams(CE.toLocal(now())));
 
  delay(1000);
}