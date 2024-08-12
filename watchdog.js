//----------- Section used for watchdog function definitions -----------//

// Import time functions from the date.js module
const currentTime = require('./date.js');

////////////////// System watchdog set for 1 second timeout //////////////
// Global var for functions and exports
let watchdogTimer;
let commsTimer = [];
var clientID;

function sysWatchdog() {
    watchdogTimer = setTimeout(() => {
    console.error('System Watchdog timer elapsed, Runtime error');
    process.exit(1);
  }, 1000);
}

function sysWatchdogRefresh() {
    setInterval(() => {
    //console.log('System Watchdog OK');  // method to check if watchdog reset running in terminal
    clearTimeout(watchdogTimer);
    }, 500);
}

////////////////////////////// Comms watchdog /////////////////////////////

// First message sent to clients upon connection to start watchdog comms (passes the socket so it can use send function etc)
function serverWatchdogInitiate(socket) {
    let startMsg = JSON.stringify({type: 'wd', ID: 'server'});
    console.log('Server comms watchdog initiated with new connected client');
    socket.send(startMsg);
}

// If 5000ms elapses without an update then ws.terminate, reoccuring interval timer
function serverCommsWatchdogTimeout(socket, clientID) { 
    console.log('Client', clientID, 'timeout started');
    let clientName = clientID.toString(); 
    let ID = Number(clientID);
    console.log('Client name is:', clientName);
    commsTimer[ID] = setInterval(() => {
        //commsTimer = setInterval(() => {
        console.error(clientName, 'Comms Watchdog Timer Elapsed, Comms Error');
        socket.terminate();
        // ws.connect again
    }, 6000)};

// Stops the watchdog interval timer and starts again 
function serverCommsWatchdogRefresh(clientID) {
    let clientName = clientID.toString();
    let ID = Number(clientID);
    let dateTimeGMT = currentTime.timeStamp();
    dateTime = dateTimeGMT[0].toString();
    console.log(clientName, 'Comms Watchdog reset at time: ', dateTime);  // method to check if watchdog reset running in terminal
    clearInterval(commsTimer[ID]);
    //clearInterval(commsTimer);
    //serverCommsWatchdogTimeout(socket, clientID);
};

// Sends a numerical index '1' every 4000mS to the server.
// If no new values comms have issue so allow timeout to close connection
function clientCommsWatchdogUpdate(WDflag, socket, clientNumber) {
    if (WDflag == true) {
        let sendMsg = JSON.stringify({ type: 'wdrun', clientID:clientNumber});
        let dateTimeGMT = currentTime.timeStamp();
        dateTime = dateTimeGMT[0].toString();
        console.log('Client',clientNumber, 'Sending WD reset back to Server at time:', dateTime);
        socket.send(sendMsg);
    }
    else {
        console.log('WD not running');
    }
}; 

//function serverCommsWatchdogSend(sentValue, lastValue, socket, dateTime) { setInterval(() => serverCommsWatchdogUpdate(sentValue, lastValue, socket, dateTime), 4000)};     // returns new values to client instantly
function clientCommsWatchdogSend(WDflag, socket, clientNumber) { setInterval(() => clientCommsWatchdogUpdate(WDflag, socket, clientNumber), 4000)};    // Polls for new data every 500mS and returns to server

module.exports = {
    watchdogTimer,
    commsTimer,
    sysWatchdog,
    sysWatchdogRefresh, 
    serverWatchdogInitiate,
    serverCommsWatchdogTimeout,
    serverCommsWatchdogRefresh,
    clientCommsWatchdogUpdate,
    clientCommsWatchdogSend
  };