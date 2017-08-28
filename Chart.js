/*
  Chart library -- chartlib.js
*/
function Chart(width, height, leftPad, rightPad, topPad, bottomPad) {
	this.width = width;
	this.height = height;
	this.leftPad = leftPad;
	this.rightPad = rightPad;
	this.topPad = topPad;
	this.bottomPad = bottomPad;
	this.xAxOrig = leftPad;
	this.xAxLen = width - leftPad - rightPad;
	this.yAxOrig = height - bottomPad;
	this.yAxLen = height - bottomPad - topPad;
	this.xMin = 0;
	this.xRange = 0;
	this.yMin = 0;
	this.yRange = 0;
}
/* method: Chart::xpos()
 * returns x-coordinate of this datum
 */
Chart.prototype.xpos = function(x) {
	return this.xAxOrig + (this.xAxLen * ((x - this.xMin) / this.xRange));
};
/* method: Chart::ypos()
 * returns y-coordinate of this datum
 */
Chart.prototype.ypos = function(y) {
	return this.yAxOrig - (this.yAxLen * ((y - this.yMin) / this.yRange));
};
/* method: pathDataFromArray(element, index, array, connectFunction)
 * returns an array of strings to be joined together and used in an svg path element
 * to be used as an argument to the map() method of a NWS data array
 * for example: '<path d="'
 *  + aryTemp.map(function(e,i,a){return myChart.tempsPath(e,i,a, function(i){return (i==0)?'M':'L';});}).join(' ')
 *  + '"/>';
 * The connectFunction is used to determine whether each array element is connected
 * to it's predecessor.  Typical values are:
 * Connect all points: function(i){return (i==0)?'M':'L';} // only 'M'ove on the first point
 * Scatter plot: function(i){return 'M';} // always 'M'ove to the start of each datum
 */
Chart.prototype.pathDataFromArray = function(elt, ndx, ary, connect) {
	var y = this.ypos(elt.value);
	var times = elt.validTime.split('/');
	var x1 = this.xpos(new Date(times[0]).getTime());
	var x2 = this.xpos(new Date(times[0]).getTime() + moment.duration(times[1]).asMilliseconds())
	return connect(ndx) + x1 + ',' + y + ' L' + x2 + ',' + y;
}
Chart.prototype.plotHrlyData = function(elt, ndx, ary, connect) {
	var y = this.ypos(elt.temperature);
	var x = this.xpos(new Date(elt.startTime).getTime());
	return connect(ndx) + x + ',' + y;
}
