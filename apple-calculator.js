$(document).ready(function() {
    
    $('.button').bind('click',function() {
        var func = $(this).html();
        switch (func) {
            case "C":
                $('.expression').val("");
                break;
            case "=":
                var expression = $('.expression');
                expression.val(String(calculator.evaluate(calculator.parse(expression.val().replace("\xD7","*").replace("\xF7","/"), {}))));
                break;
            case "graph":
                graphcalc.graph($('.graphCanvas'), $('.equation').val(), $('.minValue').val(), $('.maxValue').val(), $('.calculator'));
                break;
            default:
                var expression = $('.expression');
                var input = expression.val();
                expression.val(input.concat(func));
        }
    });
});