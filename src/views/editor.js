define(function(require) {

  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var utils = require('utils');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function(options) {

      _.bindAll(this, 'render', 'focus');

      this.app = options.app;

      this.app.on('ready', this.render);
      this.app.doc.on('change:id', this.render);

    },

    // only re-render when content changed
    render: function() {
      var content = this.app.doc.get('content');
      if (!content) return this.$el.text(' '); // NOTE: is redundant as soon as we use codemirror
      if ( content === this.$el.html() ) return;
      this.$el.html(content);
      this.focus();
    },

    focus: function() {
      if (utils.isDesktop) this.$el.focus();
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function(e) {
      if ( e.which === (utils.modKey.code) ) return this.trigger('modKey');
      this.app.doc.set( 'content', this.$el.html() );
    }

  });


  return EditorView;
});
