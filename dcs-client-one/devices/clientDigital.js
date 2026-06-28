// Client Interface function and object constructors for Discrete data IO elements

// Simple object definition for generic Discrete IO device
function ioDevice(tag, raw) {
    this.tag = tag;
    this.raw = raw;
}

function LL_Alarm(tag, raw) {
    this.tag = tag;
    this.raw = raw;
}

module.exports = {
    ioDevice,
};
