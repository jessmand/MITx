//calculate: evaluate the the value of an arithmetical expression
function calculate(text) {
    var pattern = /\d+(\.\d+)?|\+|\-|\*|\/|\(|\)/g;
    var tokens = text.match(pattern);
    try {
    	var num_open = 0;
		var num_close = 0;
		if(tokens==null) {
			if(isNaN(parseFloat(text))) throw "Number Expected";
			else return text;
		}
		for(var i=0;i<tokens.length;i++) {
			if (tokens[i]=='(') num_open++;
			if (tokens[i]==')') num_close++;
		}
		if(num_open!=num_close) throw "Ill-formed expression.";
        var val = evaluate(tokens);
        //if(tokens.length>0) throw "Ill-formed expression.";
		if(isNaN(val)) throw "Number expected";
        return String(val)
    }
    catch(err) {
        return "Error: "+err;
    }
}

//looks for integer as next item and handles for open parentheses
function read_operand(tokens) {
    var first = tokens.shift();
        if(first=="(") {
            try {
                if(tokens.indexOf(")")==-1) throw "Missing close-parentheses."
            }
            catch(err) {
                return "Error: "+err;
            }
            var newInt = evaluate(tokens);
        } else if(first=="-") {
			var newInt = -1*parseFloat(tokens.shift());
		}
		else {
            var newInt = parseFloat(first);
        }
		return newInt
		
}

//identifies operands and performs operations
function evaluate(tokens) {
    try {
        if(tokens.length<1) throw "Missing operand.";
    }
    catch(err) {
        return "Error: "+err;
    }
    var value = read_operand(tokens);
	if(isNaN(value)) return value;
    while (tokens.length>0) {
        var operator = tokens.shift();
        if (operator==")") {
            return value;
        }
        try {
            if(operator!='+' && operator!='-' && operator!='*' && operator!='/') throw "Unrecognized operator.";
            if(tokens.length<1) throw "Missing operand.";
        }
        catch(err) {
            return "Error: "+err;
        }
        var temp = read_operand(tokens);
		try {
			if(operator=='+') {
				value = value+temp;
			} else if(operator=='-') {
				value = value-temp;
			} else if(operator=='*') {
				value = value*temp;
			} else if(operator=='/') {
				value = value/temp;
			}
			if(isNaN(value)) throw "Number expected";
		}
		catch(err) {
			return "Error: "+err;
		}
    }
    return value;
}

function setup_calc(div) {
    var input = $('<input></input>',{type: "text", size: 50});
    var output = $('<div></div>');
    var button = $('<button>Calculate</button>');
    button.bind('click', function(){
        output.text(String(calculate(input.val())));
    });
    
    $(div).append(input,button,output);
}

$(document).ready(function() {
    $('.calculator').each(function() {
        //this refers to the div with class calculator
        setup_calc(this);
    });
});