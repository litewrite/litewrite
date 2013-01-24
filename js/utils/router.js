//Module is a Singelton
define(function(require) {

  var Backbone = require('backbone');
  var settings = require('models/settings');
  var cache = require('utils/cache');
  var docs = require('collections/docs');


  var Router = Backbone.Router.extend({
    routes: {
      '': 'openLastEdited',
      '!:url': 'openDoc'
    },

    openLastEdited: function() {
      this.navigate(cache.openDoc.get('url'), { trigger: true, replace: true });
    },

    openDoc: function(url) {
      var doc = docs.find(function(doc) {
        return doc.get('url') === url;
      }, this);
      if ( _.isUndefined(doc) ) {
        this.navigate('', { trigger: true, replace: true });
      } else {
        settings.set('openDocId', doc.id);
      }
    },

    setUrl: function() {
      this.navigate('!' + cache.openDoc.get('url'));
    }


  });

  return new Router();
});