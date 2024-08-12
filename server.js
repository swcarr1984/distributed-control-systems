// https://github.com/websockets/ws Use this website for more documentation

// find out difference between ws.on( open/connected/broadcast/ individual messages/manual heartbeat )

// Main Central Server on Pi Five
const express = require('express');
const app = express();
const path = require('path');
const WebSocket = require('ws');
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
// Import time functions from the date.js module
const currentTime = require('./date.js');
// Import watchdog functions from the watchdog.js module
const wd = require('./watchdog.js');
// Import websockets functions from the socket.js module
const wskt = require('./serverSocket.js');
// Import mysql database function from the database.js module
const db = require('./database.js');
// Used for allowing urlencoding within the app
app.use(bodyParser.urlencoded({extended: false}));
// The below command tells express that EJS is the Template Engine of choice for Project
app.set('view engine', 'ejs');
// Import various class definitions from from the objects.js module
const objects = require('./objects.js');

app.use(express.static(path.join(__dirname, '/public')));

// Globally scoped variable definitions 
// These are used in a setInterval but need to be global so are declared here
let dateTime;
let GMT;

// This runs the timeStamp function imported from date.js to display current time within server.js
// Takes the current time every 500ms
setInterval (function() {
    let dateTimeGMT = currentTime.timeStamp();
    dateTime = dateTimeGMT[0].toString();
    GMT = dateTimeGMT[1].toString();
},100)

//************** Below section for functions relating to WS operation **************//
const wss = new WebSocket.Server({ server:server });
const ws = new WebSocket('ws://localhost:3000')
const socket = wskt.wsServer(ws, wss);

//************** System watchdog testing here **************//

wd.sysWatchdog();
wd.sysWatchdogRefresh();

//************** HTTP Server **************//
server.listen(3000, /*'192.168.0.4',*/ () => {
    console.log("Server up, listening on port: 3000")
})

// mySQL Database connection
db.myDB();

// System Information logging data while running
/*setInterval(() => {
    console.log('Server running and time is: ', dateTime)
}, 5000);
*/

// add reconnection and test for watchdog
// add client id's and auth
// add buffer and max message size per transmit
// add timestamp to data going both ways