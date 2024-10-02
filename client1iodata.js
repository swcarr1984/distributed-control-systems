// Import device function from the clientDigital.js module
const digitalIO = require('./clientDigital.js');
// Import device class and functions from the clientAnalog.js module
const analogIO = require('./clientAnalog.js');
// Initialises any simulated IO values for below function (only for testing)
const initVar = (function () {
    count = 0;
    ioVar1 = 1;     // Used to initiate simulate Discrete values
    ioVar2 = 0;
    ioVar3 = 1;
    ioVar4 = 0;
    ioVar5 = 0;
    ioVar6 = 0;
    ioVar7 = 0;
    ioVar8 = 0;
    ioVar9 = 0;
    ioVar10 = 0;
    ioVar11 = 0;
    ioVar12 = 0;
    ioVar13 = 0;
    ioVar14 = 0;
    ioVar15 = 0;
    ioVar16 = 0;
    alarmFlag = false;      // Used as one-shot for alarm sending to database - Until resetAlarm() method called for aiDevice()
    transmitFlag = false;   // Used as above to send the ws data only once - passed through with the message data
    ai1Voltage = 1;     	// Used to initiate simulate Analog voltage 
    ai2Voltage = 1.2;     	// Used to initiate simulate Analog voltage 
    ai3Voltage = 3.5;     	// Used to initiate simulate Analog voltage 
    ai4Voltage = 2.6;     	// Used to initiate simulate Analog voltage 
    return function() { 
        return count, ioVar1, ioVar2, ioVar3, ioVar4, ioVar5, ioVar6, ioVar7, ioVar8, 
        ioVar9, ioVar10, ioVar11, ioVar12, ioVar13, ioVar14, ioVar15, ioVar16, 
        ai1Voltage, ai2Voltage, ai3Voltage, ai4Voltage }
})();

var aiDevice1, aiDevice2, aiDevice3, aiDevice4;

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
        ioVar1 = 1, ioVar2 = 0, ioVar3 = 1, ioVar4 = 1, ioVar5 = 1, ioVar6 = 0, ioVar7 = 1, ioVar8 = 1,
        ioVar9 = 1, ioVar10 = 0, ioVar11 = 1, ioVar12 = 1,ioVar13 = 1, ioVar14 = 0, ioVar15 = 1, ioVar16 = 1, 
        ai1Voltage = ai1Voltage + 0.00005, ai2Voltage = ai2Voltage + 0.00005, ai3Voltage = ai3Voltage + 0.00005, ai4Voltage = ai4Voltage + 0.00005; // Increases voltage for testing alarms each scan
    }
    else {
        count = 1;
        ioVar1 = 0, ioVar2 = 1, ioVar3 = 0, ioVar4 = 0, ioVar5 = 0, ioVar6 = 1, ioVar7 = 0, ioVar8 = 0, 
        ioVar9 = 0, ioVar10 = 1, ioVar11 = 0, ioVar12 = 0,ioVar13 = 0, ioVar14 = 1, ioVar15 = 0, ioVar16 = 0, 
        ai1Voltage = ai1Voltage + 0.00005, ai2Voltage = ai2Voltage + 0.00005, ai3Voltage = ai3Voltage + 0.00005, ai4Voltage = ai4Voltage + 0.00005; // Increases voltage for testing alarms each scan
        }
    //---------------------------------------------------------------------------------------//

    // Creates object instances of the discrete IO devices with their current measured values
    let ioData1 = new digitalIO.ioDevice('XI-1001', ioVar1);
    let ioData2 = new digitalIO.ioDevice('XI-1002', ioVar2);
    let ioData3 = new digitalIO.ioDevice('XI-1003', ioVar3);
    let ioData4 = new digitalIO.ioDevice('XI-1004', ioVar4);
    let ioData5 = new digitalIO.ioDevice('XI-1005', ioVar5);
    let ioData6 = new digitalIO.ioDevice('XI-1006', ioVar6);
    let ioData7 = new digitalIO.ioDevice('XI-1007', ioVar7);
    let ioData8 = new digitalIO.ioDevice('XI-1008', ioVar8);
    let ioData9 = new digitalIO.ioDevice('XI-1009', ioVar9);
    let ioData10 = new digitalIO.ioDevice('XI-1010', ioVar10);
    let ioData11 = new digitalIO.ioDevice('XI-1011', ioVar11);
    let ioData12 = new digitalIO.ioDevice('XI-1012', ioVar12);
    let ioData13 = new digitalIO.ioDevice('XI-1013', ioVar13);
    let ioData14 = new digitalIO.ioDevice('XI-1014', ioVar14);
    let ioData15 = new digitalIO.ioDevice('XI-1015', ioVar15);
    let ioData16 = new digitalIO.ioDevice('XI-1016', ioVar16);

    // Creates analog device (object) using class constructor
    aiDevice1 = new analogIO.aiDevice('PIT-210', ai1Voltage, 0, 2000, 'kpa', 800, 0, 0, 0, 4000, 0, 0, 0, 5, 0);
    aiDevice2 = new analogIO.aiDevice('PIT-460', ai2Voltage, 0, 300, 'kpa', 0, 0, 0, 0, 4000, 0, 0, 0, 5, 0);
    aiDevice3 = new analogIO.aiDevice('TIT-320', ai3Voltage, 0, 100, 'deg C', 0, 0, 0, 0, 0, 0, 0, 0, 5, 0);
    aiDevice4 = new analogIO.aiDevice('FIT-500', ai4Voltage, 0, 150, 'deg C', 0, 0, 0, 0, 0, 0, 0, 0, 5, 0);
    // Returns Scaled PV for sending to Database in above scan, scanAnalog not required here therefore
 
    // Create a new data map of the discrete and analog IO TAG and Values for database
    var ioDataMap = new Map();
    ioDataMap.set(ioData1.tag, ioData1.raw);
    ioDataMap.set(ioData2.tag, ioData2.raw);
    ioDataMap.set(ioData3.tag, ioData3.raw);
    ioDataMap.set(ioData4.tag, ioData4.raw);
    ioDataMap.set(ioData5.tag, ioData5.raw);
    ioDataMap.set(ioData6.tag, ioData6.raw);
    ioDataMap.set(ioData7.tag, ioData7.raw);
    ioDataMap.set(ioData8.tag, ioData8.raw);
    ioDataMap.set(ioData9.tag, ioData9.raw);
    ioDataMap.set(ioData10.tag, ioData10.raw);
    ioDataMap.set(ioData11.tag, ioData11.raw);
    ioDataMap.set(ioData12.tag, ioData12.raw);
    ioDataMap.set(ioData13.tag, ioData13.raw);
    ioDataMap.set(ioData14.tag, ioData14.raw);
    ioDataMap.set(ioData15.tag, ioData15.raw);
    ioDataMap.set(ioData16.tag, ioData16.raw);
    ioDataMap.set(aiDevice1.tag, aiDevice1.scaledPV.toFixed(1));
    ioDataMap.set(aiDevice2.tag, aiDevice2.scaledPV.toFixed(1));
    ioDataMap.set(aiDevice3.tag, aiDevice3.scaledPV.toFixed(1));
    ioDataMap.set(aiDevice4.tag, aiDevice4.scaledPV.toFixed(1));
    //console.log('ioData values are:', ioDataMap);

    // Section for checking alarm activation of device - Only 1 Analog Device being tested here currently
    var aiDev1param = aiDevice1.checkAlarms();
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
    aiDevice1
    
};
