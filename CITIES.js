/*
 * CITIES.js
 * defines a CITIES object that stores the names and lat,lon values for cities
 * to be used in weather .html files.
 * Also contains methods for constructing selection boxes.
 * Usage: CITIES[city] ==> the lat,lon of the city; undefined if not known.
*/
var CITIES = {
	database: {
		"Arden,DE":"39.809,-75.487",
		"New Castle Airport" : "39.6773,-75.6062",
		"Wildwood,NJ":"39,-74.82",
		"Elmer,NJ" : "39.5951,-75.170",
		"Philadelphia,PA" : "39.9526,-75.1652",
		"Philadelphia International Airport" : "39.8783,-75.2402",
		"Chicago,IL" : "41.85,-87.65",
		"Starved Rock State Park" : "41.3131,-88.9676",
		"Bolingbrook,IL" : "41.6986,-88.0684",
		"Chicago O'Hare International Airport" : "41.9798,-87.882",
		"Seattle,WA" : "47.6062,-122.3321",
		"Houston,TX": "29.7633,-95.3633",
		"New Orleans,LA": "29.9546,-90.0751"
	},
	getLatLon: function(city) {return this.database[city]},
	initSelList: function(target) {
		var html = '';
		for (var prop in this.database) {
			html += '<option value="' + prop + '">' + prop + '</option>';
		}
		$(target).html(html);
		return;
	}
}
var NWSFORECAST = {
 	metaData: {}, //Metadata for this point goes here
	forecast: {}, //7-day forecast goes here
	hourly: {}, //Hourly Forecast goes here
	grid: {}, //GridForecast goes here
	observationStations: {}, //ObservationStations go here
	currentObs: {}, //current observation data here
	errorResponse: {}, //error objects go here (overloading can occur)
	getForecast: function(url, callback, cache) { // Load a forecast from url; store in NWSFORECAST[chche]
		if (!(url)) {
			alert('getForecast-No URL RECEIVED.  TRY AGAIN');
		}
		else {
			$.getJSON(url,
				function(d, s, h){NWSFORECAST[cache] = d; callback(d, s, h)}
				)
			.fail(function(h,s,e){alert('Failed in NWSFORECAST.getForecast for url: ' + url); NWSFORECAST.errorResponse = h; this.nwsAPIFail(h,s,e);});
		}
	},
	nwsAPIFail: function(header, status, error, callback) {
		console.log(header.responseText);
		var aText = 'API Failed -- ' + header.status + ', ' + header.statusText + '\n' + header.responseJSON.detail;
		alert(aText);
		callback(header, status, error);
},
	loadMeta: function(city) {
		if (!(cities[city])) {
			alert('[' + city + '] IS NOT A KNOWN CITY.  TRY AGAIN');
		}
		else {
			$.getJSON('https://api.weather.gov/points/' + cities[city],
				function(d, s, h){NWSFORECAST.metaData = d; initFcsts(d, s, h);}
				)
			.fail(function( jqxhr, textStatus, error ) {
					var err = textStatus + ", " + error + jqxhr.textResponse;
					alert( "loadMeta Request Failed: " + err );
			});
		}
	},
	loadForecast: function(url, callback) {
		if (!(url)) {
			alert('loadForecast-No URL RECEIVED.  TRY AGAIN');
		}
		else {
			$.getJSON(url,
				function(d, s, h){NWSFORECAST.forecast = d; callback(d, s, h)}
				)
			.fail(function(h,s,e){alert('Failed in NWSFORECAST.loadForecast'); NWSFORECAST.errorResponse = h; nwsAPIFail(h,s,e);});
		}
	},
	loadHourly: function(url, callback) {
		if (!(url)) {
			alert('loadHourly-No URL RECEIVED.  TRY AGAIN');
		}
		else {
			$.getJSON(url,
				function(d, s, h){NWSFORECAST.hourly = d; callback(d, s, h)}
				)
			.fail(function(h,s,e){alert('Failed in NWSFORECAST.loadHourly'); NWSFORECAST.errorResponse = h; nwsAPIFail(h,s,e,callback)});
		}
	},
	loadObservationStations: function(url, callback) {
		if (!(url)) {
			alert('loadObservationStations-No URL RECEIVED.  TRY AGAIN');
		}
		else {
			$.getJSON(url,
				function(d, s, h){NWSFORECAST.observationStations = d; callback(d, s, h)}
				)
			.fail(function(h,s,e){alert('Failed in NWSFORECAST.loadObservationStations'); NWSFORECAST.errorResponse = h; nwsAPIFail(h,s,e);});
		}
	},
	loadGrid: function(url, callback) {
		if (!(url)) {
			alert('loadGrid-No URL RECEIVED.  TRY AGAIN');
		}
		else {
			$.getJSON(url,
				function(d, s, h){NWSFORECAST.grid = d; callback(d, s, h)}
				)
			.fail(function(h,s,e){alert('Failed in NWSFORECAST.loadGrid'); NWSFORECAST.errorResponse = h; nwsAPIFail(h,s,e)});
		}
	}
}
