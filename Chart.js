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
	this.xMin = null;
	this.xRange = null;
	this.yMin = null;
	this.yRange = null;
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
/* 
 * Draws a line on the SVG canvas using the <path...> element.
 * aryOfPoints -- an array of [x,y] pairs.  This is an array of arrays.
 * settings -- an object of attribute:value pairs used to override some defaults.
 */
Chart.prototype.plotLine = function(aryOfPoints, settings) {
	var rzlt = '';
	// Process the settings
	for (var prop in settings) {
		if (prop.match(/xMin|xRange|yMin|yRange/)) {
			this[prop] = settings[prop];
		}
		else {
			alert('INVALID SETTING in plotLine: ' + prop + '\nThissetting ignored.');
		}
	}
	//Set x-domain settings not already set
	if (! this.xMin) this.xMin = aryOfPoints.reduce(function(m,a){return Math.min(m,a[0])},Number.MAX_VALUE);
	if (! this.xRange) {
		this.xRange = (aryOfPoints.reduce(function(m,a){return Math.max(m,a[0])},Number.MIN_VALUE)) - this.xMin;
	}
	//Set y-domain settings not already set
	if (! this.yMin) this.yMin = aryOfPoints.reduce(function(m,a){return Math.min(m,a[1])},Number.MAX_VALUE);
	if (! this.yRange) {
		this.yRange = (aryOfPoints.reduce(function(m,a){return Math.max(m,a[1])},Number.MIN_VALUE)) - this.yMin;
	}
	//Generate the data string for use in <plot... or <line...
	//rzlt += aryOfPoints.map(function(e,i,a){return ((i==0)?'M':'L') + this.xpos(e[0]) + ',' + this.ypos(e[1]) + ' '}).join('\n');
	rzlt += 'M' + this.xpos(aryOfPoints[0][0]) + ',' + this.ypos(aryOfPoints[0][1]) + ' ';
	for (var i=1;i<aryOfPoints.length;i++){
		var e = aryOfPoints[i];
		rzlt += 'L' + this.xpos(e[0]) + ',' + this.ypos(e[1]) + '\n';
	}
	return rzlt;
}
