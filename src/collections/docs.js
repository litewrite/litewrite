define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var Doc = require('models/doc');
  var remoteStorage = require('remotestorage');

  var remoteStorageDocuments = require('remotestorage-documents');
  var rsSync = require('rs-adapter');


  var Docs = Backbone.Collection.extend({

    model: Doc,

    sync: rsSync,

    initialize: function(models, options) {

      _.bindAll(this, 'fetch', 'sort', 'saveWhenIdle', 'ensureDoc', 'rsChange');

      this
        .on('change:lastEdited', this.sort)
        .on('change:lastEdited', this.saveWhenIdle);

      this.initRemotestorage();

    },

    addNew: function() {
      this.add({
        // TODO: remotestorage should create id
        id: Math.round( Math.random() * 10000000000000 ),
        lastEdited: new Date().getTime()
      });
    },

    // Sort by 'lastEdited'
    comparator: function(first, second) {
      return first.get('lastEdited') > second.get('lastEdited') ? -1 : 1 ;
    },

    // send updates at most once per second to remotestorage
    saveTimeout: undefined,
    saveWhenIdle: function(doc) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(doc.save, 1000);
    },

    // fetch from remotestorage at most all 300ms
    fetch: function() {
      return Backbone.Collection.prototype.fetch.call(this, {
        success: this.ensureDoc
      });
    },

    ensureDoc: function () {
      if (this.isEmpty()) this.addNew();
    },

    before: function(id) {
      return this.at( this.indexOf( this.get(id) ) - 1 );
    },

    after: function(id) {
      return this.at( this.indexOf( this.get(id) ) + 1 );
    },

    initRemotestorage: function() {
      var docs = this;

      var origHash = document.location.hash;

      remoteStorage.on('disconnect', function() {
        docs.reset().addNew();
      });

      remoteStorage.claimAccess('documents', 'rw');
      remoteStorage.documents.init();
      remoteStorage.displayWidget('remotestorage-connect');

      remoteStorageDocuments.onChange('notes', docs.rsChange);

      setTimeout(function() {
        var md = origHash.match(/access_token=([^&]+)/);
        if ( md && (! remoteStorage.getBearerToken()) ) {
          // backbone stole our access token
          remoteStorage.setBearerToken(md[1]);
        }
      }, 0);
    },

    events: [],

    rsChange: function (event) {
      this.events.push(event);
      this.handleEvents();
    },

    handleEvents: _.throttle(function() {
      _.each(this.events, function(event) {
        if (event.origin !== 'window') {
          if (event.oldValue && !event.newValue) return this.remove(event.oldValue);
          this.set(event.newValue, { remove: false });
        }
      }, this);
      this.events = [];
    }, 400, { leading: true, trailing: true })

  });


  return Docs;

});
