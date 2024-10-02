// Below is used to direct to the main HMI landing page for the application

const devices = require('../models/devices'); // imports the class from the models folder

var Device1_PV;
Device1 = new devices.Device('PIT-210', 'Pressure Transmitter');

/* Allow time for databse to read first client data then call Process Variable 
   using class method for the model to send to webpage as displayed value */
setTimeout(() => {
    Device1_PV =  Device1.fetchPV;
  }, 15000);

// Render requested page as directed through router with model included
exports.getIndex = (req, res, next) => {
            res.render('hmi/index',{ 
                devs: Device1,
                pageTitle: 'HMI Landing Page',
                path: '/'
            }); 
    };


