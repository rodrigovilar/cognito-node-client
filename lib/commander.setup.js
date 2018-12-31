#!/usr/bin/env node

'use strict';

const program = require('commander');
const registeruser = require('./registeruser');
const confirmuser = require('./confirmuser');
const changepassword = require('./changepassword');
const login = require('./login');
const logout = require('./logout');
const test = require('./test');

function Setup(version) {
    program.version(version);
    program.command('register').action(registeruser.RegisterUser);
    program.command('confirm').action(confirmuser.ConfirmUser);
    program.command('changePassword').action(changepassword.ChangePassword);
    program.command('login').action(login.Login);
    program.command('logout').action(logout.Logout);
    program.command('test').action(test.Test);
    // program.command('new <project>').action(newProjectCommand);
    
    program.parse(process.argv);
    
    /* No Command Specified */
    if (program.args.length === 0) { program.help(); }    
}

module.exports = {
    Setup : Setup
};
