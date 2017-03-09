var app = new Vue({
	el: '#trains',

	data: {
		lineSelected: null,
		lines:{},
		stations:{},
	},

	mounted:function(){
		this.getLines();
         //this.drawStraightLine();
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

     	getStations: function() {
     		this.$http.get('https://api-ratp.pierre-grimaud.fr/v3/stations/metros/'+this.lineSelected).then(function(response) {
	        // Success
	        this.stations = response.body.result.stations;
	        this.drawStraightLine();
	        //console.log("good");
	    }, function(response) {
	        // Failure
	        //console.log("fail");
	    });
     	},

     	drawStraightLine: function() {
     		var canvas = document.getElementById('canvas');
     		if (canvas.getContext){
     			var ctx = canvas.getContext('2d');

		    	//dessine les deux lignes
		    	ctx.beginPath();
		    	ctx.moveTo(100,25);
			    ctx.lineTo(1000,25);
			    ctx.moveTo(1000,35);
			    ctx.lineTo(100,35);
			    ctx.stroke();
			    
			    //dessine les arcs sur les cotés
			    ctx.beginPath();
			    ctx.arc(1000, 30, 5, (Math.PI/180)*-90, (Math.PI/180)*90, false); //(x, y, rayon, angleInitial(rad), angleFinal(rad), antihoraire)
			    ctx.arc(100, 30, 5, (Math.PI/180)*90, (Math.PI/180)*-90, false);
			    ctx.fill();
			}	
		},
	}
})