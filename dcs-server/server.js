//--------------- Main Central Server on Pi Five ---------------//

//--------------- Main npm dependency imports ---------------//
// Imports express for use within the node application
const express = require('express');
// Imported path library for use with system directories as required
const path = require('path');
// Imports javascript websocket library
const WebSocket = require('ws');
// Body parser for parsing form data between application states
const bodyParser = require('body-parser');
//---------------------------------------------------------//

//--------------- Custom dependency imports ---------------//
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
//---------------------------------------------------------//

//--------------- Express application created -------------//
/* Assigns the JavaScript express function which is the request function 
   handler to be passed to the NodeJS HTTP server. */
   const app = express();
   // Creates a HTTP server instance and uses the express handler within.
   const server = require('http').createServer(app);
//---------------------------------------------------------//

//---------------- Main HMI - MVC imports ----------------//
// The below command tells express that EJS is the Template Engine of choice for Project
app.set('view engine', 'ejs');
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
//-------------------------------------------------------//

//------------- Date Time Logging for Server ------------//
// Globally scoped variable definitions 
// These are used in a setInterval but need to be global so are declared here
var dateTime;
let GMT;
// This runs the timeStamp function imported from date.js to display current time within server.js
// Takes the current time every 500ms
setInterval (function() {
    let dateTimeGMT = currentTime.timeStamp();
    dateTime = dateTimeGMT[0].toString();
    GMT = dateTimeGMT[1].toString();
},100)
//-------------------------------------------------------//

//------------- System watchdog testing here ------------//

wd.sysWatchdog();
wd.sysWatchdogRefresh();

//------------------------- HTTP Server -------------------------//

// The IP can be commented out to allow localhost testing of comms on laptop etc.
server.listen(3000, '192.168.0.4', () => {
    console.log("Server up, listening on port: 3000")
});

//----- Below section for functions relating to WS operation ----//
const wss = new WebSocket.Server({ server:server });
//const ws = new WebSocket('ws://192.168.0.4:3000'); //******* get rid of this and ws below */
const socket = wskt.wsServer(wss);

//------------------ mySQL Database connection ------------------//
const sqlConn = db.myDB();

// Logs system info into DB every 10 seconds
setInterval (function() {
    let sysData = sysInfo.createsysMap();
    let formattedData = format.formatDBdata(sysData);
    db.sysInfoToDB ('serversysdata', formattedData.keyArray, formattedData.valueArray, dateTime);
},10000)

//------------------ End of Server Application ------------------//