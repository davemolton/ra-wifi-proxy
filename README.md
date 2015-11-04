#ReefAngel Wifi Proxy
The ReefAngel Wifi Proxy is a Node.js module for connecting to a ReefAngel wifi enabled controller and executing 
queries and commands against it. 
 
*Note:* The results of these commands are the raw response values outputted from the controller.

##Basic Usage
    
		var controllerSettings = {
			hostname: '192.168.1.150',
			port: 2000
		};
		
		var proxy = require('ra-wifi-proxy)(controllerSettings);
		
		//turn lights on
		proxy.triggerLightsOn();
		
		//query for current values in JSON format
		proxy.queryJson(function jsonCallback(err, response){
			if(!err) console.log(JSON.parse(response));
		});

##API
+ clearAto(cb)
+ clearLeakDetector(cb)
+ clearOverheat(cb)
+ maskRelay(options, cb)
+ override(cb)
+ queryDate(cb)
+ queryJson(cb)
+ queryLables(forumId, cb)
+ queryMemory(cb)
+ queryVersion(cb)
+ queryXml(cb)
+ triggerButtonPress(cb)
+ triggerFeeding(cb)
+ triggerLightsOff(cb)
+ triggerLightsOn(cb)
+ triggerReboot(cb)
+ triggerWaterChange(cb)
