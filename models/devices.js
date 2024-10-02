// The below describes a new model which is then exported and used for database storage 

// Import io write to DB function from database.js module
const { json } = require('body-parser');
var sqlDB = require('../database.js');

/* Class for models used as part of the MVC structure. This has an internal method 'HMI_Data' which
   is called within a getter function allowing the Process Variable to be rendered on HTML page */
class Device {
    constructor(tag, description) {
        this.tag = tag;
        this.description = description;
        this.PV;
    }

    // Method - Call database current PV for Device
    HMI_Data() {
        this.PV = sqlDB.ioDataFromDB();
        //console.log('****** val value is *******', this.PV);
        //return this.PV;
    }

    // Getter - Calls above HMI_Data 
    get fetchPV() { setInterval(() => this.HMI_Data(), 1500)
        return this.PV;
     }
}

module.exports = {
    Device
};
