define(function(require) {

  var _ = require('underscore');
  var $ = require('jquery');
  var Backbone = require('backbone');
  var utils = require('utils');
  require('autosize');


  var EditorView = Backbone.View.extend({

    el: '#editor',

    initialize: function(options) {

      _.bindAll(this, 'render', 'focus', 'blur', 'desktopFocus');

      this.app = options.app;

      this.app.on('ready', this.render);
      this.app.on('ready', this.desktopFocus);
      this.app.doc.on('change:id', this.render);
      this.app.doc.on('update', this.render);
      this.app.doc.on('change:content', this.detect_l10n, this);
      this.$el.autosize();
    },

    // only re-render when content changed
    render: function() {
      var content = this.app.doc.get('content');
      if ( content === this.$el.val() ) return;
      // strip html tags from documents.
      // this is just for migration from contenteditable to textarea.
      // we can remove this later on.
      content = content.replace(/<br>/ig,'\n').replace(/<[^>]+>/ig,'');
      this.$el.val(content || '').trigger('autosize.resize');
    },

    focus: function() {
      if (utils.isDesktop) return this.$el.focus();
      setTimeout(_.bind(this.$el.focus, this.$el), 500);
    },

    desktopFocus: function() {
      if (utils.isDesktop) this.focus();
    },

    blur: function() {
      this.$el.blur();
    },

    detect_l10n: function() {
      var content = this.app.doc.attributes.content
      for (var i=0;i<(utils.l10n_ranges.length);i++) {
          var item = utils.l10n_ranges[i]
          if (content.match(item['range']) != null) {
              this.prependFont(item['font'])
          }
      }
      return false;
    },

    prependFont: function (fontName) {
      var fontFamily = utils.getStyle(this.el,'font-family')
      if (fontFamily.match(fontName) == null) {
        this.el.style.fontFamily = fontName + ", " + fontFamily;
      }
    },

    events: {
      'keyup': 'updateOpenDoc'
    },

    updateOpenDoc: function(e) {
      if ( e.which === (utils.modKey.code) ) return this.trigger('modKey');
      this.app.doc.set( 'content', this.$el.val() );
    }

  });


  return EditorView;
});
