define(function(require) {

  var Backbone = require('backbone');
  var EntriesView = require('views/entries');
  var EditorView = require('views/editor');
  var AsideView = require('views/aside');
  var SearchView = require('views/search');
  var utils = require('utils');


  var AppView = Backbone.View.extend({

    el: 'body',

    initialize: function(options) {

      this.app = options.app;

      this.editor = new EditorView({ app: this.app });
      this.entries = new EntriesView({ app: this.app, collection: this.collection });
      this.search = new SearchView({ model: this.app.state, collection: this.collection });
      this.aside = new AsideView({ app: this.app, collection: this.collection });


      this.collection.on('fetch', this.editor.render);

      this.search
        .on('focus', this.aside.show)
        .on('blur', this.aside.desktopHide);

      this.editor.on('modKey', this.aside.hide);

      this.entries.on('open', this.aside.toggle);

    },

    events: {
      'click #add': 'newDoc',
      'touchend #add': 'newDoc',
      'click #menu-button': 'toggleAside',
      'touchend #menu-button': 'toggleAside',
      'keydown': 'handleKey'
    },

    newDoc: function() {
      if (utils.isMobile) this.aside.toggle();
      if (! this.app.doc.isEmpty()) this.collection.addNew();
      this.editor.focus();
      return false;
    },

    toggleAside: function() {
      this.aside.toggle();
      return false;
    },

    // global key handler for shortcuts
    handleKey: function(e) {
      if (e.which === 9) { // tab
        e.preventDefault();
      } else if (e[utils.modKey.name]) {
        this.aside.show();
        if (e.which === 78) { // n
          this.newDoc(e);
        } else if (e.which === 38) { // up
          this.previous();
          return false;
        } else if (e.which === 40) { // down
          this.next();
          return false;
        } else if (e.which === 70) // f
          this.search.focus();
      }
    },

    previous: function() {
      var doc = this.collection.before(this.app.doc.id);
      if (doc) this.app.open(doc);
    },

    next: function() {
      var doc = this.collection.after(this.app.doc.id);
      if (doc) this.app.open(doc);
    }

  });


  return AppView;
});
