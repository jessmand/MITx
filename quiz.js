var quiz = (function() {
    
    
    
    var exports = [];
    
    //structure with question Text, options, solution index
    var questions = [{"questionText": "Sam thinks that y=2 is going to _____ as x goes from 1-10.", "options": ["increases", "decreases", "goes up then down", "goes down then up"], "solutionIndex":0 }, {"questionText": "What is the capital of Georgia?", "options": ["Savannah", "Atlanta", "Charleston", "Washington DC"], "solutionIndex":1 }, {"questionText": "Who wrote 'Jabberwocky'?", "options": ["Dr. Seuss", "JK Rowling", "Shel Silverstien", "Lewis Carroll"], "solutionIndex":3 }];
    
    var local = false;
    
    var score, currentQuestionIndex, answers;
    
    if (local) {
        score = parseInt(localStorage["score"]); //score of the student
        
        currentQuestionIndex = parseInt(localStorage["currentQuestionIndex"]); //index of the current question we are on
        
        answers = JSON.parse(localStorage["answers"]);
        
        if (isNaN(score)) {
            score = 0;
            currentQuestionIndex = 0;
            answers = [];
        }
    }
    
    //input:takes in a question index and a student's answer
    //output: true if answer is correct
    
    function checkAnswer() {
        return (questions[currentQuestionIndex].options[questions[currentQuestionIndex].solutionIndex] == answers[currentQuestionIndex]) 
    }
    
    //displays current quiz question to student
    function displayQuestion() {
        $(".quizQuestion").empty();
        if (currentQuestionIndex<questions.length) {
            var currentQuestionDict = questions[currentQuestionIndex];
            
            var newQuestion = $("<text>"+(currentQuestionIndex+1)+". "+currentQuestionDict.questionText+"</text>");
            var radios = "";
            for (var q in currentQuestionDict.options) {
                radios += "<br><input type='radio' name='choice"+currentQuestionIndex+"' value='"+currentQuestionDict.options[q]+"'>"+currentQuestionDict.options[q]+"</input>";
            }
            var answerOptions = $(radios+"<br>");
            var checkButton = $("<button class='checkButton"+currentQuestionIndex+"'>Check</button>");
            var ansDiv = $('<div class="answerDiv'+currentQuestionIndex+'"></div>');
            checkButton.bind("click",finalCheck);
            $(".quizQuestion").append(newQuestion,answerOptions,checkButton,ansDiv);
        } else {
            $(".quizQuestion").append("Your final score is "+score+"/"+questions.length+".");
            for (var i=0; i<questions.length;i++) {
                var yourAnswer = answers[i];
                var correctAnswer = questions[i].options[questions[i].solutionIndex];
                if (yourAnswer!=correctAnswer) {
                    $('.quizQuestion').append('<br><br><span class="incorrect">'+(i+1)+'. '+questions[i].questionText+'</span>');
                } else {
                    $('.quizQuestion').append('<br><br><span class="correct">'+(i+1)+'. '+questions[i].questionText+'</span>');
                }
                var breakdown1 = $('<br><text>&nbsp &nbsp Your Answer: '+yourAnswer+'</text>');
                var breakdown2 = $('<br><text>&nbsp&nbsp Correct Answer: '+correctAnswer+'</text>');
                $('.quizQuestion').append(breakdown1,breakdown2);
            }
        }
    }
    
    function nextQuestion() {
        currentQuestionIndex++;
        displayQuestion();
    }
    
    function finalCheck() {
        var ans = $('input[name="choice'+currentQuestionIndex+'"]:checked').val();
        answers.push(ans);
        $('.checkButton'+currentQuestionIndex).remove();
        if (checkAnswer(ans)) {
            incrementScore();
            $('.answerDiv'+currentQuestionIndex).append("Correct<br>");
        } else {
            $('.answerDiv'+currentQuestionIndex).append("Incorrect<br>");
        }
        if (currentQuestionIndex < questions.length-1) { 
            var nextButton = $('<button>Next Question</button>');
        } else {
            var nextButton = $('<button>Results</button>');
        }
        nextButton.bind('click', nextQuestion);
        $('.answerDiv'+currentQuestionIndex).append(nextButton);
        $('input[name="choice'+currentQuestionIndex+'"]').attr('disabled', true)
        if (local) {
            localStorage["currentQuestionIndex"] = currentQuestionIndex+1;
            localStorage["score"] = score;
            localStorage["answers"] = answers;
        } else {
            user.increment("currentQuestionIndex");
            user.set("score",score);
            user.set("answers",answers);
            user.save();
        }
    }
    
    //called when a student gets a question right
    function incrementScore() {
        score++;
    }
    var SimpleUser;
    var user;
  
    function login() {
        Parse.initialize("72XtL5Qay3zRedQynyMb4Qz3rCUdV6xh5zh88aO0", "0s6AR9o8TBb1VoRDi5xCBu2rfg8dGPW7FxxYgnpW");
        SimpleUser = Parse.Object.extend("SimpleUser");
        var username = $('.username').val();
        var query = new Parse.Query(SimpleUser);
        query.equalTo("username",username);
        query.find({ success: getUserSuccess, error: getUserError });
    }
    
    function getUserSuccess(results) {
        if (results.length == 1) {
            user = results[0];
            score = user.get("score");
            currentQuestionIndex = user.get("currentQuestionIndex");
            answers = user.get("answers");
            $('.loginDiv').empty();
            displayQuestion();
        } else if (results.length==0) {
            user = new SimpleUser();
            user.set("username", $('.username').val());
            user.set("score", 0);
            user.set("currentQuestionIndex", 0);
            user.set("answers", []);
            user.save();
            score = 0;
            currentQuestionIndex = 0;
            answers = [];
            $('.loginDiv').empty()
            displayQuestion();
        } else {
            getUserError("More than one usernames found.");
            return;
        }
    }
    
    function getUserError(error) {
        $('.quizQuestion').text(error);
        console.log(error);
    }
    
    function setup() {
        if (!local) {
            var loginDiv = $('<div class="loginDiv"></div>');
            var loginField = $('<label>Username: <input type="text" class="username"></input></label>');
            var loginButton = $('<button>Login</button>');
            loginButton.bind('click', login);
            var loginInfo = $("<br><text>If you've never logged in, create a new username now. Otherwise, enter the username you used last time.</text>")
            $(loginDiv).append(loginField,loginButton,loginInfo)
            $('.quiz').append(loginDiv);
        }
        var quizQuestionDiv = $('<div class="quizQuestion"></div>');
        $(".quiz").append(quizQuestionDiv);
        if (local) {
            displayQuestion();
        }
    }
    
    exports.setup = setup;
    
    return exports;
    
})();

$(document).ready(function() {
    
    quiz.setup();
    
    var req = $.ajax({ async: false, url:"http://localhost:8080/", data: {id:10} });
    req.done(function(msg) {
        console.log(msg);
    });
    
});