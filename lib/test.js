#!/usr/bin/env node

'use strict';

var request = require('request');
const application = require('./application');
const configuration = require('./configuration');

var appData = undefined;

function Test() {
    application.LoadData(function(data) {
        appData = data;
        configuration.ContinueConfigurationExists('User is not confirmed', readConfig);
    });
}


function readConfig() {
    configuration.ReadConfigurationAndContinue('Failed to read config.json file', 
        function(config) {
            if (config.tokens) {
                doTest(config);
            } else {
                console.log('User is not logged in');
            }
        });
}

function doTest(config) {
    var options = {
        url: appData.testURL,
        headers: {
          'Authorization': config.tokens.id
        }
    };
       
    function callback(error, response, body) {
        if (error) {
            console.log('Test error', error);
        } else {
            if (response.statusCode == 200) {
                console.log('Test ok', body);
            } else {
                console.log('Server returned strange response', response.statusCode, body);
            } 
        }
    }
    
    console.log(options);
    request(options, callback);
}

module.exports = {
    Test : Test
};
