define(function(require) {

  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var utils = require('utils');
  var Snap = require('snap');


  var AsideView = Backbone.View.extend({

    el: 'body',

    initialize: function(options) {

      _.bindAll(this, 'show', 'hide', 'toggle', 'desktopShow', 'desktopHide', 'showOrHide', 'handleSnapper');

      this.app = options.app;

      this.app.on('ready', this.showOrHide);

      this.app.doc.on('change:content', this.desktopHide);

      this.collection
        .on( 'add', this.desktopShow)
        .on( 'remove', this.desktopShow)
        .on( 'change:title', this.desktopShow);

      this.snapper = new Snap({
        element: this.$('#snap-content')[0],
        disable: 'right'
      });
      this.handleSnapper();

      $(window).on('resize', this.handleSnapper);

    },

    show: function() {
      if (utils.isDesktop) return this.$el.addClass('show-aside');
      this.snapper.open('left');
    },

    hide: function() {
      if (utils.isMobile) return this.snapper.close();
      // hide sidebar when 3 or more docs and the open doc is not empty
      if ( this.collection.length > 2 && !this.app.doc.isEmpty() ) {
        this.$el.removeClass('show-aside');
      }
    },

    toggle: function() {
      if (utils.isDesktop) return this.$el.toggleClass('show-aside');
      if ( this.snapper.state().state === 'closed' ) return this.show();
      this.hide();
    },

    desktopShow: function() {
      if (utils.isDesktop) this.show();
    },

    desktopHide: function() {
      if (utils.isDesktop) _.delay( this.hide, 1000 );
    },

    // only needed on initialization.
    // show or hide aside depending on how many docs you have
    showOrHide: function() {
      // if only one doc or open doc empty return
      if ( this.collection.length < 2 || this.app.doc.isEmpty() ) return;
      this.show();
      if (utils.isDesktop) _.delay(this.hide, 3000);
    },

    handleSnapper: _.debounce(function() {
      if (utils.isMobile) return this.snapper.enable();
      this.snapper.close();
      this.snapper.disable();
    }, 700)


  });


  return AsideView;

});
