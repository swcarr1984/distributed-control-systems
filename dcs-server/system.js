
// Import time functions from the date.js module
const currentTime = require('./date.js');
// Import system information monitor
const os = require('os');
// Allocating process module 
const process = require('process');
//------------------------------------------------------------------------------------------------

// Can be used to display system info for the running instance on console etc.
// Runs at startup of each client
function displaySystemInfo() {  
    console.log("This is a: " + os.platform() + " system");
    let freeMemory = os.freemem() / 1024 / 1024; // 1024/1024 converts to MB
    console.log("Available free memory:", freeMemory.toFixed(2), "MB");
    // Calling process.cpuUsage() method 
    let usage = process.cpuUsage(); 
    // Printing returned value 
    console.log('CPU usage is:', usage.user, usage.system);
}
//-------------------------------------------------------------------------------------------------

// Creates system info map for server.js to use directly and also to be passed into below 'sysInfo' client wbesocket send function 
function createsysMap (){
    // System values generated below
    let freeMemory = os.freemem() / 1024 / 1024; // 1024/1024 converts to MB
    freeMemory = freeMemory.toFixed(2);
    let usage = process.cpuUsage(); 
    let userUsage = usage.user;
    let sysUsage = usage.system;

    sysInfoDataMap = new Map();
    sysInfoDataMap.set('free memory',freeMemory);
    sysInfoDataMap.set('cpu user usage',userUsage);
    sysInfoDataMap.set('cpu system usage',sysUsage);
    
    // Converts the created map to JSON for websocket transmit and DB write
    const obj = Object.fromEntries(sysInfoDataMap);
    const mysysInfo = JSON.stringify(obj);
    return(mysysInfo);
};

// Used to send system info to mysql DB for logging
function sysInfo (clientID, socket, createsysMap){
    // Assigns sys info returned by 'createsysMap above to var
    var sysMap = createsysMap();
    console.log('system info is:',sysMap);
    // Add timestamp data
    let dateTimeGMT = currentTime.timeStamp();
    dateTime = dateTimeGMT[0].toString();
    // The data read and returned by the above is then sent using WS to Server
    if (socket.bufferedAmount == 0) {
        socket.send(JSON.stringify({type: 'sys', clientID: clientID, time: dateTime, data: sysMap}), function () {
        });
    } else {
        console.log('Websockets buffer full');
    }
};

// The below generic function calls the above at the set interval (This is exported to clientSocket.js)
function sendSystemData(clientID, socket, createsysMap) { setInterval(() => sysInfo(clientID, socket, createsysMap), 10000)};

module.exports = {
    displaySystemInfo,  // exported to client1/2.js
    createsysMap,       // exported to clientSocket.js & server.js 
    sendSystemData      // exported to clientSocket.js
  };
