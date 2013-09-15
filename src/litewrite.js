define(function(require) {

  var $ = require('jquery');
  var _ = require('underscore');
  var Backbone = require('backbone');
  var remoteStorage = require('remotestorage');
  var AppView = require('views/app');
  var Doc = require('models/doc');
  var Docs = require('collections/docs');
  var State = require('models/state');
  var utils = require('utils');


  function Litewrite() { this.initialize(); }


  _.extend(Litewrite.prototype, Backbone.Events, {

    initialize: function() {

      _.bindAll(this, 'loadDoc', 'open', 'debouncedOpen', 'updateDoc', 'handlePrevious', 'updateDocs', 'triggerConnected', 'triggerDisconnected');

      this.state = new State();
      this.doc = new Doc();
      this.docs = new Docs();

      this.doc
        .on('change:content', this.doc.updateLastEdited)
        .on('change:public', this.doc.updateLastEdited)
        .on('change:content', this.doc.updateTitle)
        .on('change:id', this.handlePrevious)
        .on('change:title', this.setWindowTitle)
        .on('change:title', this.setUrl)
        .on('change', this.updateDocs);

      this.state.fetch().always(_.bind(function() {
        this.docs.fetch().always(this.loadDoc);
      }, this));

      new AppView({ app: this, collection: this.docs });

      // make remoteStorage globally accessible even if we use amd.
      // this is helpful for debugging
      window.remoteStorage = remoteStorage;

      remoteStorage.displayWidget('remotestorage-connect');

      remoteStorage.on('ready', this.triggerConnected);
      remoteStorage.on('disconnected', this.triggerDisconnected);

    },

    loadDoc: function() {

      this.docs
        .on('add', this.debouncedOpen)
        .on('change', this.updateDoc);

      this.trigger('ready');

    },

    // open a document. either pass a Doc or an id
    open: function(doc) {
      if ( !_.isObject(doc) ) doc = this.docs.get(doc) || this.docs.first();
      this.doc.set( doc.toJSON() );
    },

    debouncedOpen: _.debounce(function(doc) {
      this.open(doc);
    }, 400, true),

    updateDoc: _.debounce(function() {
      this.doc.trigger('update');
    }, 5000),

    // remove empty documents
    handlePrevious: function(doc) {
      var previous = this.docs.get( doc.previous('id') );
      if ( previous && previous.isEmpty() ) previous.destroy();
    },

    updateDocs: function(doc) {
      this.docs.set( doc.toJSON(), { add: false, remove: false } );
    },

    triggerConnected: function() {
      this.trigger('connected');
    },

    triggerDisconnected: function() {
      this.trigger('disconnected');
    },

    setWindowTitle: function(doc) {
      document.title = doc.get('title') || 'Litewrite';
    },

    setUrl: function(doc) {
      Backbone.history.navigate(doc.getUrl());
    }

  });



  return Litewrite;

});
