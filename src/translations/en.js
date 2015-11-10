function plural(word, num) {
  var forms = word.split('_');
  return num  === 1 ? forms[0] : forms[1];
}

module.exports = {
  emptyDoc: 'Write …',
  search:   'Search …',
  footer:   'write lite, open source',
  share:    'share',
  open:     'open',
  modified: 'modified',
  welcome:  require('./welcome.txt'),
  timeAgo: function relativeTimeWithPlural(number, key) {
      var format = {
          'ss': 'second_seconds',
          'mm': 'minute_minutes',
          'hh': 'hour_hours',
          'dd': 'day_days',
          'MM': 'month_months',
          'yy': 'year_years'
      };
      if (number === 1) {
          return 'a ' + plural(format[key], +number) + ' ago';
      }
      else {
          return number + ' ' + plural(format[key], +number) + ' ago';
      }
  }
};
