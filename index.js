// This code is based on https://docs.aws.amazon.com/cognito/latest/developerguide/tutorial-integrating-user-pools-javascript.html#tutorial-integrating-user-pools-confirm-users-javascript

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');

var config = require('./config.json');

function createCognitoUserAttribute(attributeList, name, value) {
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: name, Value: value})); 
}

function RegisterUser(userPoolId, clientId, userName, password, attributeList, onSucess, onError){
    const userPool = createUserPoolData(userPoolId, clientId);
    userPool.signUp(userName, password, attributeList, null, function(err, result){
        if (err) {
            onError(err);

        } else {
            onSucess(result.user);
        }
    });
}

function createUserPoolData(userPoolId, clientId) {
    const poolData = {    
        UserPoolId : userPoolId,
        ClientId : clientId
        }; 
    
    return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}

function createCognitoUser(userPoolId, clientId, userName) {
    const userPool = createUserPoolData(userPoolId, clientId);

    const userData = {
        Username : userName,
        Pool : userPool
    };
    
    return new AmazonCognitoIdentity.CognitoUser(userData);

}

function ConfirmUser(userPoolId, clientId, userName, code, onSuccess, onError){
    var cognitoUser = createCognitoUser(userPoolId, clientId, userName);
    cognitoUser.confirmRegistration(code, true, function(err, result) {
        if (err) {
            onError(err);
        } else {
            onSuccess(result);
        }
    });
}

function Login(userPoolId, clientId, userName, password, onSuccess, onError) {
    var cognitoUser = createCognitoUser(userPoolId, clientId, userName);

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : userName,
        Password : password,
    });
    
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: onSuccess,
        onFailure: onError  
    });
}


var attributeList = [];
createCognitoUserAttribute(attributeList, "name", config.name);
createCognitoUserAttribute(attributeList, "birthdate", config.birthdate);
createCognitoUserAttribute(attributeList, "email", config.email);
createCognitoUserAttribute(attributeList, "phone_number", config.phone_number);

RegisterUser(config.userPoolId, config.clientId, config.email, config.password, attributeList, 
    function(cognitoUser) {
        console.log('user name is ' + cognitoUser.getUsername());
    },
    function(err) {
        console.log('Sing up error: ', err);
    });

ConfirmUser(config.userPoolId, config.clientId, config.email, config.verificationCode, 
    function(result) {
        console.log('Confirm user result:', result);
    },
    function(err) {
        console.log('Confirm user error: ', err);
    });

Login(config.userPoolId, config.clientId, config.email, config.password,
    function (result) {
        console.log('access token + ' + result.getAccessToken().getJwtToken());
        console.log('id token + ' + result.getIdToken().getJwtToken());
        console.log('refresh token + ' + result.getRefreshToken().getToken());
    },
    function(err) {
        console.log('Authentication error:', err);
    });
