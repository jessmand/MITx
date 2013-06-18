var sys = require("sys"),  
my_http = require("http");  

//structure with question Text, options, solution index
var questions = [{"questionText": "Sam thinks that y=2 is going to _____ as x goes from 1-10.", "options": ["increases", "decreases", "goes up then down", "goes down then up"], "solutionIndex":0 }, {"questionText": "What is the capital of Georgia?", "options": ["Savannah", "Atlanta", "Charleston", "Washington DC"], "solutionIndex":1 }, {"questionText": "Who wrote 'Jabberwocky'?", "options": ["Dr. Seuss", "JK Rowling", "Shel Silverstien", "Lewis Carroll"], "solutionIndex":3 }];


//input:takes in a question index and a student's answer
//output: true if answer is correct
function checkAnswer(index,ans) {
    return (questions[currentQuestionIndex].options[questions[currentQuestionIndex].solutionIndex] == answers[currentQuestionIndex]) 
}

my_http.createServer(function(request,response){  
    sys.puts("I got kicked");  
    response.writeHeader(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});  
    response.write("Hello World");  
    response.end();  
}).listen(8080);  
sys.puts("Server Running on 8080"); 