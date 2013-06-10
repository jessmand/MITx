//calculate: evaluate the the value of an arithmetical expression
    function calculate() {
        var input = $('#text1:first');
        var val = input.val();
        var output = $('#text1_out:first');
        output.text(val);
    }