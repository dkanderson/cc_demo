// Self invoking function with namespaced backbone-specific objects
(function(){

	var App = {
		Models = {},
		Collections = {},
		Views = {},
		Routes = {}
	};

	//global template function
  window.template = function(id){
    	return _.template( $('#' + id).html() );
  	};

  // global event function  
  window.vent = _.extend({}, Backbone.Events);

	// Video model
  App.Models.Video = Backbone.Models.extend({

		defaults: {
			thumbnail: 'img/thumb.jpg'
		}
	});

}());
