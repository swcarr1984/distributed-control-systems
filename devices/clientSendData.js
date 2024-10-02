// Functions here are used to take individual client data and send over their websocket connection

// Import time functions from the date.js module
const currentTime = require('../date.js');

//var ioData;
/* The below clientSendData takes the client ID, socket connection and passes a function inside 
   which runs. This is where the individual client data READ and UPDATE operations are called internally */

function clientSendData (clientID, socket, sendDataFunction){
    // Below is where the individual client updateIO() functions which are passed in are called
    var ioData = sendDataFunction();
    console.log('clientSendData.ioData is:',ioData);
    let dateTimeGMT = currentTime.timeStamp();
    dateTime = dateTimeGMT[0].toString();
    // The data read and returned by the above function is then sent using WS to Server
    if (socket.bufferedAmount == 0) {
        socket.send(JSON.stringify({type: 'io', clientID: clientID, time: dateTime, data: ioData}), function () {
        });
    } else {
        console.log('Websockets buffer full');
    }
};

// The below generic function calls the above at the set interval (This is exported to clientSocket.js)
function sendData(clientID, ioData, sendDataFunction) { setInterval(() => clientSendData(clientID, ioData, sendDataFunction), 4000)};


module.exports = {
    sendData
}