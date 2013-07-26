require.config( {
  deps: [
    '../lib/matchMedia',
    'main'
  ],
  paths: {
    text: '../lib/require.text',
    jquery: '../lib/jquery.min',
    underscore: '../lib/underscore',
    backbone: '../lib/backbone',
    localstorage: '../lib/backbone.localstorage',
    remotestorage: '../lib/remotestorage',
    'remotestorage-documents': '../lib/remotestorage-documents',
    'rs-adapter': '../lib/backbone.remoteStorage-documents'
  },
  baseUrl: 'src',
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});
