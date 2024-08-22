// Import device function from the clientDigital.js module
const digitalIO = require('./clientDigital.js');

// Initialises any simulated IO values for below function (only for testing)
const initVar = (function () {
    count = 0;
    ioVar5 = 1;
    ioVar6 = 0;
    ioVar7 = 1;
    ioVar8 = 0;
    return function() { 
        return count, ioVar5, ioVar6, ioVar7, ioVar8 }
})();

// Updates IO created in the above function for recording 'simulated' values in Database.
/* When runnning properly on units the internals of this function will pull the IO interface data
// to send and function is used within clientSocket.js */

function updateIO() { 

    /* Below if/else used top toggle values for testing back to database
       to be removed when running direct on Pi units */
    if (count == 1) {
        count = 0;
        ioVar5 = 1, ioVar6 = 0, ioVar7 = 1, ioVar8 = 1;
    }
    else {
        count = 1;
        ioVar5 = 0, ioVar6 = 1, ioVar7 = 0, ioVar8 = 0;
    }

    // Creates object instances of the IO devices with their current measured values
    let ioData5 = new digitalIO.ioDevice('XI-1005',ioVar5);
    let ioData6 = new digitalIO.ioDevice('XI-1006',ioVar6);
    let ioData7 = new digitalIO.ioDevice('XI-1007',ioVar7);
    let ioData8 = new digitalIO.ioDevice('XI-1008',ioVar8);
 
    // Create a new data map of the same IO with values for database
    ioDataMap = new Map();
    ioDataMap.set(ioData5.tag,ioData5.raw);
    ioDataMap.set(ioData6.tag,ioData6.raw);
    ioDataMap.set(ioData7.tag,ioData7.raw);
    ioDataMap.set(ioData8.tag,ioData8.raw);
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
