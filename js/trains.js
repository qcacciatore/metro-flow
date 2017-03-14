var app = new Vue({
	el: '#trains',

	data: {
		lineSelected: null,
		directionSelected: null,
		timeOut: null,
		directions: {},
		stations: {},
		schedules: [],
	},

	mounted:function(){
		
     },

     methods: {
     	getDirections: function() {
     		this.stopRefresh(); //stop the auto refresh and delete stations, directions & schedules
     		this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/destinations/metros/'+this.lineSelected).then(function(response) {
	        // Success
	        this.directions = response.body.result.destinations;
	    }, function(response) {
	        // Failure
	        //console.log("fail");
	    });
     	},

     	getStations: function() {
     		clearTimeout(this.timeOut); //avoid problems with auto-refresh and changement of direction
     		console.log("timeOut cleaned");
     		this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/stations/metros/'+this.lineSelected).then(function(response) {
	        // Success
	        this.stations = response.body.result.stations;
	        this.refreshSchedules();
	    }, function(response) {
	        // Failure
	        //console.log("fail");
	    });
     	},

     	getSchedules: function() {
	     	console.log("getSchedules...");
	     	this.schedules = [];
	     	var countDirections = Object.keys(this.directions).length;
	     	for(i=0; i < countDirections; i++){
	     		if(this.directionSelected == this.directions[i].name){
	     			directionWay = this.directions[i].way;
	     		}
	     	}
	     	var countStations = Object.keys(this.stations).length;
	     	for(i=0; i < countStations; i++){
	     		//console.log(this.stations[i].name);
	     		this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/schedules/metros/'+this.lineSelected+'/'+this.stations[i].slug+'/'+directionWay).then(function(response) {
		        // Success
		        this.schedules.push(response.body.result.schedules);
		        //console.log("good");
		    	}, function(response) {
		        	// Failure
		        	console.log("fail");
		    	});
		    }
     	},

     	refreshSchedules: function() {
     		console.log("refreshSchedules...");
     		x = 10;
     		this.getSchedules();
     		this.timeOut = setTimeout(this.refreshSchedules, x*1000);
     	},

     	stopRefresh: function() {
     		console.log("stopRefresh...");
     		clearTimeout(this.timeOut);
     		this.stations = {};
     		this.directions = {};
     		this.schedules = [];
     	}, 
	}
})