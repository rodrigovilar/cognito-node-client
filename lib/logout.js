#!/usr/bin/env node

'use strict';

const inquirer = require('inquirer');
const userpool = require('./userpool');
const application = require('./application');
const configuration = require('./configuration');

var appData = undefined;

function Logout() {
    application.LoadData(function(data) {
        appData = data;
        configuration.ContinueConfigurationExists('User is not confirmed', readConfig);
    });
}

function readConfig() {
    configuration.ReadConfigurationAndContinue('Failed to read config.json file', 
        function(config) {
            if (config.tokens) {
                askQuestions(config);
            } else {
                console.log('User is not logged in');
            }
        });
}

function askQuestions(config) {
    const questions = [
        { type: 'confirm', name: 'logout', message: 'Confirm log out?', default: true}
    ];

    inquirer
        .prompt(questions)
        .then(function (answers) {
            if (answers.logout) {
                doLogout(config);
            }
        });
}

function doLogout(config) {
    userpool.Logout(appData.userPoolId, appData.clientId, config.userName,
        function () {
            delete config.tokens;

            configuration.WriteConfiguration(config, 'Failed to save config.json file', 
                'User logged out.');
        });
}

module.exports = {
    Logout : Logout
};
