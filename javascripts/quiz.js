(function() {

  window.QuizApp = Ember.Application.create({
    Controllers: Ember.Namespace.create(),
    Models: Ember.Namespace.create(),
    Helpers: Ember.Namespace.create(),
    Views: Ember.Namespace.create(),
    Data: Ember.Namespace.create(),
    ready: function() {
      this.config = QuizApp.Models.Config.create({
        content: this.Data.config
      });
      return this.initQuizApp();
    },
    initQuizApp: function() {
      var questions, questionsArray, difficultyLevels;
	  
      questions = this.Data.questions.map(function(question) {
		if(question.pageId===1)
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
	currentPageId:1	
      });
    }
  });

}).call(this);

(function() {

  QuizApp.Models.Config = Ember.Object.extend({
  
  });

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
		var questionsTemp;	
		var questions=getQuestionArray();
		var selectedPageId=this.currentPageId;	  
		var length=questions.content.length;			
		questionsTemp=getQuestionArray();
			
		for(i=length-1;i>=0;i--)
		{
			if(questions.content[i].pageId!=selectedPageId)
			{
				questionsTemp.content.removeObject(questionsTemp.content[i]);
			}
		}
		
		if(questionsTemp.content.length>0)
		{
			this.set('questions', questionsTemp);			
		}
		return this.get('questions');
    }).observes('currentPageId')
  });
  
  function getQuestionArray()
  {
	var question,questionArray;
		question = QuizApp.Data.questions.map(function(Question) {
        return QuizApp.Models.Question.create(Question);
      });
	    questionArray = QuizApp.Models.Questions.create({
        content: question
      });
	 return  questionArray;
  };

  
 

  QuizApp.Views.App = Ember.View.extend({
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
	pageIdBinding:'question.pageId'
  });

  QuizApp.Views.Quiz = Ember.View.extend({
    mainBinding: 'QuizApp.main',
    templateName: 'app/templates/quiz'
  });
  
  

  QuizApp.Views.Next = Em.View.extend({
  classNames: ['next-tier-view'],
  tagName: 'button',
  click: function () {
	var currentPage=QuizApp.main.currentPageId;
	
	if(currentPage<4)
	{
		QuizApp.main.set('currentPageId', currentPage+1);		
	}
    
  }
});


Ember.RadioButton = Ember.View.extend({
  title: null,
  checked: false,
  group: "radio_button",
  disabled: false,

  classNames: ['ember-radio-button'],

  defaultTemplate: Ember.Handlebars.compile('<input type="radio" {{ bindAttr disabled="disabled" name="group" value="option" checked="checked"}} />&nbsp&nbsp{{title}}'),

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

QuizApp.Models.qqq = Ember.Object.extend({
    species : 'hello'
});

QuizApp.Models.controller = Ember.Object.create({
    content : QuizApp.Models.qqq.create()
});



}).call(this);


// Enable this to get lots of debugging in the console
// Ember.LOG_BINDINGS = true
;

