require.config( {
  deps: [
    'libs/matchMedia'
  ],
  paths: {
    text: 'libs/require.text',
    jquery: ['http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min', 'libs/jquery.min'],
    underscore: 'libs/underscore',
    backbone: 'libs/backbone',
    localstorage: 'libs/backbone.localstorage',
    remotestorage: [/*'http://remotestoragejs.com/build/0.7.0-head/remoteStorage', */'libs/remoteStorage'],
    'remotestorage-documents': 'libs/remoteStorage-documents'
  },
  baseUrl: 'js'
});

require(['litewrite', 'utils/customizations', 'libs/fastclick'], function(litewrite) {
  litewrite();
});
