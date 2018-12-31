'use strict';

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
global.fetch = require('node-fetch');

function RegisterUser(userPoolId, clientId, userName, password, attributes, onSucess, onError){
    const userPool = createUserPoolData(userPoolId, clientId);

    var attributeList = [];
    for (var key in attributes) {
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name: key, Value: attributes[key]}));
    }

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

function LoginChangingPassword(userPoolId, clientId, userName, oldPassword, newPassword, givenName, onSuccess, onError) {
    var cognitoUser = createCognitoUser(userPoolId, clientId, userName);

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : userName,
        Password : oldPassword,
    });
    
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: onSuccess,
        onFailure: onError,
        newPasswordRequired: function(userAttributes, requiredAttributes) {
            delete userAttributes.email_verified;
            delete userAttributes.phone_number_verified;
            userAttributes.given_name = givenName
            cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
        }  
    });
}

function Logout(userPoolId, clientId, userName, callback) {
    var cognitoUser = createCognitoUser(userPoolId, clientId, userName);
    cognitoUser.signOut();
    callback();
}

module.exports = {
    RegisterUser : RegisterUser,
    ConfirmUser: ConfirmUser,
    Login: Login,
    LoginChangingPassword: LoginChangingPassword,
    Logout : Logout
};
