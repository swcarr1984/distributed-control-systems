// Date module created 14/06/2024 at 2000hrs / Modified 15/06/2024 at 1930hrs.

function timeStamp() {

    let d = new Date();                     // Grabs a new date instance from node date module
    let m = d.getMilliseconds();            // Takes a separate millisecond value (not in first call)
    let milli = m.toString();               // Converts to string
    let addMilli = (':' + milli +' ')       // Creates a string formatted with ms to add to date string
    let myTime = d.toString();              // Converts to string
    let splitTime = myTime.split(' (');     // Removes the (AWST)
    let section1 = splitTime[0].length;     // Adds millisecs and returns separate time and GMT offset as below
    let newDate = splitTime[0].slice(0,(section1-9)) + addMilli + splitTime[0].slice((section1-8),section1);
    let finalDate = newDate.slice(0,(newDate.length-9));
    let GMT = newDate.slice((newDate.length-8),newDate.length)
    
    return [finalDate,GMT];
}

module.exports = {
    timeStamp
  };

