//************** Client code for Raspberry Pi Zero W unit 1 **************//

//************** Below section for dependencies **************//
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const WebSocket = require('ws');
// Performance timing for testing and monitoring code
const { performance } = require('perf_hooks');
// Import time functions from the date.js module
const currentTime = require('./date.js');
// Import time functions from the client1iodata.js module
const c1data = require('./devices/client1iodata.js');
// Import websockets functions from the socket.js module
const wskt = require('./clientSocket.js');
// Import system Information
const sysInfo = require('./system.js');
//**********************************************************************//

// Globally scoped variable definitions 
// These are used in a setInterval but need to be global so are declared here
var dateTime;

// This runs the timeStamp function imported from date.js to display current time within server.js
// Takes the current time every 500ms
setInterval (function() {
    let dateTimeGMT = currentTime.timeStamp();
    dateTime = dateTimeGMT[0].toString();
    //GMT = dateTimeGMT[1].toString();
},100)

// Display system Info to the console
let systemInformation = sysInfo.systemInfo();

// Connect to the WS piFive server here
var clientNumber = '1'
console.log('Starting WS now');
const socket = new WebSocket('ws://localhost:3000');
const clientSocket = wskt.wsServer(socket, clientNumber, c1data.updateIO);

setInterval(() => {
    console.log('Client running and time is: ', dateTime);
}, 5000);



