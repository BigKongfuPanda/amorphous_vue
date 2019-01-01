import moment from 'moment';

export function dateFormat(date = new Date()) {
  return moment(date).format('YYYY-MM-DD');
}

export function dateTimeFormat(date = new Date()) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}