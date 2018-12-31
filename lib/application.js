#!/usr/bin/env node

'use strict';

const customFS = require('./custom.fs');

const filename = 'application.json';

function LoadData(continueCallback) {
    customFS.ContinueFileExists(filename, 'Application data not set', function() {
        customFS.ReadJsonFileAndContinue(filename, 'Failed to load application.json file', function(jsonObj) {
            if (jsonObj.userPoolId && jsonObj.clientId) {
                continueCallback(jsonObj);
            } else {
                console.log('userPoolId and clientId properties must be set in application.json');
            }
        });
    });
}

module.exports = {
    LoadData : LoadData
};
