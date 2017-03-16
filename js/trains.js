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
	        console.log("fail getDirections");
	    });
     	},

     	getStations: function() {
     		clearTimeout(this.timeOut); //avoid problems with auto-refresh and changement of direction
     		console.log("timeOut cleaned");
     		this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/stations/metros/'+this.lineSelected).then(function(response) {
	        // Success
	        this.stations = response.body.result.stations;
	        this.drawLine(); //draw the img of the selected metro line
	        this.refreshSchedules();
	    }, function(response) {
	        // Failure
	        console.log("fail getStations()");
	    });
     	},

     	drawLine: function() {
     		//console.log("drawLine...");
     		var canvas = document.getElementById('img_line_select');
     		var context = canvas.getContext('2d');
     		var imageObj = new Image();

     		imageObj.src = 'css/img/metro-cut-ligne-'+this.lineSelected+'.jpg';

     		//canvas.width  = window.innerWidth; //fit to the screen size
     		canvas.width = 2925; //biggest line is 8 --> size of the img 2910 --> put more for border
  			canvas.height = 350;
     		imageObj.onload = function(){
     			context.drawImage(imageObj, 10, 10); // 10, 10 is for a small border between image and window
     		}

     	},

     	drawLineResize: function() {
     		//console.log("drawLineResize...");
     		var canvas = document.getElementById('img_line_select');
			var context = canvas.getContext('2d');
			var imageObj = new Image();

			imageObj.src = 'css/img/metro-cut-ligne-'+this.lineSelected+'.jpg';
			canvas.width  = window.innerWidth; //fit to the screen size
  			canvas.height = 350;

			var fitImageOn = function(canvas, imageObj) { //function explained here : https://sdqali.in/blog/2013/10/03/fitting-an-image-in-to-a-canvas-object/
				var imageAspectRatio = imageObj.width / imageObj.height;
				var canvasAspectRatio = canvas.width / canvas.height;
				var renderableHeight, renderableWidth, xStart, yStart;

				// If image's aspect ratio is less than canvas's we fit on height
				// and place the image centrally along width
				if(imageAspectRatio < canvasAspectRatio) {
					renderableHeight = canvas.height;
					renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
					xStart = (canvas.width - renderableWidth) / 2;
					yStart = 0;
				}

				// If image's aspect ratio is greater than canvas's we fit on width
				// and place the image centrally along height
				else if(imageAspectRatio > canvasAspectRatio) {
					renderableWidth = canvas.width
					renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
					xStart = 0;
					yStart = (canvas.height - renderableHeight) / 2;
				}

				// Happy path - keep aspect ratio
				else {
					renderableHeight = canvas.height;
					renderableWidth = canvas.width;
					xStart = 0;
					yStart = 0;
				}
				context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
			};

			imageObj.onload = function() {
				fitImageOn(canvas, imageObj)
			};
     	},

     	drawMetros: function() {
     		//console.log("drawLine...");
     		var canvas = document.getElementById('img_line_select');
     		var context = canvas.getContext('2d');
     		var imageObj = new Image();

     		imageObj.src = 'css/img/metro-cut-ligne-'+this.lineSelected+'.jpg';

     		canvas.width  = window.innerWidth; //fit to the screen size
  			canvas.height = 350;
     		imageObj.onload = function(){
     			context.drawImage(imageObj, 10, 10); // 10, 10 is for a small border between image and window
     		}

     	},

     	getSchedules: function() {
	     	//console.log("getSchedules...");
	     	this.schedules = [];
	     	var countDirections = Object.keys(this.directions).length;
	     	for(i=0; i < countDirections; i++){
	     		if(this.directionSelected == this.directions[i].name){
	     			directionWay = this.directions[i].way;
	     		}
	     	}
	     	var countStations = Object.keys(this.stations).length;
	     	for(i=0; i < countStations; i++){
	     		this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/schedules/metros/'+this.lineSelected+'/'+this.stations[i].slug+'/'+directionWay).then(function(response) {
		        // Success
		        this.schedules.push(response.body.result.schedules);
		    	}, function(response) {
		        	// Failure
		        	console.log("fail getSchedules()");
		    	});
		    }
     	},

     	refreshSchedules: function() {
     		//console.log("refreshSchedules...");
     		x = 30; //seconds
     		this.getSchedules();
     		this.timeOut = setTimeout(this.refreshSchedules, x*1000);
     	},

     	stopRefresh: function() {
     		//console.log("stopRefresh...");
     		clearTimeout(this.timeOut);
     		this.stations = {};
     		this.directions = {};
     		this.schedules = [];
     	}, 
	}
})