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
        content: ['Select one','Simple', "Average", "Complex"]
      });
	  var randIncrement = Math.round(Math.random()*(Math.floor(count.totalSetCount/count.quizSetCount)));
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
			currentQuestionId:1,
			answerCount:0,
			questionCount:0,
			questionIncrement:randIncrement,				
			isSubmitted:true,
			isResultDisplayed:true,
			isStartPage:false,
			resultPercentage:0,
			selectedLevel:'Select one',
			totalQuestion:count.quizSetCount,
			duration:'00:10'
      });
    }
  });

}).call(this);

(function() {
  
	 /* Controller */ 
	  QuizApp.Controllers.Main = Ember.Object.extend({
	
			getNextQuestions: (function() {		
				this.set('questions',getQuestionArray(false));					
				return this.get('questions');
			}).observes('currentQuestionId','selectedLevel')

	  });


	 /* Models */
	  QuizApp.Models.Question = Ember.Object.extend({
		
			questionText: (function() {	
			  return this.get('question');
			}).property('question')

	  });

	  QuizApp.Models.Questions = Ember.ArrayProxy.extend({
	 
	  });

	 /* Views */  
	  QuizApp.Views.App = Ember.View.extend({
		answerBinding:'QuizApp.main.answerCount',
		nameBinding: 'QuizApp.config.name',
		mainBinding: 'QuizApp.main',
		questionsBinding: 'main.questions',  
		difficultyLevelsBinding: 'main.difficultyLevels',
		selectedLevelBinding: 'main.selectedLevel',
		templateName: 'app/templates/app',    
	  });

	  	
	  QuizApp.Views.Question = Ember.View.extend({
		questionTextBinding: 'question.questionText',
		difficultyLevelBinding: 'question.difficultyLevel',	
		optionsBinding: 'question.options',
		pageIdBinding:'question.pageId',
		questionIdBinding:'question.questionId',
		buttonNameBinding:'QuizApp.main.buttonName',	
		currentQuestionIdBinding:'main.currentQuestionId'
	  });



	  QuizApp.Views.Next = Em.View.extend({
		  classNames: ['next-tier-view'],
		  tagName: 'button',

		  click: function () {
				nextQuestion();
		  }
	  });
	 
	  QuizApp.Views.start = Em.View.extend({
		  classNames: ['inputElements'],
		  tagName: 'button',
		  click: function () {
				this.$().hide("slow", function() {			
				});
					var randVal = Math.round(Math.random()*count.totalSetCount);						
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

		defaultTemplate: Ember.Handlebars.compile('<input type="radio" {{ bindAttr disabled="disabled" name="group" value="option" 					checked="checked"}} />&nbsp&nbsp{{title}}'),	
	  });


	/* Functions */

	  function getQuestionArray(isQuestionId)
	  {	
			var Question,currentQuestion;
			var questionLevel=QuizApp.Data.questions;
		
			if(QuizApp.main.selectedLevel==='Average')
				{questionLevel=QuizApp.Data.questionsMed;}
			else if(QuizApp.main.selectedLevel==='Complex')
				{questionLevel=QuizApp.Data.questionsHigh;}

			Question = questionLevel.map(function(question) {
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

	  function nextQuestion() 
	  {
			var currentQuestion=QuizApp.main.questionCount;
			var nextQuestion=QuizApp.main.currentQuestionId+QuizApp.main.questionIncrement;
			var user_answer=$("input[@name=default]:checked").val();
			var question=getQuestionArray(true);	
	

			if(QuizApp.main.get('buttonName')==='Submit')
			{					
					this.$().hide("slow", function() {			
					});		
					getTotalPercentage();			
			}
			if(currentQuestion<=count.quizSetCount)
			{
					if(nextQuestion>count.totalSetCount)
					{
						nextQuestion=nextQuestion-count.totalSetCount;
					}
					console.log('Next Question : '+nextQuestion);
					QuizApp.main.set('currentQuestionId', nextQuestion);	
					if(user_answer===question.answer)
					{		
						QuizApp.main.set('answerCount',QuizApp.main.answerCount+1);
					}
					QuizApp.main.set('questionCount',QuizApp.main.questionCount+1);	
					
			}		
			QuizApp.main.set('resultPercentage',(QuizApp.main.answerCount*100)/count.quizSetCount);
	
			if (currentQuestion+1<=count.quizSetCount){
				startTimer();
			}
			if(currentQuestion===count.quizSetCount-1)
			{
				QuizApp.main.set('buttonName','Submit');
			}		
	  }
	 
	  function getTotalPercentage()
	  {
			QuizApp.main.set('isResultDisplayed',false);
			QuizApp.main.set('isSubmitted',true);			
			quizStatus.quizOver=true;	
	  }

	 
	  function startTimer() {
		 	var quizTime='00:10';
			if(QuizApp.main.selectedLevel==='Simple')
			{quizTime='00:10';}
			else if(QuizApp.main.selectedLevel==='Average')
			{quizTime='00:20';}
			else if(QuizApp.main.selectedLevel==='Complex')
			{quizTime='00:30';}
	
			QuizApp.main.set('duration',quizTime);
			$('span').html(quizTime);
			var oldQuestionId=QuizApp.main.questionCount;
			QuizApp.main.set('resultPercentage',(QuizApp.main.answerCount*100)/count.quizSetCount);

			setInterval(function() {	
				if(quizStatus.quizOver)
					return;

				var currentQuestionId=QuizApp.main.questionCount;
				if (currentQuestionId!=oldQuestionId) return;
		
				var timer = quizTime;
				timer = timer.split(':');
				var minutes = timer[0];
				var seconds = timer[1];		

				if (currentQuestionId>count.quizSetCount) return;
				if(currentQuestionId<=count.quizSetCount)
				{
			
						if (seconds== 00 && minutes == 00 ) {
							if(QuizApp.main.questionCount===(count.quizSetCount))
							{
								getTotalPercentage();							
																			
							}
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
						quizTime=minutes+':'+seconds;		
				}			
			}, 1000);
	   }
	 
	var min;
	var sec;

}).call(this);


// Enable this to get lots of debugging in the console
// Ember.LOG_BINDINGS = true
;



