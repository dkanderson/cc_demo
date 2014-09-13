// Self invoking function with namespaced backbone-specific objects
(function () {

    'use strict';

    $(function () {
        FastClick.attach(document.body);
    });

    var App = {
            Models: {},
            Collections: {},
            Views: {},
            Routers: {}
        };

    //global template function
    window.template = function (id) {
        return _.template($('#' + id).html());
    };

    // global event function
    window.vent = _.extend({}, Backbone.Events);

    App.Models.Videos = Backbone.Model.extend({
    });

    App.Collections.Videos = Backbone.Collection.extend({
        model: App.Models.Videos,
        url: 'http://gdata.youtube.com/feeds/api/users/nbc/uploads?alt=jsonc&v=2',
        parse: function(resp){
                return resp.data.items;
        },
    });

  // App View
    App.Views.App = Backbone.View.extend({
        el: '#cc_wrapper',

        template: template('appData'),

        initialize: function () {
            setTimeout(function () {
                $('.inner-wrapper').hide();
                $('#bottom-panel').hide();
            }, 100);
            $(window).on('resize', this.fitVid);
        },

        events: {
            'click .tr-wrap': 'openTranscript',
            'click #close-transcript': 'closeTranscript',
            'click .transcript': 'closeTranscript'
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        },

        openTranscript: function () {

            $('.tr-wrap').addClass('opened');
            setTimeout(function () {
                $('.transcript').addClass('slide-out');
                $('#close-transcript').fadeIn();
            }, 300);
            setTimeout(function () {
                $('.inner-wrapper').fadeIn('fast');
            }, 400);
        },

        closeTranscript: function () {
            setTimeout(function () {
                $('.tr-wrap').removeClass('opened');
            }, 300);
            $('.transcript').removeClass('slide-out');
            $('#close-transcript').fadeOut();
            setTimeout(function () {
                $('.inner-wrapper').fadeOut('fast');
            }, 500);
        },

        fitVid: function () {
            var wrapper = $('#cc_wrapper');
            wrapper.fitVids();
        }
    });

    // Header View
    App.Views.Header = Backbone.View.extend({
        el: '.app-header',

        template: template('headerTemplate'),

        events: {
            'click .flipTrigger': 'flip'
        },

        initialize: function () {
            this.render();
        },

        flip: function () {
            var wrapper = $('#cc_wrapper'), newHeight;

            wrapper.toggleClass('flip');
            newHeight = wrapper.hasClass('flip') ? $('.back').height() : $('.front').height();
            wrapper.height(newHeight);
            setTimeout(function () {
                $('#bottom-panel').css({ 'top': (wrapper.height() - 4) });
            }, 540);

        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));

            return this;
        }

    });

    App.Views.MetaData = Backbone.View.extend({
        el: '.meta-data',

        template: template('metaData'),

        events: {
            'click dt': 'accordion'
        },

        initialize: function () {
            this.render();
            //vent.on('date:format', this.formatDate, this);
        },

        accordion: function (ev) {
            $('.meta-data dd').slideUp();
            $('.meta-data dt').find('span').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
            if ($(ev.target).next().is(':visible')) {
                $('.meta-data dt').find('span').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
            } else {
                $(ev.target).find('span').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
            }

            if (!$(ev.target).next().is(':visible')) {
                $(ev.target).next().slideDown();
            }
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    App.Views.Footer = Backbone.View.extend({
        el: '.util',

        template: _.template('<nav class="actions"><a><span class="fa fa-save"></span>save</a><a href="#"><span class="fa fa-file-text"></span>notes</a><a class="toggle-share" href="#"><span class="fa fa-share"></span>share</a><a href="#"><span class="fa fa-print"></span>print</a><a href="#"><span class="fa fa-download"></span>download</a><a href="#"><span class="fa fa-check"></span>standards</a></nav>'),

        events: {
            'click .toggle-share': 'toggleShare'
        },

        initialize: function () {
            this.render();
        },

        toggleShare: function () {
            $('#bottom-panel').slideToggle();
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });

    App.Views.Social = Backbone.View.extend({
        el: '#bottom-panel',

        template: template('socialTpl'),

        events: {
            'click #close-panel': 'closePanel'
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });

    App.Views.Video = Backbone.View.extend({
        el: '.wrap_video',

        template: template('theVideo'),

        initialize: function () {
            this.render();
            $('#cc_wrapper').fitVids();
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }
    });

    App.Routers.Kickstart = Backbone.Router.extend({
        routes: {
            "": "start"
        },
        start: function(){
            var nbcVideos = new App.Collections.Videos();
            nbcVideos.fetch({
                success: function (videoData) {
                    console.log(videoData.at(0));
                    $('body').append(new App.Views.App({model: videoData.at(0)}).render());
                    var headerView = new App.Views.Header({model: videoData.at(0)}),
                        currentMeta = new App.Views.MetaData({model: videoData.at(0)}),
                        footerView = new App.Views.Footer(),
                        bp = new App.Views.Social(),
                        theVideo = new App.Views.Video({model: videoData.at(0)});
                }
            });

        }
    });

    _.template.parseDate = function (theDate) {
        var myDate = new Date(Date.parse(theDate)),
            theMonth = myDate.getMonth(),
            theDay = myDate.getDate(),
            theYear = myDate.getFullYear();

        return theMonth + '/' + theDay + '/' + theYear;
    }

    App.kickstart = new App.Routers.Kickstart();
    Backbone.history.start();

}());
