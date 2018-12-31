#!/usr/bin/env node

'use strict';

const inquirer = require('inquirer');
const userpool = require('./userpool');
const application = require('./application');
const configuration = require('./configuration');

var appData = undefined;

function RegisterUser() {
    application.LoadData(function(data) {
        appData = data;
        configuration.ContinueConfigurationDoesNotExist('User is already registered', askQuestions);
    });
}

function askQuestions() {
    const questions = [
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
    userpool.RegisterUser(appData.userPoolId, appData.clientId, config.userName, 
                            password, config.attributes, 
        function(cognitoUser) {
            console.log('User registered ', cognitoUser.getUsername());
            configuration.WriteConfiguration(config, 'Failed to save config.json file', 
                'Check your mail to obtain the verification code and proceed to user confirmation');
            },
        function(err) {
            console.log('Sing up error: ', err);
        });
};

module.exports = {
    RegisterUser : RegisterUser
};
