define(function(require) {

  var $ = require('jquery');
  var Backbone = require('backbone');
  var AppView = require('views/app');
  var docs = require('collections/docs');
  var cache = require('utils/cache');
  var settings = require('models/settings');
  var router = require('utils/router');


  function litewrite() {
    settings
      .on('change:openDocId', setOpenDoc)
      .on('change:openDocId', setWindowTitle)
      .on('change:openDocId', setUrl)
      .on('change:openDocId', docs.deleteEmpty, docs);

    docs
      .on('change:title', setUrl)
      .on('change:title', setWindowTitle)
      .on('add', updateOpenDocId);

    remoteStorage.onWidget('ready', fetch);

    remoteStorage.onWidget('state', function(state) {
      if (state === 'anonymous') {
        fetch();
      } else if(state == 'disconnected') {
        docs.reset().addNew();
      }
    });

    $.when(settings.deferred, docs.deferred)
      .done(loadCache);

    cache.loading.done(setWindowTitle, startHistory);

    remoteStorage.claimAccess('documents', 'rw').then(function() {
      remoteStorage.displayWidget('remotestorage-connect');
      remoteStorage.util.silenceAllLoggers();
    });

    //Load on DOM-ready
    $(function() {
      new AppView();
    });

  }

  function loadCache() {
    ensureOpenDocId();
    setOpenDoc();
    cache.loading.resolve();
  }

  function ensureOpenDocId() {
    if ( _.isUndefined(settings.get('openDocId')) ) {
      settings.save('openDocId', docs.first().id);
    }
  }

  function setOpenDoc() {
    cache.openDoc = docs.get( settings.get('openDocId') );
  }

  function setWindowTitle() {
    document.title = (
      cache.openDoc ? cache.openDoc.get('title') : null
    ) || 'Litewrite';
  }

  function updateOpenDocId(doc) {
    settings.save('openDocId', doc.id);
  }

  function startHistory() {
    Backbone.history.start();
  }

  function setUrl() {
    router.navigate(cache.openDoc.get('url'));
  }

  function fetch() {
    console.log('fetch triggered');
    docs.trigger('fetch');
    docs.fetch({
      success: function() {
        if (docs.isEmpty()) docs.addNew();
        docs.deferred.resolve();
      }
    });
  }


  return litewrite;
});
