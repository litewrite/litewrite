define(function(require) {

  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var utils = require('utils');
  var lang = require('i18n!nls/lang');
  require('autosize');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function(options) {

      _.bindAll(this, 'render', 'focus', 'blur', 'desktopFocus', 'handleCyrillic');

      this.model.on('change:id', this.render);
      this.model.on('change:content', this.handleCyrillic);
      this.model.on('update', this.render);

      this.$el.autosize();
      this.setPlaceholder();
    },

    // only re-render when content changed
    render: function() {
      var content = this.model.get('content');
      if ( content === this.$el.val() ) return;
      // strip html tags from documents and convert & sign.
      // this is just for migration from contenteditable to textarea.
      // we can remove this later on.
      content = content.replace(/<br>/ig,'\n').replace(/<\/div>/ig,'\n').replace(/<[^>]+>/ig,'').replace(/&amp;/ig,'&');
      this.$el.val(content || '').trigger('autosize.resize');
    },

    focus: function() {
      if (utils.isDesktop) return this.$el.focus();
      // doesn't seem to work for textarea on iOS at all. maybe it works on other platforms.
      setTimeout(_.bind(this.$el.focus, this.$el), 500);
    },

    desktopFocus: function() {
      if (utils.isDesktop) this.focus();
    },

    blur: function() {
      this.$el.blur();
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function(e) {
      this.model.set( 'content', this.$el.val() );
      this.trigger('typing');
    },

    // if a cyrillic doc is detected change to cyrillic font
    handleCyrillic: function(doc) {
      // see http://kourge.net/projects/regexp-unicode-block
      var isCyrillic = doc.get('content').match('[\u0400-\u04FF\u0500-\u052F]');
      if (!isCyrillic) return;
      this.$el.addClass('cyrillic');
      this.model.off(null, this.handleCyrillic);
    },

    setPlaceholder: function() {
      this.$el.attr('placeholder', lang.emptyDoc);
    }

  });


  return EditorView;
});
