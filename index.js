var http = require('http');

var portalRequestOpts = {
	hostname:'forum.reefangel.com'
};
var controllerRequestOpts = {};	 
var requestInProgress;
var pendingRequests = [];

function send(path, cb, isPortal){
	var response = '';
	
	//Requests need to be sent consecutively
	if(requestInProgress){			
			pendingRequests.push({path: path, callback: cb, isPortal : isPortal});
			return;
	}
	
	requestInProgress = true;
	
	//build the request
	var request = isPortal
		? portalRequestOpts
		: controllerRequestOpts;
		
	request.path = path;
	
	//make the call to the controller
	http.get(request, function(res){
		res.on('data', function(chunk){
			response += chunk;				
		});
		res.on('end', function(){							
			requestInProgress = false;
			requestFinished(cb, null, response);
		});		
	})
	.on('error',function(e){
		requestInProgress = false;		
		requestFinished(cb, e, null);
	});
}

function requestFinished(callback, err, resp){
	//make the callback
	if(callback && typeof callback === 'function'){
		callback(err, resp);
	}
	
	//check the queue
	if(pendingRequests.length){
		var req = pendingRequests.shift();
		send(req.path, req.callback, req.isPortal);
	}
}

module.exports = function(controllerOptions){

	controllerRequestOpts = controllerOptions;
	
	return{
		//Relay
		maskRelay: function(options, cb){		
			//options.box    : Number : The box to set (0-7)
			//options.port   : Number : The port to set (1-8)
			//options.status : Number : Relay status to set (0=off, 1=on, 2=Auto)
			
			if(typeof options.box !== 'number' || typeof options.port !== 'number' 
				|| typeof options.status !== 'number') cb(new Error('Relay options defined are not well formatted'), null);
			
			var mask = '/r' + options.box + options.port + options.status;
			send(mask, cb);
		},
		
		//JSON
		queryJson: function(cb){		
			send('/json', cb, false);
		},
		
		//XML
		queryXml: function(cb){		
			send('/r99', cb, false);
		},
		
		//Memory
		queryMemory: function(cb){		
			send('/mr', cb, false);
		},
		
		//Version
		queryVersion: function(cb){		
			send('/v', cb, false);
		},
		
		//Date
		queryDate: function(cb){		
			send('/d', cb, false);
		},
		
		//Portal Labels
		queryLabels: function(forumid, cb){
			send('/status/labels.aspx?id=' + forumid, cb, true);
		},
		
		//Button Press
		triggerButtonPress: function(cb){		
			send('/bp', cb, false);
		},
		
		//Feed Mode
		triggerFeeding: function(cb){		
			send('/mf', cb, false);
		},
		
		//Water Change
		triggerWaterChange: function(cb){		
			send('/mw', cb, false);
		},
		
		//Ato
		clearAto: function(cb){		
			send('/mt', cb, false);
		},
		
		//Overheat
		clearOverheat: function(cb){		
			send('/mo', cb, false);
		},
		
		//Leak
		clearLeakDetector: function(cb){		
			send('/ml', cb, false);
		},
		
		//Lights off
		triggerLightsOff: function(cb){		
			send('/l0', cb, false);
		},
		
		//Lights on
		triggerLightsOn: function(cb){		
			send('/l1', cb, false);
		},
		
		//Reboot
		triggerReboot: function(cb){
			send('/boot', cb, false);
		},
		
		//Override
		override: function(options, cb){
			//options.channel : Number : The channel to set
			//options.value   : Number : The new value to set on the channel
			if(typeof options.channel !== 'number' 
				|| typeof options.value !== 'number') cb(new Error('Override options not well formatted'), null);
			var override = '/po' + options.channel + ',' + options.value;
			send(override, cb, false);	 
		}
	}
};
