#!/usr/bin/env node

'use strict';

const customFs = require('./custom.fs');
const inquirer = require('inquirer');
const userpool = require('./userpool');

function Login() {
    customFs.ContinueFileExists('config.json', 'User is not registered', readConfig);
}

function readConfig() {
    customFs.ReadJsonFileAndContinue('config.json', 'Failed to read config.json file', 
        function(config) {
            if (config.verificationCode) {
                if (config.tokens) {
                    console.log('User is already logged in');
                } else {
                    askQuestions(config);
                }
            } else {
                console.log('User is not confirmed');
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
    userpool.Login(config.userPoolId, config.clientId, config.userName, password,
        function (result) {
            config.tokens = {};
            config.tokens.access = result.getAccessToken().getJwtToken();
            config.tokens.id = result.getIdToken().getJwtToken();
            config.tokens.refresh = result.getRefreshToken().getToken();

            customFs.WriteJsonFile('config.json', config, 'Failed to save config.json file', 
                'User logged in.');
        },
        function(err) {
            console.log('Authentication error:', err);
        });
}

module.exports = {
    Login : Login
};
