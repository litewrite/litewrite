define(function(require) {

  var Backbone = require('backbone');
  var Store = require('localstorage');


  var State = Backbone.Model.extend({

    defaults: {
      id: 0,
      openDocId: undefined,
      query: ''
    },

    localStorage: new Store('litewriteState')

  });


  return State;
});
