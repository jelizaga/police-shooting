// Gender variables.
var armedMale = 0;
var unarmedMale = 0;
var armedFemale = 0;
var unarmedFemale = 0;
var armedUnknown = 0;
var unarmedUnknown = 0;

// Initializing map and its layers.
var map;
var maleLayer = new L.LayerGroup([]);
var femaleLayer = new L.LayerGroup([]);
var unknownGLayer = new L.LayerGroup([]);
var allLayers = {
	"Gender: Male": maleLayer,
	"Gender: Female": femaleLayer,
	"Gender: Unknown": unknownGLayer
}

// drawMap draws the map, then calls getData.
var drawMap = function() {
	// The mapbox plugin makes this a bit messy. I included my accessToken and set the tileLayer to a 
	// custom map I made in their "Mapbox Studio" application.
	L.mapbox.accessToken = "pk.eyJ1IjoiamVsaXphZ2EiLCJhIjoiY2lmdTJvMzMxMWl2MHRnbHlzOXUzdjE1biJ9.IT8SuuUQ8B9OwJWOIu4qhQ";
	var tilesLayer = L.tileLayer("http://{s}.tiles.mapbox.com/v4/jelizaga.c693687d/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamVsaXphZ2EiLCJhIjoiY2lmdTJvMzMxMWl2MHRnbHlzOXUzdjE1biJ9.IT8SuuUQ8B9OwJWOIu4qhQ");
	map = L.map("container", {
		center: [40, -97],
		zoom: 4
	});
	
	//OSM map:
	/*
	var map = L.map("container").setView([30, -100], 4);
	var layer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
	layer.addTo(map);
	*/

	tilesLayer.addTo(map);
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

		// Determines victimName.
		var victimName = data[victim]["Victim Name"];
		if (victimName == "undefined") {
			victimName = "Unknown";
		}

		// Determines victimGender.
		var victimGender = data[victim]["Victim's Gender"];
		if (victimGender != "Male" && victimGender != "Female") {
			victimGender = "Unknown";
		}

		// Determines victimRace.
		var victimRace = data[victim]["Race"];
		if (victimRace == "undefined") {
			victimRace = "Unknown";
		}

		// Determines victimSurvive.
		var victimSurvive = data[victim]["Hit or Killed?"];
		if (victimSurvive == "undefined") {
			victimSurvive = "Unknown";
		}

		// Determines summary and source.
		var victimSummary = data[victim]["Summary"];
		if (victimSummary == "undefined") {
			victimSummary = "Summary unknown.";
		}
		var victimSource = data[victim]["Source Link"];

		// Updates statistics.
		if (victimGender == "Male") {
			if (data[victim]["Armed or Unarmed?"] == "Armed") {
				armedMale++;
			} else {
				unarmedMale++;
			}
		} else if (victimGender == "Female") {
			if (data[victim]["Armed or Unarmed?"] == "Armed") {
				armedFemale++;
			} else {
				unarmedFemale++;
			}
		} else {
			if (data[victim]["Armed or Unarmed?"] == "Armed") {
				armedUnknown++;
			} else {
				unarmedUnknown++;
			}
		}

		// Information to be included in infoPopup.
		var info = "<h3>" + victimName + "</h3>" + "<p>Survived?: " + victimSurvive + "</p><p>Gender: " + victimGender + "</p><p>Race: " + victimRace + "<p>Summary: " + victimSummary + "</p><p>Source: " + "<a href='" + victimSource + "'>" + victimSource + "</a></p>";

		// Popup at incident site.
		var infoPopup = new L.popup({
			maxHeight: 200
		}).setLatLng(lat, lng).setContent(info);

		// Inserts circle at incident site, adds circle to genderLayer and binds to popup.
		if (victimGender == "Male") {
			var circle = new L.circle([lat, lng], 10, {
				color: "#409EFF",
				fillColor: "#409EFF",
				fillOpacity: 0.25,
			}).addTo(maleLayer).bindPopup(infoPopup);
		} else if (victimGender == "Female") {
			var circle = new L.circle([lat, lng], 10, {
				color: "#FF85FE",
				fillColor: "#FF85FE",
				fillOpacity: 0.25,
			}).addTo(femaleLayer).bindPopup(infoPopup);
		} else {
			var circle = new L.circle([lat, lng], 10, {
				color: "#F3F3F3",
				fillColor: "#F3F3F3",
				fillOpacity: 0.25,
			}).addTo(unknownGLayer).bindPopup(infoPopup);
		}
	}

	// Displaying layers.
	maleLayer.addTo(map);
	femaleLayer.addTo(map);
	unknownGLayer.addTo(map);
	L.control.layers(null, allLayers).addTo(map);

	// Updating statistics of the table.
	$("#armedMaleTotal").text(armedMale);
	$("#unarmedMaleTotal").text(unarmedMale);
	$("#armedFemaleTotal").text(armedFemale);
	$("#unarmedFemaleTotal").text(unarmedFemale);
	$("#armedUnknownTotal").text(armedUnknown);
	$("#unarmedUnknownTotal").text(unarmedUnknown);

}