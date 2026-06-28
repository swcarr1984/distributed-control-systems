// To test this code open the terminal at the bottom and type node objectTut.js

const pressureTransmitter = {
    manufacturer: 'Rosemount',
    model: '3051',
    identify() {
        console.log('Transmitter model is ' + this.model);
    }
};
pressureTransmitter.identify();

function device(model, scale) {
    this.model = model;
    this.scale = scale;
  }


module.exports = {
    device
  };

 module.exports = {
    pressureTransmitter,
    device
  };