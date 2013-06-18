var quiz = (function() {
    
    
    
    var exports = [];
    
    
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
    
    var quizLengthReq = $.ajax({ async: false, url:"http://localhost:8080/", data: {func:"getQuizLength"} });
    var quizLength;
    quizLengthReq.done(function(msg) {
        quizLength = parseInt(msg);
    });

    
    
    //displays current quiz question to student
    function displayQuestion() {
        $(".quizQuestion").empty();
        
        if (currentQuestionIndex<quizLength) {
            
            var currentQuestionTextReq = $.ajax({ async: false, url:"http://localhost:8080/", data: {func:"getQuestionText",index:currentQuestionIndex} });
            var currentQuestionText;
            currentQuestionTextReq.done(function(msg) {
                currentQuestionText = String(msg);
            });
            
            var currentQuestionOptionsReq = $.ajax({ async: false, url:"http://localhost:8080/", data: {func:"getQuestionOptions",index:currentQuestionIndex} });
            var currentQuestionOptions;
            currentQuestionOptionsReq.done(function(msg) {
                currentQuestionOptions = JSON.parse(msg);
            });
            
            var newQuestion = $("<text>"+(currentQuestionIndex+1)+". "+currentQuestionText+"</text>");
            var radios = "";
            for (var q in currentQuestionOptions) {
                radios += "<br><input type='radio' name='choice"+currentQuestionIndex+"' value='"+currentQuestionOptions[q]+"'>"+currentQuestionOptions[q]+"</input>";
            }
            var answerOptions = $(radios+"<br>");
            var checkButton = $("<button class='checkButton"+currentQuestionIndex+"'>Check</button>");
            var ansDiv = $('<div class="answerDiv'+currentQuestionIndex+'"></div>');
            checkButton.bind("click",finalCheck);
            $(".quizQuestion").append(newQuestion,answerOptions,checkButton,ansDiv);
        } else {
            $(".quizQuestion").append("Your final score is "+score+"/"+quizLength+".");
            for (var i=0; i<quizLength;i++) {
                var yourAnswer = answers[i];
                
                var questionTextReq = $.ajax({ async: false, url:"http://localhost:8080/", data: {func:"getQuestionText",index:i} });
                var questionText;
                questionTextReq.done(function(msg) {
                    questionText = String(msg);
                });
                
                
                var questionAnswerReq = $.ajax({ async: false, url:"http://localhost:8080/", data: {func:"getQuestionAnswer",index:i} });
                var questionAnswer;
                questionAnswerReq.done(function(msg) {
                    questionAnswer = String(msg);
                });

                if (yourAnswer!=questionAnswer) {
                    $('.quizQuestion').append('<br><br><span class="incorrect">'+(i+1)+'. '+questionText+'</span>');
                } else {
                    $('.quizQuestion').append('<br><br><span class="correct">'+(i+1)+'. '+questionText+'</span>');
                }
                var breakdown1 = $('<br><text>&nbsp &nbsp Your Answer: '+yourAnswer+'</text>');
                var breakdown2 = $('<br><text>&nbsp&nbsp Correct Answer: '+questionAnswer+'</text>');
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
        var checkAnsReq = $.ajax({ async: false, url:"http://localhost:8080/", data: {index:currentQuestionIndex, answer:ans, func:"checkAnswer"} });
        var checkAns;
        checkAnsReq.done(function(msg) {
            checkAns = msg;
        });
        
        if (checkAns=="true") {
            
            
            var incrementScoreReq = $.ajax({ async: false, url:"http://localhost:8080/", data: {score:score, func:"incrementScore"} });
            incrementScoreReq.done(function(msg) {
                score = parseInt(msg);
            });
            
            $('.answerDiv'+currentQuestionIndex).append("Correct<br>");
        } else {
            $('.answerDiv'+currentQuestionIndex).append("Incorrect<br>");
        }
        if (currentQuestionIndex < quizLength-1) { 
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
    
    
});