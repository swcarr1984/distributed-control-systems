// Function for websocket connectivity 

// Import watchdog functions from the watchdog.js module
const wd = require('./watchdog.js');
// Import io write to DB function from database.js module
const sqlDB = require('./database.js');
// Import format IO write to DB function from serverFormatdata.js module
const format = require('./devices/serverFormatdata.js');
// Import time functions from the date.js module
const currentTime = require('./date.js');

var wss;
var serverTime;

function wsServer(wss) {
    
    wss.on('connection', function connection(wss) {

        // Below code always executed when new connection established
        wd.serverWatchdogInitiate(wss); 
        console.info('New Client connected');
            
        // Listen for messages
        wss.addEventListener('message', function (e){msg(e)}) //('message', function (e) { //msg(e)});

        function msg(e) {
            let messageData = JSON.parse(e.data);

            // If msg data type is for Watchdog Intitiate
            if (messageData.type === 'wdinit') {
                let clientID = messageData.clientID; 
                //*********** Watchdog Timer runs here ************//
                wd.serverCommsWatchdogTimeout(wss, clientID);
            }
            // If msg data type is for Watchdog Run
            else if (messageData.type === 'wdrun') { 
                let clientID = messageData.clientID; 
                wd.serverCommsWatchdogRefresh(clientID);
                //console.log(clientID, 'WD Client message : ', messageData);
            }
            // If msg data type is for Input / Output Logging
            else if (messageData.type === 'io') { 
                // Log the local server time to allow for latency checks etc
                let dateTimeGMT = currentTime.timeStamp();
                serverTime = JSON.stringify(dateTimeGMT[0]);//.toString();
                let formattedData = format.formatDBdata(messageData.data);
                // Check which client and write to according mySQL table
                if (messageData.clientID === '1') {
                    //let formattedData = format.formatDBdata(messageData.data);
                    sqlDB.ioToDB('client1iodata', formattedData.keyArray, formattedData.valueArray, serverTime, messageData.time);
                }
                else if (messageData.clientID === '2') {
                    //let formattedData = format.formatDBdata(messageData.data);
                    sqlDB.ioToDB('client2iodata', formattedData.keyArray, formattedData.valueArray, serverTime, messageData.time);
                }
            }
            // If msg data type is for Alarm Management
            else if (messageData.type === 'alarm') { 
                let formattedData = format.formatDBdata(messageData.data);
                sqlDB.alarmToDB('alarmdata', formattedData.keyArray, formattedData.valueArray, messageData.time, messageData.clientID);
            }
            // If msg data type is for System Information Logging
            else if (messageData.type === 'sys') { 
                let clientID = messageData.clientID; 
                let formattedData = format.formatDBdata(messageData.data);

                if (messageData.clientID === '1') {
                    console.log(clientID, 'Client system message : ', messageData);
                    sqlDB.sysInfoToDB ('client1sysdata', formattedData.keyArray, formattedData.valueArray, messageData.time);
                }
                else if (messageData.clientID === '2') {
                    console.log(clientID, 'Client system message : ', messageData);
                    sqlDB.sysInfoToDB ('client2sysdata', formattedData.keyArray, formattedData.valueArray, messageData.time);
                }  
            }
            // If msg data type is for any other non-specified types
            else {
                console.log('Client message : ', messageData);
            }    
        }
        
        wss.on('close', function(event) {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } else {
                console.log('[close] Connection died');
                }
            // connection closed, discard old websocket and create a new one in 5s
          
        });

        wss.on('error', function(event) {
            console.log('error with WS connection')
            // can add error logs to DB if reqd
        });
    });
    
}

module.exports = {
    wsServer
};

