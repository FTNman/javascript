/*
 SVG Object -- helper functions for constructing svg elements
*/
var SVG = {
	rect: function(options){
		var rzlt = '';
		if (!(options.width && options.height)) {
			alert('SVG.rect MUST have width & height specified!');
			return;
		}
		rzlt += '<rect ';
		for (var attr in options) {
			rzlt += attr + '="' + options[attr] + '" ';
		}
		rzlt += '/>';
		return rzlt;
	},
	text: function(options) {
		var rzlt = '';
		rzlt += '<text ';
		for (var attr in options) {
			if (attr != 'text') rzlt += attr + '="' + options[attr] + '" ';
		}
		rzlt += '>' + options.text + '</text>';
		return rzlt;
	},
	path: function(options) {
		var rzlt = '';
		rzlt += '<path ';
		for (var attr in options) {
			rzlt += attr + '="' + options[attr] + '" ';
		}
		rzlt += '/>';
		return rzlt;	
	},
	line: function(options){
		var rzlt = '';
		if (!(options.x1 && options.x2 && options.y1 && options.y2)) {
			alert('SVG.line MUST have x1, y1, x2, y2 specified!');
			return rzlt;
		}
		rzlt += '<line ';
		for (var attr in options) {
			rzlt += attr + '="' + options[attr] + '" ';
		}
		rzlt += '/>';
		return rzlt;
	},
}