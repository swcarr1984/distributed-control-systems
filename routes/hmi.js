// Routing page for the main HMI landing / test page

// Import dependencies
const path = require('path');
const express = require('express');

const hmiController = require('../controllers/hmi.js');
const router = express.Router();

// The below is called during runtime of the main 'app.js' application
// This initially calls the controller listed below which directs to the index.ejs page 
// localhost:3000 => GET (routes to the EJS file specified and passes any listed variables as listed)
router.get('/', hmiController.getIndex);

module.exports = router;