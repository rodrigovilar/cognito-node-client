#!/usr/bin/env node

'use strict';

const fs = require('file-system');
const inquirer = require('inquirer');
const userpool = require('./userpool');

function RegisterUser() {

    fs.exists('./config.json', function(exists){
        if (exists) {
            console.log('User is already registered');
        } else {
            askQuestions();
        }
    });
}

function askQuestions() {
    const questions = [
        { type: 'input', name: 'userPoolId', message: 'Type the user pool id'},
        { type: 'input', name: 'appClientId', message: 'Type the app client id'},
        { type: 'input', name: 'userName', message: 'Type the user name'},
        { type: 'password', name: 'password', message: 'Type the password', mask: '.'},
        { type: 'input', name: 'givenName',  message: 'Type the given name'},
        { type: 'input', name: 'email',  message: 'Type the email'},
        { type: 'input', name: 'phoneNumber',  message: 'Type the phone number'}
    ];

    inquirer
        .prompt(questions)
        .then(function (answers) {
            var config = {
                "userPoolId" : answers.userPoolId,
                "clientId" : answers.appClientId,
                "userName" : answers.userName,
                "attributes" : {
                    "given_name" : answers.givenName,
                    "email" : answers.email,
                    "phone_number" : answers.phoneNumber
                }
            }
            doRegisterUser(config, answers.password);
        });
}

function doRegisterUser(config, password) {
    userpool.RegisterUser(config.userPoolId, config.clientId, config.userName, 
                            password, config.attributes, 
        function(cognitoUser) {
            console.log('User registered ', cognitoUser.getUsername());
            writeConfigFile(config);
        },
        function(err) {
            console.log('Sing up error: ', err);
        });
};

function writeConfigFile(config) {
    fs.writeFile('./config.json', JSON.stringify(config), 'utf8',
        function(err) {
            if (err) {
                console.log('Failed to save config.json file', err);
            } else {
                console.log('Check your mail to obtain the verification code and proceed to user confirmation');
            }
        });
}

module.exports = {
    RegisterUser : RegisterUser
};
