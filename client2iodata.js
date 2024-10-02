// Import device function from the clientDigital.js module
const digitalIO = require('./clientDigital.js');
// Import device class and functions from the clientAnalog.js module
const analogIO = require('./clientAnalog.js');
// Initialises any simulated IO values for below function (only for testing)
const initVar = (function () {
    count = 0;
    ioVar17 = 1;     // Used to initiate simulate Discrete values
    ioVar18 = 0;
    ioVar19 = 1;
    ioVar20 = 0;
    ioVar21 = 1;
    ioVar22 = 1;
    ioVar23 = 0;
    ioVar24 = 1;
    ioVar25 = 0;
    ioVar26 = 0;
    ioVar27 = 1;
    ioVar28 = 0;
    ioVar29 = 1;
    ioVar30 = 1;
    ioVar31 = 1;
    ioVar32 = 0;
    alarmFlag = false;      // Used as one-shot for alarm sending to database - Until resetAlarm() method called for aiDevice()
    transmitFlag = false;   // Used as above to send the ws data only once - passed through with the message data
    ai5Voltage = 1.6;     	// Used to initiate simulate Analog voltage 
    ai6Voltage = 1.02;     	// Used to initiate simulate Analog voltage 
    ai7Voltage = 1.01;     	// Used to initiate simulate Analog voltage 
    ai8Voltage = 1.07;     	// Used to initiate simulate Analog voltage 
    return function() { 
        return count, ioVar17, ioVar18, ioVar19, ioVar20, ioVar21, ioVar22, ioVar23, ioVar24, 
        ioVar25, ioVar26, ioVar27, ioVar28, ioVar29, ioVar30, ioVar31, ioVar32, 
        ai5Voltage, ai6Voltage, ai7Voltage, ai8Voltage }
})();

var aiDevice5, aiDevice6, aiDevice7, aiDevice8;

// Updates IO created in the above function for recording 'simulated' values in Database.
/* When runnning properly on units the internals of this function will pull the IO interface data
// to send and function is used within clientSocket.js */


/* Below function is for reading analog and discrete IO values and updating IO objects to be 
sent to Pi Five Server over Websocket function (exported to clientSocket.js) */
function updateIO() { 

    //----------------------------------- For Test Only -------------------------------------//
    /* Below if/else used top toggle values for testing back to database
       to be removed when running direct on Pi units */
    if (count == 1) {
        count = 0;
        ioVar17 = 1, ioVar18 = 0, ioVar19 = 1, ioVar20 = 1, ioVar21 = 1, ioVar22 = 0, ioVa23 = 1, ioVar24 = 1,
        ioVar25 = 1, ioVar26 = 0, ioVar27 = 1, ioVar28 = 1,ioVar29 = 1, ioVar30 = 0, ioVar31 = 1, ioVar32 = 1, 
        ai5Voltage = ai5Voltage + 0.000015, ai6Voltage = ai6Voltage + 0.000015, ai7Voltage = ai7Voltage + 0.000015, ai8Voltage = ai8Voltage + 0.000015; 
        // Increases voltage for testing alarms each scan
    }
    else {
        count = 1;
        ioVar17 = 0, ioVar18 = 1, ioVar19 = 0, ioVar20 = 0, ioVar21 = 0, ioVar22 = 1, ioVar23 = 0, ioVar24 = 0, 
        ioVar25 = 0, ioVar26 = 1, ioVar27 = 0, ioVar28 = 0,ioVar29 = 0, ioVar30 = 1, ioVar31 = 0, ioVar1632 = 0, 
        ai5Voltage = ai5Voltage + 0.000015, ai6Voltage = ai6Voltage + 0.000015, ai7Voltage = ai7Voltage + 0.000015, ai8Voltage = ai8Voltage + 0.000015; 
        // Increases voltage for testing alarms each scan
        }
    //---------------------------------------------------------------------------------------//

    // Creates object instances of the discrete IO devices with their current measured values
    let ioData17 = new digitalIO.ioDevice('XI-1017', ioVar17);
    let ioData18 = new digitalIO.ioDevice('XI-1018', ioVar18);
    let ioData19 = new digitalIO.ioDevice('XI-1019', ioVar19);
    let ioData20 = new digitalIO.ioDevice('XI-1020', ioVar20);
    let ioData21 = new digitalIO.ioDevice('XI-1021', ioVar21);
    let ioData22 = new digitalIO.ioDevice('XI-1022', ioVar22);
    let ioData23 = new digitalIO.ioDevice('XI-1023', ioVar23);
    let ioData24 = new digitalIO.ioDevice('XI-1024', ioVar24);
    let ioData25 = new digitalIO.ioDevice('XI-1025', ioVar25);
    let ioData26 = new digitalIO.ioDevice('XI-1026', ioVar26);
    let ioData27 = new digitalIO.ioDevice('XI-1027', ioVar27);
    let ioData28 = new digitalIO.ioDevice('XI-1028', ioVar28);
    let ioData29 = new digitalIO.ioDevice('XI-1029', ioVar29);
    let ioData30 = new digitalIO.ioDevice('XI-1030', ioVar30);
    let ioData31 = new digitalIO.ioDevice('XI-1031', ioVar31);
    let ioData32 = new digitalIO.ioDevice('XI-1032', ioVar32);

    // Creates analog device (object) using class constructor
    aiDevice5 = new analogIO.aiDevice('PIT-650', ai5Voltage, 0, 6000, 'pa', 5000, 0, 0, 0, 4000, 0, 0, 0, 5, 0);
    aiDevice6 = new analogIO.aiDevice('PIT-730', ai6Voltage, 0, 100, 'kpa', 0, 0, 0, 0, 0, 0, 0, 0, 5, 0);
    aiDevice7 = new analogIO.aiDevice('TIT-990', ai7Voltage, 0, 200, 'deg C', 0, 0, 0, 0, 0, 0, 0, 0, 5, 0);
    aiDevice8 = new analogIO.aiDevice('FIT-828', ai8Voltage, 0, 150, 'deg C', 0, 0, 0, 0, 0, 0, 0, 0, 5, 0);
    // Returns Scaled PV for sending to Database in above scan, scanAnalog not required here therefore
 
    // Create a new data map of the discrete and analog IO TAG and Values for database
    var ioDataMap = new Map();
    ioDataMap.set(ioData17.tag, ioData17.raw);
    ioDataMap.set(ioData18.tag, ioData18.raw);
    ioDataMap.set(ioData19.tag, ioData19.raw);
    ioDataMap.set(ioData20.tag, ioData20.raw);
    ioDataMap.set(ioData21.tag, ioData21.raw);
    ioDataMap.set(ioData22.tag, ioData22.raw);
    ioDataMap.set(ioData23.tag, ioData23.raw);
    ioDataMap.set(ioData24.tag, ioData24.raw);
    ioDataMap.set(ioData25.tag, ioData25.raw);
    ioDataMap.set(ioData26.tag, ioData26.raw);
    ioDataMap.set(ioData27.tag, ioData27.raw);
    ioDataMap.set(ioData28.tag, ioData28.raw);
    ioDataMap.set(ioData29.tag, ioData29.raw);
    ioDataMap.set(ioData30.tag, ioData30.raw);
    ioDataMap.set(ioData31.tag, ioData31.raw);
    ioDataMap.set(ioData32.tag, ioData32.raw);
    ioDataMap.set(aiDevice5.tag, aiDevice5.scaledPV.toFixed(1));
    ioDataMap.set(aiDevice6.tag, aiDevice6.scaledPV.toFixed(1));
    ioDataMap.set(aiDevice7.tag, aiDevice7.scaledPV.toFixed(1));
    ioDataMap.set(aiDevice8.tag, aiDevice8.scaledPV.toFixed(1));
    //console.log('ioData values are:', ioDataMap);

    // Section for checking alarm activation of device - Only 1 Analog Device being tested here currently
    var aiDev1param = aiDevice5.checkAlarms();
    // Below console output used for testing and visibility only
    console.log('Scaled PV is: ', aiDev1param[0].toFixed(0), ' | Alarm Flag is: ', aiDev1param[1], ' | Alarm Status is: ', aiDev1param[2], ' | Device Tag is: ', aiDev1param[3]);

    // Create Alarm data if alarmFlag generated in above alarmCheck() method call for each device 
    var alarmDataMap = new Map();
    if (aiDev1param[1] == 'true' && alarmFlag == false) {
        alarmDataMap.set(aiDevice1.tag, aiDev1param[2]);
        alarmFlag = true;
        transmitFlag = true;
    }
    else if (aiDev1param[1] == 'false' && alarmFlag == true) {
        // If aiDevice1.resetAlarm() method is called the aiDev1param[1] is set false and this will run resetting the logging to DB
        alarmFlag = false;
    }
    else {
        // creates transmit one-shot
        transmitFlag = false;
        // Logs nothing to Database until the alarm is reset
    }

    // Converts the created data map of analog and discrete tag/values to JSON for websocket transmit
    const obj1 = Object.fromEntries(ioDataMap);
    const myioData = JSON.stringify(obj1);
    // Converts the created data map of alarm tag/values to JSON for websocket transmit
    const obj2 = Object.fromEntries(alarmDataMap);
    const myAlarmData = JSON.stringify(obj2);
    const wsflag = JSON.stringify(transmitFlag);

    return([myioData, myAlarmData, wsflag]);
};

module.exports = {
    updateIO, // used within client/1/2.js
    
};
