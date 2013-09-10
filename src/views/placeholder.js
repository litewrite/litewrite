define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');


  var PlaceholderView = Backbone.View.extend({

    el: '.editor-placeholder',

    initialize: function() {

      _.bindAll(this, 'toggle');

      this.model.on('change:title', this.toggle);

    },

    toggle: function() {
      this.model.isEmpty() ? this.$el.removeClass('hide') : this.$el.addClass('hide');
    }

  });


  return PlaceholderView;
});
