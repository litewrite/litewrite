define(function(require) {

  var Backbone = require('backbone');
  var AppView = require('views/app');
  var docs = require('collections/docs');
  var cache = require('utils/cache');
  var settings = require('models/settings');
  var router = require('utils/router');


  function litewrite() {
    if ( _.isUndefined(settings.get('openDocId')) ) {
      settings.save('openDocId', docs.first().id);
    }


    remoteStorage.displayWidget('remotestorage-connect')

    setOpenDoc();
    setWindowTitle();

    settings
      .on('change:openDocId', setOpenDoc)
      .on('change:openDocId', setWindowTitle)
      .on('change:openDocId', setUrl)
      .on('change:openDocId', docs.deleteEmpty, docs);

    docs
      .on('change:title', setUrl)
      .on('change:title', setWindowTitle)
      .on('add', function(doc) {
        settings.save('openDocId', doc.id);
      });


    //Load on DOM-ready
    $(function() {
      new AppView();
      Backbone.history.start();
      setUrl();
    });

  }


  function setOpenDoc() {
    cache.openDoc = docs.get( settings.get('openDocId') );
  }

  function setWindowTitle() {
    document.title = (
      cache.openDoc ? cache.openDoc.get('title') : null
    ) || 'Litewrite';
  }

  function setUrl() {
    router.navigate(cache.openDoc.get('url'));
  }


  return litewrite;
});
