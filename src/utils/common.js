import moment from 'moment';

export function dateFormat(date = new Date()) {
  return moment(date).format('YYYY-MM-DD');
}

export function dateTimeFormat(date = new Date()) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

export function debounce(fn, delay = 1000) {
  let timer = null;
  return function() {
    const args = Array.prototype.slice.call(arguments);
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
}