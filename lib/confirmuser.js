#!/usr/bin/env node

'use strict';

const application = require('./application');
const configuration = require('./configuration');
const inquirer = require('inquirer');
const userpool = require('./userpool');

var appData = undefined;

function ConfirmUser() {
    application.LoadData(function(data) {
        appData = data;
        configuration.ContinueConfigurationExists('User is not confirmed', readConfig);
    });
}

function readConfig() {
    configuration.ReadConfigurationAndContinue('Failed to read config.json file', 
        function(config) {
            if (config.verificationCode) {
                console.log('User is already confirmed');
            } else {
                askQuestions(config);
            }
        });
}

function askQuestions(config) {
    const questions = [
        { type: 'input', name: 'verificationCode', message: 'Type the verification code sent by email'}
    ];

    inquirer
        .prompt(questions)
        .then(function (answers) {
            config.verificationCode = answers.verificationCode;
            doConfirmUser(config);
        });
}

function doConfirmUser(config) {
    userpool.ConfirmUser(appData.userPoolId, appData.clientId, config.userName, config.verificationCode, 
        function(result) {
            console.log('Confirm user result:', result);
            configuration.WriteConfiguration(config, 'Failed to save config.json file', 
                'User confirmed. Proceed to log in.');
        },
        function(err) {
            console.log('Confirm user error: ', err);
        });
}

module.exports = {
    ConfirmUser : ConfirmUser
};
