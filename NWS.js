/*
 * NWS.js
 * A library supporting the new (as of ~2017) api.weather.gov
 */
function NWS(point) {
	this.point = point;
	this.baseUrl = 'https://api.weather.gov/points/' + this.points;
	this.metaData = null;
	this.forecast = null;
	this.hourlyfcst = null;
	this.grid = null;
	this.observationStas = null;
	this.currobs = null;
}
NWS.prototype.getMetaData = function() {
	if (!this.point) {
		alert('No latitude,longitude specified.  Set the "point" property before calling getMetaData().');
	}
	else {
		$.getJSON(this.basrUrl)
		.done(function(d,s,e){this.metaData = d;console.log('stored metaData';})
		.fail(function(h,s,e){apiFail(h,s,e,this.baseUrl);});
	}
}
NWS.prototype.getObservationStas = function() {
	if (!this.metaData) this.getMetaData();
	this.getNWSData(this.metaData.properties.observationStations, 'observationStas');
}
NWS.prototype.getNWSData = function(url, propName) {
	var errMsg = 'Both parameters required in call: getNWSData(url, propName).';
	if (!this.point) {
		alert('No latitude,longitude specified.  Set the "point" property before calling getNWSData(url, propName).');
	} else if (!url) {
		alert('No URL specified.  ' + errMsg);
	} else if (!propName) {
		alert('No property name specified.  ' + errMsg);
	}
	else {
		$.getJSON(url)
		.done(function(d,s,e){this[propName] = d;console.log('stored ' + propName;})
		.fail(function(h,s,e){apiFail(h,s,e,url);});
	}
}
NWS.prototype.getCurrObs = function() {
	var currObsUrl;
	if (!this.metaData) this.getMetaData();
	if (!this.observationStas) this.getObservationStas();
	currObsUrl = this.observationStas.properties.observationStations[0];
	getNWSData(currObsUrl, 'currobs');
}
NWS.prototype.apiFail(hdr, status, error, url) {
	alert('apiFail for URL: ' + url + '\nStatus: ' + status + ' Error: ' + error);
}
NWS.prototype.prcsCurrObs(data, status, xhdr) {
	var html = '';
	html += TAG.div({
		class: 'ccHead',
		text: [
			TAG.p({class: 'ccTemp', text: this.degF(data.properties.temperature.value,data.properties.temperature.unitCode)}),
			TAG.p({class: 'ccIcon', text: TAG.img({src: data.properties.icon})}),
			TAG.p({class: 'ccWx', text: data.properties.textDescription})
		]
	});
}
