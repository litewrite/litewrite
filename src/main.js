require(['litewrite', 'router'], function(Litewrite, Router) {


  var litewrite = new Litewrite()
    .on('ready', startHistory);


  new Router({ app: litewrite });


  function startHistory() {
    Backbone.history.start();
  }


});
