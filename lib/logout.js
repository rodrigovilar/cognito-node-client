#!/usr/bin/env node

'use strict';

const customFs = require('./custom.fs');
const inquirer = require('inquirer');
const userpool = require('./userpool');

function Logout() {
    customFs.ContinueFileExists('config.json', 'User is not registered', readConfig);
}

function readConfig() {
    customFs.ReadJsonFileAndContinue('config.json', 'Failed to read config.json file', 
        function(config) {
            if (config.verificationCode) {
                if (config.tokens) {
                    askQuestions(config);
                } else {
                    console.log('User is not logged in');
                }
            } else {
                console.log('User is not confirmed');
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
    userpool.Logout(config.userPoolId, config.clientId, config.userName,
        function () {
            delete config.tokens;

            customFs.WriteJsonFile('config.json', config, 'Failed to save config.json file', 
                'User logged out.');
        });
}

module.exports = {
    Logout : Logout
};
