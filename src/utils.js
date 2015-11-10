var $ = require('jquery');
var _ = require('underscore');
var translations = require('./translations');

var utils = {};


utils.isMac = /Mac/.test(navigator.platform);


function setModes () {
  // keep in sync with value in litewrite.css
  utils.isMobile = matchMedia('(max-width:1024px)').matches;
  utils.isDesktop = !utils.isMobile;
}

$(window).on('resize', setModes);
setModes();


// for more info:
// http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
utils.escapeRegExp = function(str) { return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); };


utils.modKey = utils.isMac ? { name: 'ctrlKey', code: 17 } : { name: 'altKey', code: 18 };

// in seconds
var hour  = 3600;
var day   = 24 * hour;
var week  = 7 * day;
var month = 30.4 * day;
var year  = 365 * day;

var quantifiers = [
  { name: 'yy', time: year  },
  { name: 'MM', time: month },
  { name: 'dd', time: day   },
  { name: 'hh', time: hour  },
  { name: 'mm', time: 60    },
  { name: 'ss', time: 1     }
];

utils.timeAgo = function(date) {
  var diff = (Date.now() - date) / 1000; // in seconds

  var quantifier = _.find(quantifiers, function(q) {
    return diff >= q.time;
  });

  if (!quantifier) return;

  var count = Math.round(diff / quantifier.time);
  return translations.timeAgo(count, quantifier.name);
};

module.exports = utils;
