# cognito-node-client
A node client to authenticate into Amazon Cognito


This project is based on Amazon's Tutorial: Integrating User Pools for JavaScript Apps https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-integrating-user-pools-javascript.html#tutorial-integrating-user-pools-confirm-users-javascript

The goal is use Cognito User pools to sign up from a Node client and invoke API Gateways endpoints.

The following instructions shows how to create a user pool, interact with Cognito through its API, interact with Cognito through a CLI and to invoke API Gateways endpoints.

## Create a User pool for your app
1. Sign in to the [Amazon Cognito console](https://console.aws.amazon.com/cognito/home)
2. Choose Manage your User Pools / Create a User Pool
3. Type pool name and choose Review defaults
4. From the left navigation pane, choose Attributes

   After seting email, phone number and given name attributes as required and after users in the pool verifying their email addresses, they can sign in with their usernames or email addresses

5. Choose Next step until App clients
6. Choose Add an app client
   1. Set App client name, uncheck Generate client secret and choose Create app client
7. Choose Next step until Review
8. Choose Create pool
9. Note necessary ids
   1. Note Pool Id
   2. From the left navigation pane, choose App clients and note App client id

## Interact with Cognito through its API

### Register user
1. Create a config.json file with the following structure:

```javascript
{
    "userPoolId" : "us-east-1_XXXXXXXXX",
    "clientId" : "xxxxxxxxxxxxxxxxxxxxxxxx",
    "username" : "example",
    "password" : "Passw0rd!",
    "verificationCode" : "123456",
    "attributes" : {
        "given_name" : "Example user",
        "email" :  "example@user.com",
        "phone_number" : "+1234567890"
    }
}
```

2. Invoke the RegisterUser function:

```javascript
const userpool = require('./lib/userpool');
const config = require('./config.json');

userpool.RegisterUser(config.userPoolId, config.clientId, config.username, config.password, config.attributes, 
    function(cognitoUser) {
        console.log('User name is ' + cognitoUser.getUsername());
    },
    function(err) {
        console.log('Sing up error: ', err);
    });
```

3. The configured email (e.g. `example@user.com`) will receive the verification code that should be writen on config.json file
4. Invoke the ConfirmUser function:

```javascript
userpool.ConfirmUser(config.userPoolId, config.clientId, config.username, config.verificationCode, 
    function(result) {
        console.log('Confirm user result:', result);
    },
    function(err) {
        console.log('Confirm user error: ', err);
    });
```

5. On Amazon Cognito console, open the User pool / General Settings / Users and Groups
6. Check the users status, should be `CONFIRMED` 

### Log in
1. Invoke the Login function

```javascript
userpool.Login(config.userPoolId, config.clientId, config.username, config.password,
    function (result) {
        console.log('access token + ' + result.getAccessToken().getJwtToken());
        console.log('id token + ' + result.getIdToken().getJwtToken());
        console.log('refresh token + ' + result.getRefreshToken().getToken());
    },
    function(err) {
        console.log('Authentication error:', err);
    });
```

### Log out
1. Invoke the Logout function

```javascript
userpool.Logout(config.userPoolId, config.clientId, config.userName,
    function() {
        console.log('User logged out');
    });
```
## Interact with Cognito through a CLI

1. Create a lib/cli.js file to set up commander lib with this project's commands

```javascript
#!/usr/bin/env node

'use strict';

const commander = require('./commander.setup');
commander.Setup('0.1.0');
```

2. Set up a binary in `package.json`

```javascript
  "bin": {
    "myapp": "lib/cli.js"
  },
```

3. Invoke the binary commands:

```
myapp register
myapp confirm
myapp login
myapp logout
```

## Invoke API Gateways endpoints

TO DO