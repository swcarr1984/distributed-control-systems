// Client Interface function and class constructors for Analog data IO elements

// Global flags used for promise passing of returned values within sections of overall object methods
var HHflag = 'false';
//var Hflag = 'false';
//var Lflag = 'false';
//var LLflag = 'false';
// Main Analog Interface object - allows object assignment via constructor, provides internal and external methods for readings, alarms etc
class aiDevice {

    /* Class Constructor - Used for creating analog input instances
       Inputs are as stated with High High, High, Low, Low Low parameters and delay (d_HH etc) in mS for each.
       Any alarms paramaters 'HH, H, L, LL' assigned 0 are disabled. */
    constructor(tag, raw, eng_lrv, eng_urv, units, HH, H, L, LL, d_HH, d_H, d_L, d_LL, maxRaw, minRaw) {
    this.tag = tag;
    this.raw = raw;
    this.eng_lrv = eng_lrv;
    this.eng_urv = eng_urv;
    this.units = units;
    this.HH = HH;
    this.H = H;
    this.L = LL;
    this.LL = LL;
    this.d_HH = d_HH;
    this.d_H = d_H;
    this.d_L = d_L;
    this.d_LL = d_LL;
    this.maxRaw = maxRaw;                   // 5 volt input signal maximum
    this.minRaw = minRaw;                   // 0 volt input signal minimum
    this.HHtimeoutID = 'HH_Alarm_Timeout';
    this.HtimeoutID = 'H_Alarm_Timeout';
    this.LtimeoutID = 'L_Alarm_Timeout';
    this.LLtimeoutID = 'LL_Alarm_Timeout';
    this.alarmFlag = 'false';               // Active if alarm generated
    this.alarmTimeoutFlag = 'false';        // Ensures alarm timeout only activated once
    this.scaledPV = (this.eng_urv-this.eng_lrv)*((this.raw-this.minRaw)/this.maxRaw);
    }

    // Getter - Returns current PV in engineering units
    get currentPV() {
        this.scaledPV = (this.eng_urv-this.eng_lrv)*((this.raw-this.minRaw)/this.maxRaw);
        console.log('Output for ' + this.tag + ' is: ' + this.scaledPV.toFixed(0) + ' ' + this.units)
    }

    // Method - Update raw process variable input and return scaled Process Variable
    updateRaw(raw) {
        this.raw = raw;
        this.scaledPV = (this.eng_urv-this.eng_lrv)*((this.raw-this.minRaw)/this.maxRaw);
        console.log('raw is: ' + this.raw.toFixed(2) + ' volts DC.', 'Scaled PV is: ' + this.scaledPV.toFixed(0) + ' kpa');
    }

    // Method - Used to reset alarms on device after activation
    resetAlarm(reset) {
        this.alarmFlag = reset; // value = false passed into object to reset flag
    }
    
    // ------- Async Operations to check delay timers and return promise when done ------//

    // Inner Method - Used for creating Timeout with Promise for Method checkAlarm() 
    delayTimer(t, timeoutID) {
        return new Promise(function(resolve) {
            timeoutID = setTimeout(function() {
                resolve();
            }, t);
        });
    }

    // Inner Method - Encapsulates the promise and allows returns 'true' which is assigned in below execution invocation
    setHHAlarmFlag() {
        return this.delayTimer(this.d_HH,'HH_Alarm_Timeout').then(function() {
            return 'true';
        });
    }

    // Set further H, L, LL alarm flag methods here...

    // -----------------------------------------------------------------------------------//

    // Method - checks the current PV against all assigned alarms and delays
    checkAlarms() {
        this.alarmData;
        // ------------------ HH alarm checks ------------------ //
        if(this.HH != 0) {
            console.log('Checking HH alarms status, ',' ScaledPV is: ', this.scaledPV.toFixed(0),'HH Setpoint is: ', this.HH, 'Alarm Flag is: ', this.alarmFlag);
            //console.log('ScaledPV is: ', this.scaledPV.toFixed(0),'HH Setpoint is: ', this.HH, 'Alarm Flag is: ', this.alarmFlag);
            
            // ------------------ HH Alarm with Delay checks ------------------ //
            if (this.d_HH != 0 && this.scaledPV > this.HH) {

                // One-shot delay timer activation for HH with delay
                if(this.alarmTimeoutFlag == 'false') {
                    
                    // Ensures timer only activated once until reset by healthy PV
                    this.alarmTimeoutFlag = 'true'; 
                    console.log('******** HH alarm active with delay, timeout activated ********');
                    // Promise used to ensure timer has expired before writing to 'this.alarmFlag'
                    // Execution - This runs the function and gives access to the returned inputted data upon promise resolution
                    this.setHHAlarmFlag(HHflag).then(function(returnedValue) {
                        console.log('**** Promise value returned is: ', returnedValue);
                        HHflag = 'true';
                    })
                    console.log('**** alarmflag value in "if" call: ', this.alarmFlag);
                }
                // Runs after one-shot code above has activated the async delay timeout
                else {
                    console.log('**** HHflag value is: ', HHflag);
                    console.log('**** Alarmflag value in "else" call: ', this.alarmFlag);                  
                }
               
                // If Promise flag returns true then set alarmFlag true to activate alarm
                if (HHflag == 'true') {
                    this.alarmFlag = 'true';
                    this.alarmData = ('High High Alarm @ ' + this.HH + this.units + ' with ' + this.d_HH + 'mS delay');
                    console.log('** TIMEOUT HAS OCCURED - HIGH HIGH ALARM ACTIVATED **')
                }
                else {
                    this.alarmFlag = 'false';
                    console.log('Alarm Promise timeout incrementing');
                }
                console.log('Alarm flag post HHflag check value is: ', this.alarmFlag);
                
            }

            // ------------------ Instant HH Alarm with No Delay checks ------------------ //
            else if(this.d_HH == 0 && this.scaledPV > this.HH) { 
                console.log('INSTANT HIGH HIGH ALARM');
                this.alarmFlag = 'true';
                this.alarmData = ('High High Alarm @ ' + this.HH + this.units);
            }
            // ------------------ HH Alarm with Delay Healthy SP checks ------------------ //
            else if(this.d_HH != 0 && this.scaledPV < this.HH) {
                console.log('HH Alarm clear');
                this.alarmData = 'Healthy';
                this.alarmTimeoutFlag = 'false';    // Allows the alarm delay timeout to be activated again if PV in alarm range again
                clearTimeout('HH_Alarm_Timeout');   // Clears the active delay timeout as PV is healthy again
            }
            // ----------------------- HH Alarm Not Enabled checks ----------------------- //
            else {
                console.log('HH Alarm not enabled');
                //this.alarmFlag = 'false';
                this.alarmData = 'Disabled';
            }
        }
        // ****** Add remaining H alarm checks and further alarms here ****** //

    // End of checkAlarm() Method returns the current scaled PV and alarm status for user
    return([this.scaledPV, this.alarmFlag, this.alarmData, this.tag]);
    };

};


// Test value updated after above initialisation to assist in showing alarm and method functionality
//--------------------------- For Testing Only ---------------------------------//
/*
setInterval(() => {
    aiDevice1.raw = aiDevice1.raw + 0.2;
}, 1000);

// Replace with below for actual hardware interface 

var adcpi = require('./ABElectronics_NodeJS_Libraries/lib/adcpi/adcpi');

var adc = new ADCPi(0x68, 0x69, 18);

// Below reads the ADC values every 200mS and assigns to the variables listed for use in aiDevice object
setInterval (function() {
    let aiDev1scanVoltage = adc.readVoltage(1); // This returns a value between 0 - 5 VDC as read via ADC Pi Hardware Module on Channel 1 via I2C comms.
    let aiDev1scanRaw = adc.readRaw(1);         // This returns a value between 0 - 130000 as read via ADC Pi Hardware Module on Channel 1 via I2C comms.
}, 200)

//----------------------------------------------------------------------------// */

// Function definition which calls object methods to update input to analog object, 
// returns the scaled PV and assesses and activates alarms 
function scanAnalog(aiDevice) { setInterval(() => {
    aiDevice.currentPV;                
    aiDevice.updateRaw(aiDevice.raw);
    var par = aiDevice.checkAlarms();
    console.log('Scaled PV is: ', par[0].toFixed(0), ' | Alarm Flag is: ', par[1], ' | Alarm Status is: ', par[2], ' | Device Tag is: ', par[3]);
    }, 2000)
};

// Scans the analog device as per above function at set interval time period
//scanAnalog(aiDevice1);

module.exports = {
    aiDevice,
    scanAnalog
};
