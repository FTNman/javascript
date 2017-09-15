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
		"New Orleans,LA": "29.9546,-90.0751",
		"Tampa,FL": "27.9475,-82.4584",
		"Tallahassee,FL": "30.4383,-84.2807",
		"Atlanta,GA": "33.7490,-84.3880"
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
	baseUrl: 'https://api.weather.gov/points/',
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
			.fail(function(h,s,e){alert('Failed in NWSFORECAST.getForecast for url: ' + url); NWSFORECAST.errorResponse = h; NWSFORECAST.nwsAPIFail(h,s,e, callback);});
		}
	},
	getFcst: function(url, callback, cache) { // Load data from api.weather.com.  Uses raw $.ajax
		if (!(url)) {
			alert('getFcst-No URL RECEIVED.  TRY AGAIN');
		}
		else {
			$.ajax({
				url: url,
				beforeSend: function(rqst,settings){
					console.log(['beforeSend',rqst,settings]);
					rqst.setRequestHeader( 'Accept', 'application/geo+json' )
				},
				//dataType: 'application/ld+json','application/geo+json
				success: function(d, s, h){NWSFORECAST[cache] = d; callback(d, s, h)},
				error: function(h,s,e){alert('Failed in NWSFORECAST.getFcst for url: ' + url); NWSFORECAST.errorResponse = h; NWSFORECAST.nwsAPIFail(h,s,e, callback);}
			});
		}
	},
	nwsAPIFail: function(header, status, error, callback) {
		console.log([header, status, error]);
		var aText = 'API Failed -- ' + header.status + ', ' + header.statusText + '\n'; // + header.responseJSON.detail;
		alert(aText);
		callback(header, status, error);
	},
	m2mi: function(m) {
		return m * 100 / 2.54 / 12 /5280;
	},
	deg2compass: function(brng) {
		var crose = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'], ndx;
		// (deprecated) var ndx = Math.floor(((11.25+brng) % 360) / 22.5);
		var ndx = Math.round(brng / 22.5) % 16;
		return crose[ndx];
	}
}
