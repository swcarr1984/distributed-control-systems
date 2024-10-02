//************** Client code for Raspberry Pi Zero W unit 2 **************//

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
const c2data = require('./devices/client2iodata.js');
// Import websockets functions from the socket.js module
const wskt = require('./clientSocket.js');
// Import system Information
const sysInfo = require('./system.js');
//**********************************************************************//

// Globally scoped variable definitions 
// These are used in a setInterval but need to be global so are declared here
var dateTime;

// This runs the timeStamp function imported from date.js to display current time within server.js
// Takes the current time every 100ms
setInterval (function() {
    let dateTimeGMT = currentTime.timeStamp();
    dateTime = dateTimeGMT[0].toString();
},100)

// Display system Info to the console
let systemInformation = sysInfo.displaySystemInfo();

// Connect to the WS piFive server here
var clientNumber = '2'
console.log('Starting WS now');
// The below code connects to pi five on network, use commented code if local device testing only
const socket = new WebSocket( 'ws://192.168.0.4:3000' /* 'ws://localhost:3000' */ );
const clientSocket = wskt.wsClient(socket, clientNumber, c2data.updateIO);

setInterval(() => {
    console.log('Client running and time is: ', dateTime);
}, 5000);

