#!/usr/bin/env node

'use strict';

const fs = require('file-system');


function ContinueFileExists(filename, messageDoesNotExist, continueCallback) {
    fs.exists(filename, function(exists){
        if (exists) {
            continueCallback();
        } else {
            console.log(messageDoesNotExist);
        }
    });
}

function ContinueFileDoesNotExist(filename, messageExists, continueCallback) {
    fs.exists(filename, function(exists){
        if (exists) {
            console.log(messageExists);
        } else {
            continueCallback();
        }
    });
}

function WriteJsonFile(filename, jsonObj, messageError, messageSuccess) {
    fs.writeFile(filename, JSON.stringify(jsonObj), 'utf8',
        function(err) {
            if (err) {
                console.log(messageError, err);
            } else {
                console.log(messageSuccess);
            }
        });
}

function ReadJsonFileAndContinue(filename, messageError, continueCallback) {
    fs.readFile(filename, 
        function(err,content) {
            if(err) {
                console.log(messageError, err);
            } else {
                var jsonObj = JSON.parse(content);
                continueCallback(jsonObj);
            }
        })
}

module.exports = {
    ContinueFileExists : ContinueFileExists,
    ContinueFileDoesNotExist : ContinueFileDoesNotExist,
    WriteJsonFile : WriteJsonFile,
    ReadJsonFileAndContinue : ReadJsonFileAndContinue
};
