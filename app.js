const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs')
const request = require('request');

const port = 5000
const baseUrl = "https://api.freshbooks.com";
const clientSecret = ""
const clientId = ""
const redirectURI = ""

var serverKey = fs.readFileSync(__dirname + '/server.key');
var serverCert = fs.readFileSync(__dirname + '/server.crt');
var options = {
  key: serverKey,
  cert: serverCert
};

const app = express();
app.use(bodyParser.json());

// remove this before committing
app.get('/', (req, res) => {
    res.send('Now using https..');
 });

app.get('/TestAuthentication/', function(req, res) {
    let authCode = req.query.code;
    authData = { 
        "grant_type": "authorization_code",
        "client_secret": clientSecret,
        "code": authCode,
        "client_id": clientId,
        "redirect_uri": redirectURI
    };
    oauthUrl = baseUrl + '/auth/oauth/token';
    oauthRequest = request.post(oauthUrl, {json:authData}, function(err,httpResponse,oauthBody){
        if (err) {
            console.error(err);
            res.send(err);
        }
        // console.log(`statusCode: ${httpResponse.statusCode}`)
        // console.log(oauthBody)
        var meOptions = {
            headers: {
                'Authorization': 'Bearer ' + oauthBody.access_token
            }
        };
        meUrl = baseUrl + "/auth/api/v1/users/me";
;        const meRequest = request.get(meUrl, meOptions, function(meErr, meResponse, meBody){
            if(meErr){
                console.error(meErr)
                res.send(err)
            }
            // console.log(`statusCode: ${meResponse.statusCode}`);
            meBodyJson = JSON.parse(meBody);
            meProfile = meBodyJson.response.profile;
            // console.log(meProfile)
            res.send("You have successfully logged in for " + meProfile.first_name + " " + meProfile.last_name);
        });
    });
});

const httpsServer = https.createServer(options, app)
httpsServer.listen(port, () => {
    console.log("server starting on port : " + port)
  });