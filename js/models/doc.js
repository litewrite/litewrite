define(function(require) {

  var Backbone = require('backbone');
  var rsSync = require('utils/backbone.remoteStorage-documents');

  Doc = Backbone.Model.extend({

    defaults: {
      title: '',
      url: '',
      content: '',
      lastEdited: undefined
    },

    sync: rsSync,

    initialize: function() {
      this
        .on('change:content', this.updateLastEdited)
        .on('change:content', this.updateTitle);
    },

    isEmpty: function() {
      //Contenteditable never is really empty
      return this.get('content').match(/^(<\/{0,1}div>|<br>|\s|&nbsp;)*?$/) !== null;
    },

    updateLastEdited: function() {
        this.set('lastEdited', new Date().getTime());
    },

    updateTitle: function() {
      //Title consists of the first 40 charackters of the first not empty line
      var title = this.get('content')
        .match(/^(<div>|<\/div>|<br>|\s|&nbsp;)*([^<]{0,40}).*?(<div>|<\/div>|<br>|$)/)[2]
        .replace(/&nbsp;/gi,'');
      this.set('title', title);
    },

    getOpacity: function() {
      //Time passed since last this document was edited the last time in milliseconds
      var diff = (new Date().getTime() - this.get('lastEdited'));
      //The older the document the smaller the opacity
      //but the opacity is allway between 0.3 and 1
      //For documents older than 2 Weeks the opacity won't change anymore
      var limit = 14 * 86400000;
      var opacity = diff > limit ? 0.3 : Math.round( (0.3 + ((limit - diff) / limit) * 0.7) * 100 ) / 100;
      return opacity;
    }

  });


  return Doc;
});
