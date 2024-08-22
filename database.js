// Database logic for export to the main node Pi Five Server

// Taken from W3schools tutorial

// For DB creation run the code with server.js once to create the DB then null the NOTE #1 code
// and activate the NOTE #2 code which points to the created DB and allows operations etc.

// Import dependencies
// Below modified to allow encrypted authentication compatible with nodeJS
const mysql = require('mysql2');
//var connection;
// Below is created as a function not a class as only a single instance is requried between the Pi Five App and DB.
// If connecting multiple clients to DB then a class with static initialisation block should be used.
function myDB() {
    var connection = mysql.createConnection({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'password',
        database: 'piFiveDB' // NOTE #2 //
    });
 
    connection.connect((err) => {
        if (err) {
            throw err;
        }
        else {
            console.log('Connected to MySql Server!'); 
            /* NOTE #1 // Once created the below line of code is redundant and replaced with // NOTE #2 // code above
            connection.query('create database piFiveDB',function (err, result) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('Database created');
                }
            })

            */
           /*
            // Once created the below lines of code are redundant
            var ioTable2 = "CREATE TABLE client1iodata (tag VARCHAR(255), value VARCHAR(255), servertime VARCHAR(255),clienttime VARCHAR(255))";
            connection.query(ioTable2, function (err, result) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('Table created')
                }
            })
            var ioTable3 = "CREATE TABLE client2iodata (tag VARCHAR(255), value VARCHAR(255), servertime VARCHAR(255), clienttime VARCHAR(255))";
            connection.query(ioTable3, function (err, result) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('Table created')
                }
            })
            var sysTable1 = "CREATE TABLE client1sysdata (tag VARCHAR(255), value VARCHAR(255), clienttime VARCHAR(255))";
            connection.query(sysTable1, function (err, result) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('Table created')
                }
            })
            var sysTable2 = "CREATE TABLE client2sysdata (tag VARCHAR(255), value VARCHAR(255), clienttime VARCHAR(255))";
            connection.query(sysTable2, function (err, result) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('Table created')
                }
            })
            var sysTable3 = "CREATE TABLE serversysdata (tag VARCHAR(255), value VARCHAR(255), clienttime VARCHAR(255))";
            connection.query(sysTable3, function (err, result) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('Table created')
                }
            })
                */
            var alarmTable = "CREATE TABLE alarmdata (tag VARCHAR(255), status VARCHAR(255), clienttime VARCHAR(255), clientnumber VARCHAR(255))";
            connection.query(alarmTable, function (err, result) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log('Table created')
                }
            })
             
                       
        }
        
    });
    return(connection);
};

// function for writing IO data from clients into database
function ioToDB (connection, tableName, tags, values, servertime, datetime) {
    datetime = JSON.stringify(datetime);
    for( j=0; j<tags.length; j++) {
        let db = "INSERT INTO " + tableName + " (tag, value, servertime, clienttime) VALUES("+ tags[j] +","+ values[j] +", "+ servertime +","+ datetime +")";
        connection.query(db, function(err, result) {
            if(err) throw err;
        })
    }
    console.log('Updated client I/O data inserted');  
    
};

// function for writing alarm data from clients into database
function alarmToDB (connection, tableName, tags, values, datetime, clientID) {
    datetime = JSON.stringify(datetime);
    clientID = JSON.stringify(clientID);
    for( j=0; j<tags.length; j++) {
        let db = "INSERT INTO " + tableName + " (tag, status, clienttime, clientnumber) VALUES("+ tags[j] +","+ values[j] +","+ datetime +","+ clientID +")";
        connection.query(db, function(err, result) {
            if(err) throw err;
        })
    }
    console.log('Updated client alarm data inserted');  
    
};

// function for writing system info data from server and clients in database
function sysInfoToDB (connection, tableName, tags, values, datetime) {
    datetime = JSON.stringify(datetime);
    for( j=0; j<tags.length; j++) {
        let db = "INSERT INTO " + tableName + " (tag, value, clienttime) VALUES("+ tags[j] +","+ values[j] +","+ datetime +")";
        connection.query(db, function(err, result) {
            if(err) throw err;
        })
    }
    console.log('Updated system data inserted');  
    
};

module.exports = {
    myDB,
    ioToDB,
    alarmToDB,
    sysInfoToDB
};