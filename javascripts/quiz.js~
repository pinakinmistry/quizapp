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
		return QuizApp.Models.Question.create(question);
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
        selectedLevel: ''
        //currentQuestion: questionsArray.randomQuestion()
      });
    }
  });

}).call(this);

(function() {

  QuizApp.Models.Config = Ember.Object.extend({
    drilldownMetrics: (function() {
      return this.get('content').drilldownMetrics;
    }).property('content'),
    mapWithItems: (function() {
      return this.get('content').mapWithItems;
    }).property('content'),
    mapWithRegions: (function() {
      return this.get('content').mapWithRegions;
    }).property('content'),
    name: (function() {
      return this.get('content').name;
    }).property('content'),
    type: (function() {
      return this.get('content').type;
    }).property('content'),
    theme: (function() {
      return this.get('drilldownMetrics').theme;
    }).property('content'),
    current_chart_type: (function() {
      return this.get('drilldownMetrics').current_chart.type;
    }).property('content'),
    historical_chart_type: (function() {
      return this.get('drilldownMetrics').historical_chart.type;
    }).property('content'),
    historical_chart_title: (function() {
      return this.get('drilldownMetrics').historical_chart.title;
    }).property('content')
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
	
  });
  
 

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
  });

  QuizApp.Views.Quiz = Ember.View.extend({
    mainBinding: 'QuizApp.main',
    templateName: 'app/templates/quiz'
  });
  
  
  QuizApp.Views.NextTierView = Em.View.extend({
  classNames: ['next-tier-view'],
  tagName: 'button',
  click: function () {
    console.log("Next Button");
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
    species : ''
});

QuizApp.Models.controller = Ember.Object.create({
    content : QuizApp.Models.qqq.create()
});



}).call(this);


// Enable this to get lots of debugging in the console
// Ember.LOG_BINDINGS = true
;

