import moment from 'moment';

export default (number, format) => {
  if(!number) return '';
  var date = moment(number);
  return date.format(format);
};
