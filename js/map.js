// Setting global integer variables for containing shooting statistics.
var armedMale = 0;
var unarmedMale = 0;
var armedFemale = 0;
var unarmedFemale = 0;
var armedUnknown = 0;
var unarmedUnknown = 0;



// drawMap draws the map, then calls getData.
var drawMap = function() {
	// The mapbox plugin makes this a bit messy. I included my accessToken and set the tileLayer to a 
	// custom map I made in their "Mapbox Studio" application.
	L.mapbox.accessToken = "pk.eyJ1IjoiamVsaXphZ2EiLCJhIjoiY2lmdTJvMzMxMWl2MHRnbHlzOXUzdjE1biJ9.IT8SuuUQ8B9OwJWOIu4qhQ";
	var layer = L.tileLayer("http://{s}.tiles.mapbox.com/v4/jelizaga.c693687d/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamVsaXphZ2EiLCJhIjoiY2lmdTJvMzMxMWl2MHRnbHlzOXUzdjE1biJ9.IT8SuuUQ8B9OwJWOIu4qhQ");
	var map = L.map("container", {
		center: [40, -90],
		zoom: 4
	});
	
	//OSM map:
	/*
	var map = L.map("container").setView([30, -100], 4);
	var layer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
	layer.addTo(map);
	*/

	layer.addTo(map);
	getData();
}

// getData gets the data with which to populate the map, using an AJAX request, then sends it
// to customBuild upon success.
var getData = function() {
	var data;
	$.ajax({
		url: "data/response.json",
		type: "get",
		success: function(dat) {
			data = dat;
			customBuild(data);
		},
		dataType: "json"
	});
}

// Loops through all the victims and updates the map according to their respective data and
// location.
var customBuild = function(data) {
	for (var victim = 0; victim < data.length; victim++) {

		// Determines the location of the shooting.
		var lat = data[victim]["lat"];
		var lng = data[victim]["lng"];

		// Determines victimGender.
		var victimGender = data[victim]["Victim's Gender"];
		if (victimGender != "Male" && victimGender != "Female") {
			victimGender = "Unknown";
		}

		// Updates statistics.
		if (victimGender === "Male") {
			if (data[victim]["Armed or Unarmed?"] === "Armed") {
				armedMale++;
			} else {
				unarmedMale++;
			}
		} else if (victimGender === "Female") {
			if (data[victim]["Armed or Unarmed?"] === "Armed") {
				armedFemale++;
			} else {
				unarmedFemale++;
			}
		} else {
			if (data[victim]["Armed or Unarmed?"] === "Armed") {
				armedUnknown++;
			} else {
				unarmedUnknown++;
			}
		}

		// Inserts circle at incident site.
		var circle = L.circle(lat, lng, 30100, {
			color: (victimGender == "Male") ? "#409EFF" : "#FF85FE",
			opacity: 0.25,
			weight: 0
		});

	}

	// Updating statistics of the table.
	$("#armedMaleTotal").text(armedMale);
	$("#unarmedMaleTotal").text(unarmedMale);
	$("#armedFemaleTotal").text(armedFemale);
	$("#unarmedFemaleTotal").text(unarmedFemale);
	$("#armedUnknownTotal").text(armedUnknown);
	$("#unarmedUnknownTotal").text(unarmedUnknown);

}


