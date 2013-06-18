var sys = require("sys"),  
my_http = require("http");
var score;

//structure with question Text, options, solution index
var questions = [{"questionText": "Sam thinks that y=2 is going to _____ as x goes from 1-10.", "options": ["increases", "decreases", "goes up then down", "goes down then up"], "solutionIndex":0 }, {"questionText": "What is the capital of Georgia?", "options": ["Savannah", "Atlanta", "Charleston", "Washington DC"], "solutionIndex":1 }, {"questionText": "Who wrote 'Jabberwocky'?", "options": ["Dr. Seuss", "JK Rowling", "Shel Silverstien", "Lewis Carroll"], "solutionIndex":3 }];


//input:takes in a question index and a student's answer
//output: true if answer is correct
function checkAnswer(index,ans) {
    return (getQuestionAnswer(index) == ans) 
}

function getQuizLength() {
    return questions.length;
}

function getCurrentQuestion(index) {
    return questions[index];
}

function getQuestionText(index) {
    return questions[index].questionText;
}

function getQuestionOptions(index) {
    return questions[index].options;
}

function getQuestionAnswer(index) {
    return questions[index].options[questions[index].solutionIndex];
}

function incrementScore(score) {
    return (parseInt(score)+1);
}

function getScore() {
    return score;
}

function updateScore(newScore) {
    score=newScore;
}

my_http.createServer(function(request,response){
    var url = require('url');
    response.writeHeader(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"}); 

    var newData = url.parse(request.url,true);
    var func = newData.query.func;
    if (func == "checkAnswer") {
        var checked = checkAnswer(newData.query.index,newData.query.answer);
        response.write(String(checked));  
    } else if (func == "getQuizLength") {
        response.write(String(getQuizLength()));
    } else if (func == "getQuestionText") {
        response.write(getQuestionText(newData.query.index));
    } else if (func == "getQuestionOptions") {
        response.write(JSON.stringify(getQuestionOptions(newData.query.index)));
    } else if (func == "getQuestionAnswer") {
        response.write(String(getQuestionAnswer(newData.query.index)));
    } else if (func == "incrementScore") {
        response.write(String(incrementScore(newData.query.score)));
    } else if (func == "getScore") {
        response.write(String(getScore()));
    } else if (func == "updateScore") {
        updateScore(newScore);
    }
    
    
    response.end();  
}).listen(8080);  
sys.puts("Server Running on 8080"); 