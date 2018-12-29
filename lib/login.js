#!/usr/bin/env node

'use strict';

const fs = require('file-system');
const inquirer = require('inquirer');
const userpool = require('./userpool');

function Login() {
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
                askQuestions(config);
            } else {
                console.log('User is not confirmed');
            }
        }
      })
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
            writeConfigFile(config);
        },
        function(err) {
            console.log('Authentication error:', err);
        });
}

function writeConfigFile(config) {
    fs.writeFile('./config.json', JSON.stringify(config), 'utf8',
    function(err) {
        if (err) {
            console.log('Failed to save config.json file', err);
        } else {
            console.log('User logged in.');
        }
    });
}

module.exports = {
    Login : Login
};
