/*
 * NWS.js
 * A library subborting the new (as of ~2017) api.weather.gov
 */
function NWS(point) {
	this.point = point;
	this.baseUrl = 'https://api.weather.gov/points/' + this.points;
	this.metaData = null;
	this.observationStas = null;
}
NWS.prototype.CurrentObservation = function(point) {
	if (arguments.length == 0) point = this.point;
	if (!this.observationStas.observationStations) {
		$.getJSON(this.metaData.properties.observationStations)
		.done(function(data, status, xhdr) { this.observationStas = data; })
		.fail(function(h,s,e){this.apiFail(h,s,e,this.metaData.properties.observationStations)});
	};
	var currObsUrl = this.observationStas.observationStations[0] + '/observations/current';
	$.getJSON(currObsUrl).done(this.processObs).done(function(h,s,e){apiFail(h,s,e,currObsUrl);});
}
NWS.prototype.apiFail(hdr, status, error, url) {
	alert('apiFail for URL: ' + url + '\nStatus: ' + status + ' Error: ' + error);
}
NWS.prototype.processObs(data, status, xhdr) {
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