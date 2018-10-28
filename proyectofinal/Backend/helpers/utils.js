exports.getComienzoDia = function (date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

exports.fechaFromString = function (date) {
    return new Date(new Date(date).getTime() + new Date().getTimezoneOffset() * 60 * 1000);
};

exports.dateToUTC = function (date) {
    return new Date(date.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
};

exports.fechaToLocalISOString = function (date) {
    try {

   
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    };
    return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
      'Z';
    } catch (e) {
        logger.log('error', e, { error: err });
    }
};



