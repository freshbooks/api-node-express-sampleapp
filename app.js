const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs')
const request = require('request');
require('dotenv').config();

const port = 5000;
const baseUrl = "https://api.freshbooks.com";
const clientSecret = process.env.CLIENT_SECRET;
const clientId = process.env.CLIENT_ID;
const redirectURI = process.env.REDIRECT_URL;

const serverKey = fs.readFileSync(__dirname + '/server.key');
const serverCert = fs.readFileSync(__dirname + '/server.crt');
let options = {
  key: serverKey,
  cert: serverCert
};

const app = express();
app.use(bodyParser.json());

app.get('/TestAuthentication/', function(req, res) {
    let authCode = req.query.code;
    let authData = { 
        "grant_type": "authorization_code",
        "client_secret": clientSecret,
        "code": authCode,
        "client_id": clientId,
        "redirect_uri": redirectURI
    };
    let oauthUrl = baseUrl + '/auth/oauth/token';
    oauthRequest = request.post(oauthUrl, {json:authData}, function(err,oauthResponse,oauthBody){
        if (err) {
            console.error(err);
            res.send(err);
        }
        let meOptions = {
            headers: {
                'Authorization': 'Bearer ' + oauthBody.access_token
            }
        };
        let meUrl = baseUrl + "/auth/api/v1/users/me";
        meRequest = request.get(meUrl, meOptions, function(meErr, meResponse, meBody){
            if(meErr){
                console.error(meErr)
                res.send(err)
            }
            meBodyJson = JSON.parse(meBody);
            meProfile = meBodyJson.response.profile;
            res.send("You have successfully logged in for " + meProfile.first_name + " " + meProfile.last_name);
        });
    });
});

const httpsServer = https.createServer(options, app)
httpsServer.listen(port, () => {
    console.log("server starting on port : " + port)
  });