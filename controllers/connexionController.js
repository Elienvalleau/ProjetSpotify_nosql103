const express = require('express');
const router = express.Router();
const pug = require('pug');
const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const client_id = '2fa324d1913044c9a359f9ec11854199';
const secret = require('./secret');
const client_secret = secret.client_secret
const redirect_uri = 'http://localhost:8888/main';

const generateRandomString = function(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

let stateKey = 'spotify_auth_state';


router.use(express.static(__dirname + '../views'))
    .use(cookieParser());

router.get('/', (req, res) => {
    const tplIndexPath = './views/index.pug';
    const renderIndex = pug.compileFile(tplIndexPath);
    const html = renderIndex({
        title: 'Connection',
        name: 'connect yourself'
    });
    res.writeHead(200, { 'Content-Type': 'text/html' } );
    res.write(html);
    res.end();
});

router.get('/login', function(req, res) {

    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    let scope = 'user-read-private user-read-email user-modify-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

router.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    let code = req.query.code || null;
    console.log('code ' + code);
    let state = req.query.state || null;
    console.log('state ' + state);
    let storedState = req.cookies ? req.cookies[stateKey] : null;
    console.log('storedstate ' + storedState);

    if (state === null || state !== storedState) {
        console.log('state mismatch')
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                let access_token = body.access_token,
                    refresh_token = body.refresh_token;

                let options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function(error, response, body) {
                    console.log('body.access_token ' + body.access_token);
                });

                // we can also pass the token to the browser to make requests from there
                /*res.redirect('/#' +
                  querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                  }));*/
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

router.get('/refresh_token', function(req, res) {

    // requesting access token from refresh token
    let refresh_token = req.query.refresh_token;
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});


module.exports = router;
