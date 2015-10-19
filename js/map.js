// Initializing map and its layers.
var map;
var infoLayer = new L.LayerGroup([]);
var maleLayer = new L.LayerGroup([]);
var femaleLayer = new L.LayerGroup([]);
var unknownGLayer = new L.LayerGroup([]);
var whiteLayer = new L.LayerGroup([]);
var blackLayer = new L.LayerGroup([]);
var asianLayer = new L.LayerGroup([]);
var hisplatLayer = new L.LayerGroup([]);
var natamerLayer = new L.LayerGroup([]);
var pacificLayer = new L.LayerGroup([]);
var unknownRLayer = new L.LayerGroup([]);
var allLayers = {
	"Gender: Male": maleLayer,
	"Gender: Female": femaleLayer,
	"Gender: Unknown": unknownGLayer,
	"Race: White": whiteLayer,
	"Race: Black": blackLayer,
	"Race: Asian": asianLayer,
	"Race: Hispanic/Latino": hisplatLayer,
	"Race: Native American": natamerLayer,
	"Race: Hawaiian/Other": pacificLayer,
	"Race: Unknown": unknownRLayer
}

// drawMap draws the map, then calls getData.
var drawMap = function() {
	// The mapbox plugin makes this a bit messy. I included my accessToken and set the tilesLayer to 
	// a custom map I made in their "Mapbox Studio" application.
	// I wanted to make two different maps for race and gender, but mapbox wants $100/mo for more
	// than one custom map, and won't allow more than one map to be published on a single page.
	L.mapbox.accessToken = "pk.eyJ1IjoiamVsaXphZ2EiLCJhIjoiY2lmdTJvMzMxMWl2MHRnbHlzOXUzdjE1biJ9.IT8SuuUQ8B9OwJWOIu4qhQ";
	var tilesLayer = L.tileLayer("http://{s}.tiles.mapbox.com/v4/jelizaga.c693687d/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamVsaXphZ2EiLCJhIjoiY2lmdTJvMzMxMWl2MHRnbHlzOXUzdjE1biJ9.IT8SuuUQ8B9OwJWOIu4qhQ");
	map = L.map("map", {
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

	// Gender-armedness variables.
	var armedMale = 0;
	var unarmedMale = 0;
	var unknownAMale = 0;
	var armedFemale = 0;
	var unarmedFemale = 0;
	var unknownAFemale = 0;
	var armedUnknown = 0;
	var unarmedUnknown = 0;
	var unknownAUnknown = 0;
	// Race tally.
	var white = 0;
	var black = 0;
	var hisplat = 0;
	var asian = 0;
	var natamer = 0;
	var pacific = 0;
	var unknownR = 0;
	// Total.
	var total = 0;
	var totalDead = 0;


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
		var victimHisplat = data[victim]["Hispanic or Latino Origin"];

		// Determines victimSurvive.
		var victimSurvive = data[victim]["Hit or Killed?"];
		if (victimSurvive != "Hit" && victimSurvive != "Killed") {
			victimSurvive = "Unknown";
		}

		// Determines summary and source.
		var victimSummary = data[victim]["Summary"];
		if (victimSummary === "undefined") {
			victimSummary = "Summary unknown.";
		}
		var victimSource = data[victim]["Source Link"];

		// Determined victimArmed.
		var victimArmed = data[victim]["Armed or Unarmed?"];

		// Updates total.
		total++;

		// Updates gender statistics.
		if (victimSurvive == "Killed") {
			totalDead++;
		}

		if (victimGender == "Male") {
			if (victimArmed == "Armed") {
				armedMale++;

			} else if (victimArmed == "Unarmed") {
				unarmedMale++;
			} else {
				unknownAMale++;
			}
		} else if (victimGender == "Female") {
			if (victimArmed == "Armed") {
				armedFemale++;
			} else if (victimArmed == "Unarmed") {
				unarmedFemale++;
			} else {
				unknownAFemale++;
			}
		} else {
			if (victimArmed == "Armed") {
				armedUnknown++;
			} else if (victimArmed == "Unarmed") {
				unarmedUnknown++;
			} else {
				unknownAUnknown++;
			}
		}

		// Updates ethnic statistics.
		if (victimRace == "White") {
			if (victimHisplat == "Hispanic or Latino origin") {
				victimRace = "Hispanic or Latino";
				hisplat++;
			} else if (victimHisplat == "Not of Hispanic or Latino origin") {
				white++;
			} else {
				victimRace == "Unknown";
			}
		} else if (victimRace == "Black or African American") {
			black++;
		} else if (victimRace == "Asian") {
			asian++;
		} else if (victimRace == "Native Hawaiian or Other") {
			pacific++;
		} else if (victimRace == "American Indian or Alaskan") {
			natamer++;
		} else {
			unknownR++;
		}

		// Information to be included in infoPopup.
		var info = "<h3>" + victimName + "</h3>" + "<p>Survived?: " + victimSurvive + "</p><p>Gender: " + victimGender + "</p><p>Race: " + victimRace + "<p>Summary: " + victimSummary + "</p><p>Source: " + "<a href='" + victimSource + "'>" + victimSource + "</a></p>";

		// Popup at incident site.
		var infoPopup = new L.popup({
			maxHeight: 200
		}).setLatLng(lat, lng).setContent(info);

		// Inserts circles at incident site colored to match the victim's information. These aren't
		// bound to the infoPopup; they're just for visualization.

		// genderCircle.
		if (victimGender == "Male") {
			var genderCircle = new L.circle([lat, lng], 10, {
				color: "#409EFF",
				fillColor: "#409EFF",
				fillOpacity: 0.25,
			}).addTo(maleLayer).bindPopup(infoPopup);
		} else if (victimGender == "Female") {
			var genderCircle = new L.circle([lat, lng], 10, {
				color: "#FF85FE",
				fillColor: "#FF85FE",
				fillOpacity: 0.25,
			}).addTo(femaleLayer).bindPopup(infoPopup);
		} else {
			var genderCircle = new L.circle([lat, lng], 10, {
				color: "#F3F3F3",
				fillColor: "#F3F3F3",
				fillOpacity: 0.10,
			}).addTo(unknownGLayer).bindPopup(infoPopup);
		}
		
		// raceCircle.
		if (victimRace == "White") {
			var raceCircle = new L.circle([lat, lng], 10, {
				color: "#9BFBFF",
				fillColor: "#9BFBFF",
				fillOpacity: 0.25,
			}).addTo(whiteLayer).bindPopup(infoPopup);
		} else if (victimRace == "Hispanic or Latino") {
			var raceCircle = new L.circle([lat, lng], 10, {
				color: "#A7FF9B",
				fillColor: "#A7FF9B",
				fillOpacity: 0.25,
			}).addTo(hisplatLayer).bindPopup(infoPopup);
		} else if (victimRace == "Black or African American") {
			var raceCircle = new L.circle([lat, lng], 10, {
				color: "#FFF99B",
				fillColor: "#FFF99B",
				fillOpacity: 0.25,
			}).addTo(blackLayer).bindPopup(infoPopup);
		} else if (victimRace == "Asian") {
			var raceCircle = new L.circle([lat, lng], 10, {
				color: "#FF8D8D",
				fillColor: "#FF8D8D",
				fillOpacity: 0.25,
			}).addTo(asianLayer).bindPopup(infoPopup);
		} else if (victimRace == "American Indian or Alaskan") {
			var raceCircle = new L.circle([lat, lng], 10, {
				color: "#FB9BFF",
				fillColor: "#FB9BFF",
				fillOpacity: 0.25,
			}).addTo(natamerLayer).bindPopup(infoPopup);
		} else if (victimRace == "Native Hawaiian or Other") {
			var raceCircle = new L.circle([lat, lng], 10, {
				color: "#FFC19B",
				fillColor: "#FFC19B",
				fillOpacity: 0.25,
			}).addTo(pacificLayer).bindPopup(infoPopup);
		} else {
			var raceCircle = new L.circle([lat, lng], 10, {
				color: "#F3F3F3",
				fillColor: "#F3F3F3",
				fillOpacity: 0.10,
			}).addTo(unknownRLayer).bindPopup(infoPopup);
		}
	}

	// Displaying layers.
	maleLayer.addTo(map);
	femaleLayer.addTo(map);
	unknownGLayer.addTo(map);
	whiteLayer.addTo(map);
	blackLayer.addTo(map);
	hisplatLayer.addTo(map);
	asianLayer.addTo(map);
	natamerLayer.addTo(map);
	pacificLayer.addTo(map);
	unknownRLayer.addTo(map);
	infoLayer.addTo(map);
	L.control.layers(null, allLayers).addTo(map);

	// Updating totals.
	$("#totalVictims").text(total);
	$("#totalKilled").text(totalDead);


	// Updating statistics of the tables.
	$("#armedMaleTotal").text(armedMale);
	$("#unarmedMaleTotal").text(unarmedMale);
	$("#unknownMaleTotal").text(unknownAMale);
	$("#armedFemaleTotal").text(armedFemale);
	$("#unarmedFemaleTotal").text(unarmedFemale);
	$("#unknownFemaleTotal").text(unknownAFemale);
	$("#armedUnknownTotal").text(armedUnknown);
	$("#unarmedUnknownTotal").text(unarmedUnknown);
	$("#unknownUnknownTotal").text(unknownAUnknown);
	$("#whiteShot").text(white);
	$("#blackShot").text(black);
	$("#hisplatShot").text(hisplat);
	$("#asianShot").text(asian);
	$("#natamerShot").text(natamer);
	$("#pacificShot").text(pacific);
	$("#unknownShot").text(unknownR);
}