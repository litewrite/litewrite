module.exports = {
  emptyDoc: 'Write …',
  search: 'Search …',
  footer: 'write lite, open source',
  share: 'share',
  open: 'open',
  modified: 'modified',
  updateCache: 'A new version of Litewrite is available. Load it?',
  welcome: require('./welcome.txt'),
  secondsAgo: function (x) {
    if (x === 1) return 'a second ago'
    return x + ' seconds ago'
  },
  minutesAgo: function (x) {
    if (x === 1) return 'a minute ago'
    return x + ' minutes ago'
  },
  hoursAgo: function (x) {
    if (x === 1) return 'an hour ago'
    return x + ' hours ago'
  },
  daysAgo: function (x) {
    if (x === 1) return 'a day ago'
    return x + ' days ago'
  },
  weeksAgo: function (x) {
    if (x === 1) return 'a week ago'
    return x + ' weeks ago'
  },
  monthsAgo: function (x) {
    if (x === 1) return 'a month ago'
    return x + ' months ago'
  },
  yearsAgo: function (x) {
    if (x === 1) return 'a year ago'
    return x + ' years ago'
  }
}
