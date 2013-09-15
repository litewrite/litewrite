define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  var remoteStorageDocuments = require('remotestorage-documents');
  var remoteStorage = require('remotestorage');
  var template = require('text!templates/share.html');


  var ShareView = Backbone.View.extend({

    el: '#share',

    initialize: function(options) {

      _.bindAll(this, 'setLink', 'updatePublic', 'show', 'hide');

      this.remote = remoteStorageDocuments.publicList('notes');

      this.template = _.template(template);

      this.$button = this.$('button');

      this.model.on('change:public', this.setLink);
      this.collection.on('sync', this.updatePublic);
      options.app.on('connected', this.show);
      options.app.on('disconnected', this.hide);

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
      var html = this.renderDocument(this.model);
      this.remote.addRaw('text/html', html).then(_.bind(function(url) {
        remoteStorage.sync().then(_.bind(function() {
          this.model.set('public', url);
        }, this));
      }, this));
    },

    setLink: function() {
      var link = this.model.get('public');
      if (!link) return this.$button.text('share');
      this.$el.attr('href', this.model.get('public'));
      this.$button.text('open');
    },

    updatePublic: function(doc) {
      if (!doc.get('public')) return;
      var id = doc.get('public').match(/.+\/(.+?)$/)[1];
      var html = this.renderDocument(doc);
      this.remote.setRaw(id, 'text/html', html);
    },

    renderDocument: function(doc) {
      var data = doc.toJSON();
      data.date = new Date(data.lastEdited).toDateString();
      return this.template(data);
    },

    show: function() {
      this.$el.removeClass('share-hide');
    },

    hide: function() {
      this.$el.addClass('share-hide');
    }

  });


  return ShareView;
});
