// Main Central Server Node/Express Application on Pi Five

// Imports express for use within the node application
const express = require('express');
// Creates the application
const app = express();
// Creates a HTTP server instance for use with websocket upgrade and displays etc
const server = require('http').createServer(app);
// Imported path library for use with system directories as required
const path = require('path');
// Imports javascript websocket library
const WebSocket = require('ws');
// Body parser for parsing form data between application states
const bodyParser = require('body-parser');
// Import time functions from the date.js module
const currentTime = require('./date.js');
// Import watchdog functions from the watchdog.js module
const wd = require('./watchdog.js');
// Import system Information
const sysInfo = require('./system.js');
// Import format IO write to DB function from serverFormatdata.js module
const format = require('./devices/serverFormatdata.js');
// Import websockets functions from the socket.js module
const wskt = require('./serverSocket.js');
// Import mysql database function from the database.js module
const db = require('./database.js');
// The below command tells express that EJS is the Template Engine of choice for Project
app.set('view engine', 'ejs');

//--------------- Main HMI - MVC imports ---------------//
// Set route handler constants for routing app / data to HMTL HMI screens
const hmiroutes = require('./routes/hmi.js');
const errorController = require('./controllers/error.js');
// Used for allowing url encoding within the app
app.use(bodyParser.urlencoded({extended: false}));
// Below is used to direct app to the static public directory for serving images/css etc to page requests
app.use(express.static(path.join(__dirname, '/public')));
// Below commands run the route handlers set above 
app.use(hmiroutes);
app.use(errorController.get404);
//----------------------------------------------------//

// Globally scoped variable definitions 
// These are used in a setInterval but need to be global
var dateTime;

// This runs the timeStamp function imported from date.js to display current time within server.js
// Takes the current time every 100ms
setInterval (function() {
    let dateTimeGMT = currentTime.timeStamp();
    dateTime = dateTimeGMT[0].toString();
    //GMT = dateTimeGMT[1].toString(); // GMT used as required
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
const sqlConn = db.myDB();

// Logs system info into DB every 10 seconds
setInterval (function() {
    let sysData = sysInfo.createsysMap();
    let formattedData = format.formatDBdata(sysData);
    db.sysInfoToDB (sqlConn, 'serversysdata', formattedData.keyArray, formattedData.valueArray, dateTime);
},10000)
