function plural(word, num) {
  var forms = word.split('_');
  return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
}
    
module.exports = {
  emptyDoc: 'Пишите …',
  search:   'Искать …',
  footer:   'Пишите с легкостью! Исходный код открыт.',
  share:    'Поделиться',
  open:     'открыть',
  modified: 'изменён',
  welcome:  require('./welcome-ru.txt'),
  timeAgo: function (number, key) {
      var format = {
          'ss': 'секунду_секунды_секунд',
          'mm': 'минуту_минуты_минут',
          'hh': 'час_часа_часов',
          'dd': 'день_дня_дней',
          'MM': 'месяц_месяца_месяцев',
          'yy': 'год_года_лет'
      };
      if (number === 1) {
          return plural(format[key], +number) + ' назад';
      }
      else {
          return number + ' ' + plural(format[key], +number) + ' назад';
      }
  }
};
