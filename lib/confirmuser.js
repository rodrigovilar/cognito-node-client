#!/usr/bin/env node

'use strict';

const fs = require('file-system');
const inquirer = require('inquirer');
const userpool = require('./userpool');

function ConfirmUser() {
    fs.exists('./config.json', function(exists){
        if (exists) {
            readConfig();
        } else {
            console.log('User is not registered');
        }
    });
}

function readConfig() {
    fs.readFile('./config.json', function(err,content) {
        if(err) {
            console.log('Failed to read config.json file', err);
        } else {
            var config = JSON.parse(content);

            if (config.verificationCode) {
                console.log('User is already confirmed');
            } else {
                askQuestions(config);
            }
        }
      })
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
    userpool.ConfirmUser(config.userPoolId, config.clientId, config.userName, config.verificationCode, 
        function(result) {
            console.log('Confirm user result:', result);
            writeConfigFile(config);
        },
        function(err) {
            console.log('Confirm user error: ', err);
        });
}

function writeConfigFile(config) {
    fs.writeFile('./config.json', JSON.stringify(config), 'utf8',
    function(err) {
        if (err) {
            console.log('Failed to save config.json file', err);
        } else {
            console.log('User confirmed. Proceed to log in.');
        }
    });
}

module.exports = {
    ConfirmUser : ConfirmUser
};
