var $ = require('jquery')
var _ = require('underscore')
var translations = require('./translations')

var utils = {}

utils.isMac = /Mac/.test(navigator.platform)

function setModes () {
  // keep in sync with value in litewrite.css
  utils.isMobile = window.matchMedia('(max-width:1024px)').matches
  utils.isDesktop = !utils.isMobile
}

$(window).on('resize', setModes)
setModes()

// for more info:
// http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
utils.escapeRegExp = function (str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

utils.modKey = utils.isMac ? { name: 'ctrlKey', code: 17 } : { name: 'altKey', code: 18 }
utils.metaKey = utils.isMac ? 'metaKey' : 'ctrlKey'

// in seconds
var hour = 3600
var day = 24 * hour
var week = 7 * day
var month = 30.4 * day
var year = 365 * day

var quantifiers = [
  { name: 'yearsAgo', time: year },
  { name: 'monthsAgo', time: month },
  { name: 'weeksAgo', time: week },
  { name: 'daysAgo', time: day },
  { name: 'hoursAgo', time: hour },
  { name: 'minutesAgo', time: 60 },
  { name: 'secondsAgo', time: 1 }
]

utils.timeAgo = function (date) {
  var diff = (Date.now() - date) / 1000 // in seconds

  var quantifier = _.find(quantifiers, function (q) {
    return diff >= q.time
  })

  if (!quantifier) return

  var count = Math.round(diff / quantifier.time)
  return translations[quantifier.name](count)
}

utils.handleAppcacheUpdates = function () {
  var appcache = window.applicationCache
  if (!appcache) return
  appcache.addEventListener('updateready', function (e) {
    if (appcache.status !== appcache.UPDATEREADY) return
    if (!window.confirm(translations.updateCache)) return
    window.location.reload()
  }, false)
}

module.exports = utils
