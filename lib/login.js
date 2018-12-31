#!/usr/bin/env node

'use strict';

const inquirer = require('inquirer');
const userpool = require('./userpool');
const application = require('./application');
const configuration = require('./configuration');

var appData = undefined;

function Login() {
    application.LoadData(function(data) {
        appData = data;
        configuration.ContinueConfigurationExists('User is not confirmed', readConfig);
    });
}

function readConfig() {
    configuration.ReadConfigurationAndContinue('Failed to read config.json file', 
        function(config) {
            if (config.tokens) {
                console.log('User is already logged in');
            } else {
                askQuestions(config);
            }
        });
}

function askQuestions(config) {
    const questions = [
        { type: 'password', name: 'password', message: 'Type the password', mask: '.'}
    ];

    inquirer
        .prompt(questions)
        .then(function (answers) {
            var password = answers.password;
            doLogin(config, password);
        });
}

function doLogin(config, password) {
    userpool.Login(appData.userPoolId, appData.clientId, config.userName, password,
        function (result) {
            config.tokens = {};
            config.tokens.access = result.getAccessToken().getJwtToken();
            config.tokens.id = result.getIdToken().getJwtToken();
            config.tokens.refresh = result.getRefreshToken().getToken();

            configuration.WriteConfiguration(config, 'Failed to save config.json file', 
                'User logged in.');
        },
        function(err) {
            console.log('Authentication error:', err);
        });
}

module.exports = {
    Login : Login
};
