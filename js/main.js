require.config( {
  deps: [
    'utils/log'
  ],
  paths: {
    text: 'lib/require.text',
    jquery: ['http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min', 'lib/jquery.min'],
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    localstorage: 'lib/backbone.localstorage',
    remotestorage: 'http://remotestoragejs.com/build/0.7.0-head/remoteStorage-debug',
    'remotestorage-documents': 'lib/remoteStorage-documents'
  },
  baseUrl: 'js'
});

require(['litewrite', 'utils/customizations'], function(litewrite) {
  litewrite();
});