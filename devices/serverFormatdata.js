// Function for formatting JSON data prior to writing to database
function formatIOdata (ioData) {
    //console.log('iodata input as JSON is:',ioData)
    let parsedIOdata = JSON.parse(ioData)
    var keyArray = [];
    var valueArray = [];
    Object.keys(parsedIOdata).forEach(key => {
        //console.log('key', key);  
        keyArray.push(JSON.stringify(key));    
    });
    Object.values(parsedIOdata).forEach(value => {
        //console.log('value', value);  
        valueArray.push(JSON.stringify(value)); 
    });
    //console.log(typeof keyArray,keyArray);
    //console.log(valueArray);
    return{keyArray, valueArray};
};

module.exports = {
    formatIOdata
}