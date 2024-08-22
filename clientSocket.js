// Function for websocket connectivity 

// Import watchdog functions from the watchdog.js module
const wd = require('./watchdog.js');
// Import sendData function from the clientSendData.js module
const clientData = require('./devices/clientSendData.js');
// Import system Information
const sysInfo = require('./system.js');

// Globally scoped variable definitions 
var WDflag;

// Below code triggers flag for watchdog after first server initialise command.
if (WDInit = false) {
    WDflag = false;
}
else if (WDinit = true) {
    WDflag = true;
}

// Main WebSocket Server for export to clients to use within individual applications.

try {
    // If Server side is running the below can be executed
    function wsServer(socket, clientNumber, dataFunction) {
    
        // Connection opened event listener
        socket.addEventListener('open', function (event) {
            // Monitor the node app execution time overall and output to console
            console.log(clientNumber, 'connected to Pi Five WS Server');
            
            // Interval terminal comms to display system and operating values every 10 seconds
            const id = setInterval(function () {
                socket.send(JSON.stringify(process.memoryUsage()), function () {
                });
            }, 10000);      
        });
        
        // Error event listener
        socket.addEventListener('error', console.log("Websockets error has occured"));
    
        // Listen for messages
        socket.addEventListener('message', function (e){msg(e)});
    
        // Function handler for message events within Socket operations
        function msg(e) {
            let messageData = JSON.parse(e.data);
    
            if(messageData.type === 'wd' && messageData.ID === 'server') {
    
                // Watchdog Intialisation step - Send back the clientNumber to Server to create new watchdog timeout
                socket.send(JSON.stringify({type: 'wdinit', clientID: clientNumber}));
                console.log('Message sent from: ', messageData.ID)
                // Initiate Watchdog flag which sets watchdog within clientCommsWatchdogSend to TRUE (DECLARED AT TOP OF PAGE)
                WDinit = true;
            }
            // Display any other message data apart from watchdog messages
            else {
                console.log('Server message : ', messageData);
            }    
        } 
        
        // Watchdog periodic reset function, sends reset to Server once intitiated above by Server
        wd.clientCommsWatchdogSend(WDflag, socket, clientNumber);
        clientData.sendData(clientNumber, socket, dataFunction);

        // System data periodically sent to pi Five DB for data logging
        sysInfo.sendSystemData(clientNumber, socket,sysInfo.createsysMap);
    
        // Closed socket event listener
        socket.addEventListener('close', function(event) {
            if (event.wasClean) {
                console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
                } 
            else {              
                console.log('Connection has died');
                }
            });
    };
} 
catch (e) {
    // Logs the cause of error to user
    console.log('Pi Five Server Offline, Please start first');
}

module.exports = {
    wsServer
}

