#!/usr/bin/env node

'use strict';

const customFS = require('./custom.fs');

const filename = 'config.json';

function ContinueConfigurationExists(messageDoesNotExist, continueCallback) {
    customFS.ContinueFileExists(filename, messageDoesNotExist, continueCallback);
}

function ContinueConfigurationDoesNotExist(messageExists, continueCallback) {
    customFS.ContinueFileDoesNotExist(filename, messageExists, continueCallback);
}

function WriteConfiguration(config, messageError, messageSuccess) {
    customFS.WriteJsonFile(filename, config, messageError, messageSuccess);
}

function ReadConfigurationAndContinue(messageError, continueCallback) {
    customFS.ReadJsonFileAndContinue(filename, messageError, continueCallback);
}

module.exports = {
    ContinueConfigurationExists : ContinueConfigurationExists,
    ContinueConfigurationDoesNotExist : ContinueConfigurationDoesNotExist,
    WriteConfiguration : WriteConfiguration,
    ReadConfigurationAndContinue : ReadConfigurationAndContinue
};
