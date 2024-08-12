// Function for websocket connectivity 

// Import watchdog functions from the watchdog.js module
const wd = require('./watchdog.js');
// Import io write to DB function from database.js module
const sqlDB = require('./database.js');
// Import format IO write to DB function from serverFormatdata.js module
const format = require('./devices/serverFormatdata.js');
// Import time functions from the date.js module
const currentTime = require('./date.js');

//let commsTimer = wd.commsTimer;
var ws, wss;
// Assign the sql connection to a constant
const sqlConn = sqlDB.myDB();

var serverTime;
//let myMessage = null;

function wsServer(ws, wss) {
    
    wss.on('connection', function connection(ws, wss) {

        // Below code always executed when new connection established
        wd.serverWatchdogInitiate(ws); 
        console.info('New Client connected');
            
        // Listen for messages
        ws.addEventListener('message', function (e){msg(e)}) //('message', function (e) { //msg(e)});

        function msg(e) {
            let messageData = JSON.parse(e.data);

            // If msg data from client is type watchdog
            if (messageData.type === 'wdinit') {
                let clientID = messageData.clientID; 
                //*********** Watchdog Timer runs here ************//
                wd.serverCommsWatchdogTimeout(ws, clientID);
            }
            else if (messageData.type === 'wdrun') { 
                let clientID = messageData.clientID; 
                wd.serverCommsWatchdogRefresh(clientID);
                //console.log(clientID, 'WD Client message : ', messageData);
            }
            else if (messageData.type === 'io') { 
                //console.log('Client io data : ', messageData.data);
                //console.log('client data type is:',typeof messageData.data);
                let dateTimeGMT = currentTime.timeStamp();
                serverTime = JSON.stringify(dateTimeGMT[0]);//.toString();
                // Check which client and write to according mySQL table
                if (messageData.clientID === '1') {
                    let formattedData = format.formatIOdata(messageData.data);
                    //console.log('formatted data is:',formattedData);
                    //console.log('type of dattime is:', typeof messageData.time);
                    //console.log('formatted data is:',formattedData.keyArray);
                    sqlDB.ioToDB(sqlConn, 'client1iodata', formattedData.keyArray, formattedData.valueArray, serverTime, messageData.time);
                }
                else if (messageData.clientID === '2') {
                    let formattedData = format.formatIOdata(messageData.data);
                    //console.log('formatted data is:',formattedData);
                    sqlDB.ioToDB(sqlConn, 'client2iodata', formattedData.keyArray, formattedData.valueArray, serverTime, messageData.time);
                }
            }
            else {
                console.log('Client message : ', messageData);
            }    
        }
        
        ws.on('close', function(event) {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } else {
                console.log('[close] Connection died');
                }
            // connection closed, discard old websocket and create a new one in 5s
          
        });

        ws.on('error', function(event) {
            console.log('error with WS connection')
        });
    });
    
}

module.exports = {
    wsServer
};

