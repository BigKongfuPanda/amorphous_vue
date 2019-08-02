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

// 在自然时间的基础上加 8小时
// export function fixedTime(date) {
//   if (date != undefined) {
//     const timestamp = new Date(date).getTime() + 8 * 60 * 60 * 1000;
//     return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
//   }
// }