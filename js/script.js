// Self invoking function with namespaced backbone-specific objects
(function () {

  'use strict';

	var App = {
		Models:{},
		Collections: {},
		Views:{},
		Routers: {}
	};

	//global template function
  window.template = function(id){
    	return _.template( $('#' + id).html() );
  	};

  // global event function  
  window.vent = _.extend({}, Backbone.Events);

	App.Models.Videos = Backbone.Model.extend({
  });

  App.Collections.Videos = Backbone.Collection.extend({
    model: App.Models.Videos,
    url: 'http://gdata.youtube.com/feeds/api/users/nbc/uploads?alt=jsonc&v=2'
  });

  // App View
  App.Views.App = Backbone.View.extend({
      el: '#cc_wrapper',

      template: template('appData'),

      initialize: function(){
          console.log('fires');
          $('.inner-wrapper').fadeOut('fast');
          this.render();
          //vent.on('app:rendered', this.fixVideo, this);
      },

      events: {
        'click .tr-wrap': 'openTranscript',
        'click #close-transcript': 'closeTranscript'
      },

      render: function(){
        this.$el.html(this.template(this.model));
      
        return this;
      },

      openTranscript: function(e){
        console.log('clicked');

        $('.tr-wrap').addClass('opened');
        setTimeout(function(){
          $('.transcript').addClass('slide-out');
          $('#close-transcript').fadeIn();
        }, 300);
        setTimeout(function(){
          $('.inner-wrapper').fadeIn('fast');
        }, 400);
      },

      closeTranscript: function(){
        setTimeout(function(){
          $('.tr-wrap').removeClass('opened');
        }, 300);
        $('.transcript').removeClass('slide-out');
        $('#close-transcript').fadeOut();
        setTimeout(function(){
          $('.inner-wrapper').fadeOut('fast');
        }, 500);
      },

      

	});

  // Header View
  App.Views.Header = Backbone.View.extend({
    el: '.app-header',

    template: template('headerTemplate'),

    events: {
      'click .flipTrigger': 'flip',
    },

    initialize: function(){
      this.render();
    },

    flip: function(){
      var wrapper = $('#cc_wrapper');

      wrapper.toggleClass('flip');
      (wrapper.hasClass('flip')) ? wrapper.height($('.back').height()) : wrapper.height($('.front').height());
    },

    render: function(){
      this.$el.html(this.template(this.model));

      return this;
    }

  });

  App.Views.MetaData = Backbone.View.extend({
          el: '.meta-data',

          template: template('metaData'),

          events: {
            'click dt': 'accordion',
          },

          initialize: function(){
            this.render();
          },

          accordion: function(ev){
            $('.meta-data dd').slideUp();
            $('.meta-data dt').find('span').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
            if($(ev.target).next().is(':visible')){
              $('.meta-data dt').find('span').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
            }else{
              $(ev.target).find('span').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
            }

            if(!$(ev.target).next().is(':visible')){
              $(ev.target).next().slideDown();
            }
          },

          render: function(){
            this.$el.html(this.template(this.model));
            return this;
          }
  });

  App.Views.Footer = Backbone.View.extend({
          el: '.util',

          template: _.template('<nav class="actions"><a><span class="fa fa-save"></span>save</a><a href="#"><span class="fa fa-file-text"></span>notes</a><a class="toggle-share" href="#"><span class="fa fa-share"></span>share</a><a href="#"><span class="fa fa-print"></span>print</a><a href="#"><span class="fa fa-download"></span>download</a><a href="#"><span class="fa fa-check"></span>standards</a></nav>'),

          events: {
              'click .toggle-share': 'toggleShare',
          },

          initialize: function(){
            this.render();
          },

          toggleShare: function () {
            $('#bottom-panel').toggleClass('slide-down');
          },

          render: function(){
            this.$el.html(this.template(this.model));
            return this;
          }
  });

  App.Routers.Kickstart = Backbone.Router.extend({
    routes: {
      "": "start",
    },

    initialize: function(){
        this.nbcVideos = new App.Collections.Videos();

        this.nbcVideos.fetch({
          success: function(videoData){
              $('body').append(new App.Views.App({model: videoData.models[0].attributes.data.items[0]}).render().el);
              var headerView = new App.Views.Header({model: videoData.models[0].attributes.data.items[0]});
              var currentMeta = new App.Views.MetaData({model: videoData.models[0].attributes.data.items[0]});
              var footerView = new App.Views.Footer();
          }
        });
    },

    start: function(){
      

      //this.newApp = new App.Views.App({model: this.nbcVideos});  
      

    }   
  });

  

var kickstart = new App.Routers.Kickstart;
Backbone.history.start();
  
}());