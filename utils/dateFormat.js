const addDateSuffix = (date) => {
    let date_Str = date.toString();
  
    // get last char of date string
    const last_Char = date_Str.charAt(date_Str.length - 1);
  
    if (last_Char === '1' && date_Str !== '11') {
      date_Str = `${date_Str}st`;
    } else if (last_Char === '2' && date_Str !== '12') {
      date_Str = `${date_Str}nd`;
    } else if (last_Char === '3' && date_Str !== '13') {
      date_Str = `${date_Str}rd`;
    } else {
      date_Str = `${date_Str}th`;
    }
  
    return date_Str;
  };
  
  // function to format a timestamp, accepts the timestamp and an `options` object as parameters
  module.exports = (
    timestamp,
    { month_L = 'short', dateSuffix = true } = {}
  ) => {
    // create month object
    const months = {
      0: month_L === 'short' ? 'Jan' : 'January',
      1: month_L === 'short' ? 'Feb' : 'February',
      2: month_L === 'short' ? 'Mar' : 'March',
      3: month_L === 'short' ? 'Apr' : 'April',
      4: month_L === 'short' ? 'May' : 'May',
      5: month_L === 'short' ? 'Jun' : 'June',
      6: month_L === 'short' ? 'Jul' : 'July',
      7: month_L === 'short' ? 'Aug' : 'August',
      8: month_L === 'short' ? 'Sep' : 'September',
      9: month_L === 'short' ? 'Oct' : 'October',
      10: month_L === 'short' ? 'Nov' : 'November',
      11: month_L === 'short' ? 'Dec' : 'December',
    };
  
    const dateObj = new Date(timestamp);
    const formattedMonth = months[dateObj.getMonth()];
  
    const dayOfMonth = dateSuffix
      ? addDateSuffix(dateObj.getDate())
      : dateObj.getDate();
  
    const year = dateObj.getFullYear();
    let hour =
      dateObj.getHours() > 12
        ? Math.floor(dateObj.getHours() - 12)
        : dateObj.getHours();
  
    // if hour is 0 (12:00am), change it to 12
    if (hour === 0) {
      hour = 12;
    }
  
    const minute = (dateObj.getMinutes() < 10 ? '0' : '') + dateObj.getMinutes();
  
    // set `am` or `pm`
    const periodOfDay = dateObj.getHours() >= 12 ? 'pm' : 'am';
  
    const formattedTimeStamp = `${formattedMonth} ${dayOfMonth}, ${year} at ${hour}:${minute} ${periodOfDay}`;
  
    return formattedTimeStamp;
  };
  
