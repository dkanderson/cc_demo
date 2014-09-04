// Self invoking function with namespaced backbone-specific objects
(function () {

  'use strict';

	var App = {
		Models:{},
		Collections: {},
		Views:{},
		Routes: {}
	};

	//global template function
  window.template = function(id){
    	return _.template( $('#' + id).html() );
  	};

  // global event function  
  window.vent = _.extend({}, Backbone.Events);

	// App View
  App.Views.App = Backbone.View.extend({
      el: '#cc_wrapper',

      template: template('appData'),

      initialize: function(){
          this.render();
          $('.inner-wrapper').fadeOut('fast');
      },

      events: {
        'click .transcript-link': 'openTranscript',
        'click #close-transcript': 'closeTranscript'
      },

      render: function(){
        this.$el.html(this.template());
        //console.log(this.$el);

        return this;
      },

      openTranscript: function(){
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
      }

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
      this.$el.html(this.template());

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
            this.$el.html(this.template());
            return this;
          }
  });

  App.Views.Footer = Backbone.View.extend({
          el: '.util',

          template: _.template('<nav class="actions"><a href="#"><span class="fa fa-save"></span>save</a><a href="#"><span class="fa fa-file-text"></span>notes</a><a class="toggle-share" href="#"><span class="fa fa-share"></span>share</a><a href="#"><span class="fa fa-print"></span>print</a><a href="#"><span class="fa fa-download"></span>download</a><a href="#"><span class="fa fa-check"></span>standards</a></nav>'),

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
            this.$el.html(this.template());
            return this;
          }
  });

  var newApp = new App.Views.App();
  var headerView = new App.Views.Header();
  var currentMeta = new App.Views.MetaData();
  var footerView = new App.Views.Footer();


}());

// resize video based on aspect ratio relative to container
var allVideos = $('iframe'), fluidEl = $("figure");
        
    allVideos.each(function() {
  
    $(this)
      // jQuery .data does not work on object/embed elements
      .attr('data-aspectRatio', this.height / this.width)
      .removeAttr('height')
      .removeAttr('width');
  
  });

$(window).resize(function() {

  var newWidth = fluidEl.width();
  allVideos.each(function() {
    var el = $(this);
    el
        .width(newWidth)
        .height(newWidth * el.attr('data-aspectRatio'));
  });
  $('#transcript').height($('.front').height());

  var wrapper = $('#cc_wrapper');
  (wrapper.hasClass('flip')) ? wrapper.height($('.back').height()) : wrapper.height($('.front').height());

}).resize();

