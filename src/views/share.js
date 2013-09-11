define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var remoteStorageDocuments = require('remotestorage-documents');
  var remoteStorage = require('remotestorage');


  var ShareView = Backbone.View.extend({

    el: '#share',

    initialize: function() {
      _.bindAll(this, 'setLink');
      this.remote = remoteStorageDocuments.publicList('notes');
      this.model.on('change:public', this.setLink);
      this.$button = this.$('button');
    },

    events: {
      'click': 'openOrShare'
    },

    openOrShare: function(e) {
      if (this.model.get('public')) return;
      e.preventDefault();

      this.share();
    },

    share: function() {
      var content = this.model.get('content');
      this.remote.addRaw('text/html', content).then(_.bind(function(path) {
        remoteStorage.sync().then(_.bind(function() {
          var url = this.remote.getItemURL(path);
          this.model.set('public', url);
        }, this));
      }, this));
    },

    setLink: function() {
      var link = this.model.get('public');
      if (!link) return this.$button.text('share');
      this.$el.attr('href', this.model.get('public'));
      this.$button.text('open');
    }

  });


  return ShareView;
});
