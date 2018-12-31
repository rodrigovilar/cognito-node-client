#!/usr/bin/env node

'use strict';

const application = require('./application');
const configuration = require('./configuration');
const inquirer = require('inquirer');
const userpool = require('./userpool');

var appData = undefined;

function ChangePassword() {
    application.LoadData(function(data) {
        appData = data;
        configuration.ContinueConfigurationDoesNotExist('User is already confirmed', askQuestions);
    });
}

function askQuestions() {
    const questions = [
        { type: 'input', name: 'userName', message: 'Type the user name'},
        { type: 'password', name: 'defaultPassword', message: 'Type the default password', mask: '.'},
        { type: 'password', name: 'newPassword', message: 'Type the new password', mask: '.'},
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
            doChangePassword(config, answers.defaultPassword, answers.newPassword);
        });
}

function doChangePassword(config, defaultPassword, newPassword) {
    userpool.LoginChangingPassword(appData.userPoolId, appData.clientId, config.userName, 
        defaultPassword, newPassword, config.attributes.given_name,
        function (result) {
            config.tokens = {};
            config.tokens.access = result.getAccessToken().getJwtToken();
            config.tokens.id = result.getIdToken().getJwtToken();
            config.tokens.refresh = result.getRefreshToken().getToken();

            configuration.WriteConfiguration(config, 'Failed to save config.json file', 
                'Password chenged and user logged in.');
        },
        function(err) {
            console.log('Authentication error:', err);
        });
}

module.exports = {
    ChangePassword : ChangePassword
};
