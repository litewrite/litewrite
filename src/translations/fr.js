function plural(word, num) {
  var forms = word.split('_');
  return num  === 1 ? forms[0] : forms[1];
}

module.exports = {
  emptyDoc: 'Écrire …',
  search:   'Rechercher …',
  footer:   'Ecrivez léger, écrivez libre !',
  share:    'partager',
  open:     'ouvrir',
  modified: 'dernière modification',
  welcome:  require('./welcome-fr.txt'),
  timeAgo: function relativeTimeWithPlural(number, key) {
      var format = {
          'ss': 'une seconde_secondes',
          'mm': 'une minute_minutes',
          'hh': 'une heure_heures',
          'dd': 'un jour_jours',
          'MM': 'un mois_mois',
          'yy': 'un an_ans'
      };
      if (number === 1) {
          return 'il y a ' + plural(format[key], +number);
      }
      else {
          return 'il y a ' + number + ' ' + plural(format[key], +number);
      }
  }
};
