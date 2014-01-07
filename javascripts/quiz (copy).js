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
      return this.main = QuizApp.Controllers.Main.create({
        questions: questionsArray,
        difficultyLevels: difficultyLevels,
        selectedLevel: '',
        //currentQuestion: questionsArray.randomQuestion()
		currentPageId:1	,
		buttonName:'Next Page',
		buttonStart:'Start Quiz',
		currentQuestionId:1,
	answerCount:0,
	questionCount:0
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
		
		this.set('questions',getQuestionArray());			
		
		return this.get('questions');
    }).observes('currentQuestionId','selectedLevel')
  });
  
  function getQuestionArray()
  {	
		var Question;
		Question = QuizApp.Data.questions.map(function(question) {
			if(QuizApp.main.currentQuestionId===question.questionId)
			{
				return QuizApp.Models.Question.create(question);
			}
      });	   
	 return  Question;
  };

  
  QuizApp.Views.App = Ember.View.extend({
    answerBinding:'QuizApp.main.answerCount',
    nameBinding: 'QuizApp.config.name',
    mainBinding: 'QuizApp.main',
    questionsBinding: 'main.questions',
    //currentQuestionBinding: 'main.currentQuestion',
    difficultyLevelsBinding: 'main.difficultyLevels',
    selectedLevelBinding: 'main.selectedLevel',
    templateName: 'app/templates/app'
    
  });

  	
  QuizApp.Views.Question = Ember.View.extend({
    questionTextBinding: 'question.questionText',
	difficultyLevelBinding: 'question.difficultyLevel',
	answerBinding: 'question.answer',
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
	var currentPage=QuizApp.main.currentPageId;
	var currentQuestion=QuizApp.main.currentQuestionId;

	var user_answer=$("input[@name=default]:checked").val();
	var question=getQuestionArray();	
			
	if(user_answer===question[currentQuestion-1].answer)
	{		
		QuizApp.main.set('answerCount',QuizApp.main.answerCount+1);
	}
		QuizApp.main.set('questionCount',QuizApp.main.questionCount+1);
	console.log(QuizApp.main.answerCount);

	if(currentQuestion<10)
	{
		QuizApp.main.set('currentQuestionId', currentQuestion+1);		
		
	}
	
	if(QuizApp.main.get('buttonName')==='Submit'){
		
		console.log("Your score is "+QuizApp.main.get('answerCount'));
		alert("Your score is "+QuizApp.main.get('answerCount'));
		alert("Time taken to complete the test is  "+min+" mins "+sec+" secs");
		this.$().hide("slow", function() {
            that.remove();
        });
		$('span').html().hide();
	}
	
	
	if (currentQuestion+1<=10){
		startTimer();
	}
	if(currentQuestion===9)
	{
		QuizApp.main.set('buttonName','Submit');
	}
		
}
 
 


 QuizApp.Views.start = Em.View.extend({
	  classNames: ['inputElements'],
	  tagName: 'button',
	  click: function () {
			this.$().hide("slow", function() {
				that.remove();
			});
			startTimer();
			}

 });
 
 function startTimer() {
 
	$('span').html('00:05');
	var oldQuestionId=QuizApp.main.currentQuestionId;
	setInterval(function() {
		var currentQuestionId=QuizApp.main.currentQuestionId;
		if (currentQuestionId!=oldQuestionId) return;
		
		var timer = $('span').html();
		timer = timer.split(':');
		var minutes = timer[0];
		var seconds = timer[1];
		
		if (currentQuestionId>10) return;
		
		if (seconds== 0 && minutes == 0) {
			nextQuestion();
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

	bindingChanged: function(){
	  // if(this.get("option") == get(this, 'value')){
	  //     this.set("checked", true);
	  //  }
	}.observes("value"),
		
	change: function() {
		Ember.run.once(this, this._updateElementValue);
	},

	_updateElementValue: function() {
	  //  var input = this.$('input:radio');
	  //  set(this, 'value', input.attr('value'));
	}
});


}).call(this);


// Enable this to get lots of debugging in the console
// Ember.LOG_BINDINGS = true
;


