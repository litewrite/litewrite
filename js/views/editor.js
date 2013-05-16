define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var settings = require('models/settings');
  var cache = require('utils/cache');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function() {
      cache.loading.done(_.bind(this.render, this));
      settings.on('change:openDocId', this.render, this);
    },

    render: function() {
      var content = (cache.openDoc && cache.openDoc.get('content'));
      if (content) {
        if (content !== this.$el.html()) {
          this.$el.html(content);
          if (!cache.isMobile) this.focus();
        }
      } else {
        this.$el.text(' ');
      }
    },

    focus: function() {
      this.$el.focus();
    },

    events: {
      'keyup': 'updateOpenDoc',
      'click img': 'toggleAlignment'
    },

    updateOpenDoc: function() {
      cache.openDoc.set( 'content', this.$el.html() );
    },

    toggleAlignment: function() {
      $('img').toggle(
        function(){$(this).attr('align','left');},
        function(){$(this).attr('align','bottom');}
      );
    }

  });


  return EditorView;
});
