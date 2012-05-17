(function() {

  window.QuizApp = Ember.Application.create({
    Controllers: Ember.Namespace.create(),
    Models: Ember.Namespace.create(),
    Helpers: Ember.Namespace.create(),
    Views: Ember.Namespace.create(),
    Data: Ember.Namespace.create(),
    
	ready: function() {
      return this.initQuizApp();
    },
    initQuizApp: function() {
      var questions, questionsArray, difficultyLevels;
	  
      questions = this.Data.questions.map(function(question) {		
			if(question.questionId===1)
			{
				return QuizApp.Models.Question.create(question);
			}
      });
      questionsArray = QuizApp.Models.Questions.create({
        content: questions
      });
      difficultyLevels = Ember.ArrayProxy.create({
        content: ['select one','low', "medium", "high"]
      });
	  var randIncrement = Math.round(Math.random()*3);
	  if (randIncrement===0)
	  {
		randIncrement++;
	  }
	  console.log('Incrementor :'+randIncrement);	
	  return this.main = QuizApp.Controllers.Main.create({
        questions: questionsArray,
        difficultyLevels: difficultyLevels,       
		currentPageId:1	,
		buttonName:'Next Page',
		buttonStart:'Start Quiz',
		currentQuestionId:1,
		answerCount:0,
		questionCount:0,
		questionIncrement:randIncrement,
		quizSetCount:0,
		quizOver:false,
		isSubmitted:true,
		isResultDisplayed:true,
		isStartPage:false,
		resultPercentage:0
      });
    }
  });

}).call(this);

(function() {
  
  QuizApp.Models.Questions = Ember.ArrayProxy.extend({
  /*
    randomQuestion: function() {
      var randomIndex;
      randomIndex = Math.random() * this.get('content').length();
      return this.get('content')[randomIndex];
    }
  */
  });

  QuizApp.Models.Question = Ember.Object.extend({
    
	questionText: (function() {
	  //console.log(this.get('question'));
      return this.get('question');
    }).property('question')
  });

  QuizApp.Controllers.Main = Ember.Object.extend({
	getNextQuestions: (function() {
		
		this.set('questions',getQuestionArray(false));			
		
		return this.get('questions');
    }).observes('currentQuestionId')
  });
  
 function getQuestionArray(isQuestionId)
  {	
		var Question,currentQuestion;
		Question = QuizApp.Data.questions.map(function(question) {
			if(QuizApp.main.currentQuestionId===question.questionId)
			{
				if (isQuestionId)
				{
					currentQuestion=QuizApp.Models.Question.create(question);					
				}
				else
				{
				    return QuizApp.Models.Question.create(question);
				}
			}
		});	
		if (isQuestionId)
		{
			return currentQuestion;
		}
		return  Question;
  };

  
  QuizApp.Views.App = Ember.View.extend({
    answerBinding:'QuizApp.main.answerCount',
    nameBinding: 'QuizApp.config.name',
    mainBinding: 'QuizApp.main',
    questionsBinding: 'main.questions',  
    difficultyLevelsBinding: 'main.difficultyLevels',
    selectedLevelBinding: 'main.selectedLevel',
    templateName: 'app/templates/app'
    
  });

  	
  QuizApp.Views.Question = Ember.View.extend({
    questionTextBinding: 'question.questionText',
	difficultyLevelBinding: 'question.difficultyLevel',
	//answerBinding: 'question.answer',
	optionsBinding: 'question.options',
	pageIdBinding:'question.pageId',
	questionIdBinding:'question.questionId',
	buttonNameBinding:'QuizApp.main.buttonName',
	buttonStartBinding:'QuizApp.main.buttonStart',
	currentQuestionIdBinding:'main.currentQuestionId'
  });



  QuizApp.Views.Next = Em.View.extend({
	  classNames: ['next-tier-view'],
	  tagName: 'button',

	  click: function () {
			nextQuestion();
	  }
 });
 
 function nextQuestion() {
	var currentQuestion=QuizApp.main.questionCount;
	var nextQuestion=QuizApp.main.currentQuestionId+QuizApp.main.questionIncrement;
	var user_answer=$("input[@name=default]:checked").val();
	var question=getQuestionArray(true);	
	

	if(QuizApp.main.get('buttonName')==='Submit')
	{		
			alert("Your score is "+QuizApp.main.get('answerCount'));
			alert("Time taken to complete the test is  "+min+" mins "+sec+" secs");
			this.$().hide("slow", function() {			
			});		
			getTotalPercentage();
						
	}
	else if(currentQuestion<=10)
	{
			if(nextQuestion>30)
			{
				nextQuestion=nextQuestion-30;
			}
			console.log('Next Question : '+nextQuestion);
			QuizApp.main.set('currentQuestionId', nextQuestion);	
			if(user_answer===question.answer)
			{		
				QuizApp.main.set('answerCount',QuizApp.main.answerCount+1);
			}
			QuizApp.main.set('questionCount',QuizApp.main.questionCount+1);			
	}		
	
	
	if (currentQuestion+1<=10){
		startTimer();
	}
	if(currentQuestion===9)
	{
		QuizApp.main.set('buttonName','Submit');
	}
		
}
 
function getTotalPercentage()
{
	QuizApp.main.set('isResultDisplayed',false);
	QuizApp.main.set('isSubmitted',true);	
	QuizApp.main.set('quizOver',true);
	QuizApp.main.set('resultPercentage',Math.round(QuizApp.main.answerCount*10));	
}

 QuizApp.Views.start = Em.View.extend({
	  classNames: ['inputElements'],
	  tagName: 'button',
	  click: function () {
			this.$().hide("slow", function() {			
			});
				var randVal = Math.round(Math.random()*30);						
 				if (randVal===0)
	  			{
					randVal++;
	  			}
				QuizApp.main.set('currentQuestionId',randVal);
				QuizApp.main.set('questionCount',1);
				console.log('Question Count :'+QuizApp.main.questionCount);
				console.log('Random Value: '+randVal);
				startTimer();
				QuizApp.main.set('isSubmitted',false);
				QuizApp.main.set('isStartPage',true);
			}

 });
 
 function startTimer() {
 	
	$('span').html('00:05');
	var oldQuestionId=QuizApp.main.questionCount;
	setInterval(function() {	
		if(QuizApp.main.quizOver)
			return;

		var currentQuestionId=QuizApp.main.questionCount;
		if (currentQuestionId!=oldQuestionId) return;
		
		var timer = $('span').html();
		timer = timer.split(':');
		var minutes = timer[0];
		var seconds = timer[1];
		
		if (currentQuestionId>10) return;
		if(currentQuestionId<=10)
		{
			
				if (seconds== 00 && minutes == 00 ) {
					if(QuizApp.main.quizSetCount!=11)
					{
						nextQuestion();
					}
					else
					{						
						getTotalPercentage();				
					}
					return;
				}
		
				seconds -= 1;
				if (minutes < 0) return;
		
				if (seconds < 0 && minutes != 0) {
					minutes -= 1;
					seconds = 59;
				}
				else if (seconds < 10 && seconds.length != 2) seconds = '0' + seconds;
				if (minutes < 10 && minutes.length != 2) minutes = '0' + minutes;
				$('span').html(minutes + ':' + seconds);
				min=minutes;
				sec=seconds;
				if(currentQuestionId===10)
				{	
					QuizApp.main.set('quizSetCount',11);
				}		
		
		}
	}, 1000);
 }
 
var min;
var sec;

 QuizApp.Views.Text = Em.View.extend({
	 classNames: ['inputElements'],
	 tagName: 'input',
	 enabled: true,
	 });
 QuizApp.Views.DisabledText = Em.View.extend({
	 classNames: ['inputElements'],
	 tagName: 'input',
	 enabled: false,
	 });

 
 QuizApp.Views.Name = Em.View.extend({
	 
	 });


Ember.RadioButton = Ember.View.extend({
	title: null,
	checked: false,
	group: "radio_button",
	disabled: false,

	classNames: ['ember-radio-button'],

	defaultTemplate: Ember.Handlebars.compile('<input type="radio" {{ bindAttr disabled="disabled" name="group" value="option" 			checked="checked"}} />&nbsp&nbsp{{title}}'),
	
});


}).call(this);


// Enable this to get lots of debugging in the console
// Ember.LOG_BINDINGS = true
;


