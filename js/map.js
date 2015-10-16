// drawMap draws the map, then calls getData.
var drawMap = function() {
	alert("drawMap executed.");
	/* The mapbox plugin makes this a bit messy. I included my accessToken and set the tileLayer to a 
	custom map I made in their "Mapbox Studio" application. */
	L.mapbox.accessToken = "pk.eyJ1IjoiamVsaXphZ2EiLCJhIjoiY2lmdTJvMzMxMWl2MHRnbHlzOXUzdjE1biJ9.IT8SuuUQ8B9OwJWOIu4qhQ";
	var layer = L.tileLayer("http://{s}.tiles.mapbox.com/v4/jelizaga.c693687d/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamVsaXphZ2EiLCJhIjoiY2lmdTJvMzMxMWl2MHRnbHlzOXUzdjE1biJ9.IT8SuuUQ8B9OwJWOIu4qhQ");
	var map = L.map("container", {
		center: [40, -90],
		zoom: 4
	});
	/* 
	OSM map:
	var map = L.map("container").setView([30, -100], 4);
	var layer = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png");
	layer.addTo(map);
	*/
	layer.addTo(map);
	getData();
}

// getData gets the data with which to populate the map, using an AJAX request.
var getData = function() {
	alert("getData executed.");
	$.ajax({
		url: "data/response.json",
		/* If successful, send data to customBuild. */
		success: function(data) {
			customBuild(data);
		},
		dataType: "json"
	});
	customBuild();
}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
	alert("customBuild executed.");
	// Be sure to add each layer to the map

	// Once layers are on the map, add a leaflet controller that shows/hides layers
  
}


