// Function for formatting JSON data prior to writing to database
function formatDBdata (data) {
    let parseddata = JSON.parse(data)
    var keyArray = [];
    var valueArray = [];
    Object.keys(parseddata).forEach(key => {
        keyArray.push(JSON.stringify(key));    
    });
    Object.values(parseddata).forEach(value => { 
        valueArray.push(JSON.stringify(value)); 
    });
    return{keyArray, valueArray};
};

module.exports = {
    formatDBdata
}