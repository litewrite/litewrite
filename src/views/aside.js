define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var utils = require('utils');


  var AsideView = Backbone.View.extend({

    el: 'body',

    initialize: function(options) {

      _.bindAll(this, 'show', 'hide', 'toggle', 'desktopShow', 'desktopHide', 'showOrHide');

      this.app = options.app;

      this.app.on('ready', this.showOrHide);

      this.collection
        .on( 'add', this.desktopShow)
        .on( 'change', this.desktopHide)
        .on( 'fetch', this.desktopShow);

    },

    show: function() {
      this.$el.addClass('show-aside');
    },

    hide: function() {
      // hide sidebar when 3 or more docs and the open doc is not empty
      if ( this.collection.length > 2 && !this.app.doc.isEmpty() ) {
        this.$el.removeClass('show-aside');
      }
    },

    toggle: function() {
      this.$el.toggleClass('show-aside');
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
    }


  });


  return AsideView;

});
