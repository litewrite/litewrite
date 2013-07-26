define(function(require) {

  var $ = require('jquery');



  var utils = {};


  utils.isMac = /Mac/.test(navigator.platform);


  function setModes () {
    utils.isMobile = matchMedia('(max-width:720px)').matches;
    utils.isDesktop = !utils.isMobile;
  }

  $(window).on('resize', setModes);
  setModes();


  // for more info:
  // http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
  utils.escapeRegExp = function(str) { return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); };


  utils.modKey = utils.isMac ? { name: 'ctrlKey', code: 17 } : { name: 'altKey', code: 18 };



  return utils;
});
