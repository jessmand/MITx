var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
   
    function graph(canvas,expression,x1,x2,div) {
		var DOMcanvas = canvas[0];
		var ctx = DOMcanvas.getContext('2d');  
		ctx.clearRect(0,0,canvas.width(),canvas.height());
		ctx.beginPath();
		try {
			var min = calculator.evaluate(calculator.parse(x1), {});
		} catch(err) {
			$(div).find('.errorWindow').text('Please check your min: '+err);
			return;
		}
		try {
			var max = calculator.evaluate(calculator.parse(x2), {});
		} catch(err) {
			$(div).find('.errorWindow').text('Please check your max: '+err);
			return;
		}
		var parsedExpression = calculator.parse(expression);
		if (min>=max) {
			$(div).find('.errorWindow').text('Max should be greater than min');
			return;
		}
		var increment = (max-min)/250;
		var xScale = 500/(max-min)
		var xValues = [];
		var yValues = [];
		i=min;
		while (i<=max) {
			xValues.push(i);
			yValues.push(calculator.evaluate(parsedExpression,{x:i}));
			i+=increment;
		}
		var minY = Math.min.apply(this,yValues);
		var maxY = Math.max.apply(this,yValues);
		var range = maxY-minY
		if (range<1) {
			range+=1;
		}
		var yScale = 480/(range);
		ctx.moveTo(0,490-(yValues[0]-minY)*yScale);
		i=1;
		while (i<249) {
			ctx.lineTo(i*2,490-(yValues[i]-minY)*yScale);
			console.log(i*2,490-(yValues[i]-minY)*yScale);
			i++;
			
		}
		ctx.stroke();
		
		/*
		if (minY<=0) {
			ctx.beginPath()
			if (Math.abs(maxY)>Math.abs(minY)) {
		/*		
			
		
    }
   
    function setup(div) {
        //… your code to fill the div with the appropriate HTML components and
        // to call graph() with the appropriate arguments in response to a click
        // of the Plot button … 
		var graphCanvas = $('<canvas width="500" height="500" class="graphCanvas"></canvas>');
		var commandBox = $('<div></div>', {'id':'commandBox'});
		var equationLabel = $('<label>y =</label>', {'for':'equation','id':'equationLabel'});
		var equation = $('<input></input>', {type:'text',class:'equation'});
		var minLabel = $('<label>min:</label>', {for:'min',id:'minLabel'});
		var min = $('<input></input>', {type:'text',class:'min'});
		var maxLabel = $('<label>max:</label>', {for:'max',id:'maxLabel'});
		var max = $('<input></input>', {type:'text',class:'max'});
		var graphButton = $('<button>Graph</button>', {class:'graphButton'});
		var errorWindow = $('<div></div>', {class:'errorWindow'});
		$(commandBox).append(equationLabel,equation,minLabel,min,maxLabel,max,graphButton,errorWindow);
		$(div).append(graphCanvas,commandBox);
		
		graphButton.bind('click', function() {
			graph(graphCanvas, equation.val(), min.val(), max.val(), div)
		});
    }
    exports.setup = setup;
   
    return exports;
}());
// setup all the graphcalc divs in the document
$(document).ready(function() {
    $('.graphcalc').each(function() {
        graphcalc.setup(this);  
    });
});