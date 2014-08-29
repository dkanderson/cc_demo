// Self invoking function with namespaced backbone-specific objects
(function(){

	var App = {
		Models:{},
		Collections: {},
		Views:{},
		Routes: {}
	};
  
  $('.flipTrigger').on('click', function(){
      $('#cc_wrapper').toggleClass('flip');
  });

  $('.meta-data dt').on('click', function(){
    $('.meta-data dd').slideUp();
    $('.meta-data dt').find('span').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
    if($(this).next().is(':visible')){
      $('.meta-data dt').find('span').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
    }else{
      $(this).find('span').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
    }

    if(!$(this).next().is(':visible')){
      $(this).next().slideDown();
    }
  });
  
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
  
  }).resize();

	//global template function
  window.template = function(id){
    	return _.template( $('#' + id).html() );
  	};

  // global event function  
  window.vent = _.extend({}, Backbone.Events);

	// Video model
  App.Models.Video = Backbone.Model.extend({

		defaults: {
			thumbnail: 'img/thumb.jpg'
		}
	});

}());
