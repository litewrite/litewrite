function plural(word, num) {
  var forms = word.split('_');
  return num  === 1 ? forms[0] : forms[1];
}

module.exports = {
  emptyDoc: 'Schreibe etwas …',
  search:   'Suchen …',
  footer:   'write lite, open source',
  share:    'teilen',
  open:     'öffnen',
  modified: 'zuletzt bearbeitet',
  welcome:  require('./welcome-de.txt'),
  timeAgo: function relativeTimeWithPlural(number, key) {
      var format = {
          'ss': 'einer Sekunde_Sekunden',
          'mm': 'einer Minute_Minuten',
          'hh': 'einer Stunde_Stunden',
          'dd': 'einer Tag_Tagen',
          'MM': 'einer Monat_Monaten',
          'yy': 'einer Jahr_Jahren'
      };
      if (number === 1) {
          return 'vor ' + plural(format[key], +number);
      }
      else {
          return 'vor ' + number + ' ' + plural(format[key], +number);
      }
  }
};
