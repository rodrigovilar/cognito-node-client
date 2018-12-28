const userpool = require('./lib/userpool');
const config = require('./config.json');


userpool.RegisterUser(config.userPoolId, config.clientId, config.username, config.password, config.attributes, 
    function(cognitoUser) {
        console.log('User name is ' + cognitoUser.getUsername());
    },
    function(err) {
        console.log('Sing up error: ', err);
    });

userpool.ConfirmUser(config.userPoolId, config.clientId, config.username, config.verificationCode, 
    function(result) {
        console.log('Confirm user result:', result);
    },
    function(err) {
        console.log('Confirm user error: ', err);
    });

userpool.Login(config.userPoolId, config.clientId, config.username, config.password,
    function (result) {
        console.log('access token + ' + result.getAccessToken().getJwtToken());
        console.log('id token + ' + result.getIdToken().getJwtToken());
        console.log('refresh token + ' + result.getRefreshToken().getToken());
    },
    function(err) {
        console.log('Authentication error:', err);
    });
