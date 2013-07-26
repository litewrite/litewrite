define(function(require) {

  var Backbone = require('backbone');


  var Router = Backbone.Router.extend({

    initialize: function (options) {
      this.app = options.app;
    },

    routes: {
      // use ! for urls to not conflict with remotestorage's #access_token parameter
      '!:uri': 'open',
      '*404': 'lastEdited'
    },

    lastEdited: function() {
      this.go( '!' + this.app.doc.get('uri') );
    },

    open: function(uri) {
      var doc = this.app.docs.findWhere({ uri: uri });
      if (!doc) return this.lastEdited();
      this.app.open(doc);
    },

    go: function (url) {
      return this.navigate( url, { trigger: true, replace: true } );
    }

  });

  return Router;
});
