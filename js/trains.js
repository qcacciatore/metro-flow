var app = new Vue({
	el: '#trains',

	data: {
		lineSelected: null,
		directionSelected: null,
		lines: {},
		directions: {},
		stations: {},
		schedules: [],
	},

	mounted:function(){
		this.getLines();
     },

     methods: {
     	getLines: function() {
     		this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/lines/metros').then(function(response) {
	        // Success
	        this.lines = response.body.result.metros;
	        //console.log("good");
	    }, function(response) {
	        // Failure
	        //console.log("fail");
	    });
     	},

     	getDirections: function() {
     		this.stations = {};
     		this.directions = {};
     		this.schedules = [];
     		this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/destinations/metros/'+this.lineSelected).then(function(response) {
	        // Success
	        this.directions = response.body.result.destinations;
	        //console.log("good");
	    }, function(response) {
	        // Failure
	        //console.log("fail");
	    });
     	},

     	getStations: function() {
     		this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/stations/metros/'+this.lineSelected).then(function(response) {
	        // Success
	        this.stations = response.body.result.stations;
	        this.getSchedules();
	        //console.log("good");
	    }, function(response) {
	        // Failure
	        //console.log("fail");
	    });
     	},

     	getSchedules: function() {
	     	this.schedules = [];
	     	var count = Object.keys(this.stations).length;
	     	for(i=0; i < count; i++){
	     		console.log(this.stations[i].name);
	     		this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/schedules/metros/'+this.lineSelected+'/'+this.stations[i].name+'/'+this.directionSelected).then(function(response) {
		        // Success
		        this.schedules.push(response.body.result.schedules);
		        //console.log("good");
		    	}, function(response) {
		        	// Failure
		        	console.log("fail");
		    	});
		    }
		    console.log(this.schedules);
     	}, 

     	drawStraightLine: function() {
     		
		},
	}
})