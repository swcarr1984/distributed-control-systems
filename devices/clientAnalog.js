// Client Interface function and object constructors for Analog data IO elements

/* 
   mA in requires scaling as below
   8mA for device of 0 to 5kPa
   [(8-4)/(16)]*[urv-lrv]
   0.25 * 5kPa = 1.25kPa
*/

function aiDevice(tag, raw, lrv, urv) {
    this.tag = tag;
    this.raw = raw;
    this.lrv = lrv;
    this.urv = urv;
    let maxRaw = 4096;
    let minRaw = 0;
    let scaledPV = urv-lrv*((raw-minRaw)/maxRaw);
    console.log('Output is:',scaledPV)
}

module.exports = {
    aiDevice
};