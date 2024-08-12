function systemInfo() {
    // Import system information monitor
    const os = require('os');
    // Allocating process module 
    const process = require('process');
    console.log("We are running on a " + os.platform() + " system");
    const freeMemory = os.freemem() / 1024 / 1024; // 1024/1024 converts to MB
    console.log("Available free memory:", freeMemory.toFixed(2), "MB");
    const cpuCores = os.cpus().length;
    console.log("Number of CPU cores:", cpuCores);
    const hostname = os.hostname();
    console.log("Hostname of this system:", hostname); 
    // Calling process.cpuUsage() method 
    const usage = process.cpuUsage(); 
    // Printing returned value 
    console.log(usage);
}

module.exports = {
    systemInfo
  };