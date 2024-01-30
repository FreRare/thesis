<h1>Aquarium automation system code for ESP8266 NodeMCU</h1>
<p>Author: Abel Takacs</p>
<span>Version: 2.0.0</span>

This code running on an ESP8266 nodeMCU is able to automate an aquarium with the specified sensors and actuators. Basically it can measure the temperature, ph, ligh, water level and is capable of switching 3 different systems connected to the outlets.

<h3>Versions and functions</h3>
<table>
    <tr>
        <th>Version</th>
        <th>Functions</th>
    </tr>
    <tr>
    <td>1.0.0</td>
    <td>Network configuration, connection. Syncing time with NTP server. Switching one of the 3 outlets on programmed time.</td>
    </tr>
    <td>
        <td>2.0.0</td>
        <td>Working prototype with all sensor sample gathering, config update from phone and logging. Need to add notifications, watchdog and factory reset mechanism!</td>
    </tr>
</table>

<strong>!!!! Warnings !!!!</strong>
<p>
    All actions are handled once every minute! This means, that all the actions that the system can perform are decided and acted in order in every minute not more frequent. This is in order to fixate that the call for feeding, and other actions that are required to be performed only once (the timing precision in the application is minute precise so this is why it's necessary, otherwise ex. the feeding would happen each time there's a call for it during the minute while it should only occur once).

    The main code uses delays!
    These delays are used to slow down the processing of actions and information displays (20ms delay between each action per minute and 300ms delay between action/config update and display info update).
    
     Although the sensor sample gathering mechanism has the most delay. This function uses 20ms delays between the samples (taking 10 smaples a time) and have 1s delay between each different sensor reads (exact delay time can be calculated by the formula: (num of sensors - 1) * 1000 + (sample count * num of sensors * d sample time)).
</p>
