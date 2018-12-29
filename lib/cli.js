#!/usr/bin/env node

'use strict';

const program = require('commander');
const registeruser = require('./registeruser');
const confirmuser = require('./confirmuser');
const login = require('./login');

program.version('0.1.0');
program.command('register').action(registeruser.RegisterUser);
program.command('confirm').action(confirmuser.ConfirmUser);
program.command('login').action(login.Login);
// program.command('logout').action(logoutCommand);
// program.command('new <project>').action(newProjectCommand);

program.parse(process.argv);

/* No Command Specified */
if (program.args.length === 0) { program.help(); }
