// Import device function from the clientDigital.js module
const digitalIO = require('./clientDigital.js');

// Initialises any simulated IO values for below function (only for testing)
const initVar = (function () {
    count = 0;
    ioVar1 = 1;
    ioVar2 = 0;
    ioVar3 = 1;
    ioVar4 = 0;
    return function() { 
        return count, ioVar1, ioVar2, ioVar3, ioVar4 }
})();

// Updates IO created in the above function for recording 'simulated' values in Database.
/* When runnning properly on units the internals of this function will pull the IO interface data
// to send and function is used within clientSocket.js */

/* Below function is for reading analog and discrete IO values and updating IO objects to be 
sent to Pi Five Server over Websocket function (exported to clientSocket.js) */
function updateIO() { 

    /* Below if/else used top toggle values for testing back to database
       to be removed when running direct on Pi units */
    if (count == 1) {
        count = 0;
        ioVar1 = 1, ioVar2 = 0, ioVar3 = 1, ioVar4 = 1;
    }
    else {
        count = 1;
        ioVar1 = 0, ioVar2 = 1, ioVar3 = 0, ioVar4 = 0;
    }

    // Creates object instances of the IO devices with their current measured values
    let ioData1 = new digitalIO.ioDevice('XI-1001',ioVar1);
    let ioData2 = new digitalIO.ioDevice('XI-1002',ioVar2);
    let ioData3 = new digitalIO.ioDevice('XI-1003',ioVar3);
    let ioData4 = new digitalIO.ioDevice('XI-1004',ioVar4);
 
    // Create a new data map of the same IO with values for database
    ioDataMap = new Map();
    ioDataMap.set(ioData1.tag,ioData1.raw);
    ioDataMap.set(ioData2.tag,ioData2.raw);
    ioDataMap.set(ioData3.tag,ioData3.raw);
    ioDataMap.set(ioData4.tag,ioData4.raw);
    //console.log('ioData values are:', ioDataMap);
    
    // Converts the created map to JSON for websocket transmit
    const obj = Object.fromEntries(ioDataMap);
    const myioData = JSON.stringify(obj);
    //console.log('ioData is:',myioData);
    return(myioData);
};

module.exports = {
    updateIO // used within clientSocket.js
};
