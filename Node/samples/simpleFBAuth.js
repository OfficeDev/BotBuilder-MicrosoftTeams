"use strict";
exports.__esModule = true;
var builder = require("botbuilder");
var restify = require("restify");
var crypto = require("crypto");
var request = require("request");
var SimpleFBAuth = /** @class */ (function () {
    function SimpleFBAuth(server) {
        var _this = this;
        this.userIdFacebookTokenCache = {};
        server.use(restify.queryParser());
        server.get(SimpleFBAuth.AuthStartPath + '/:userId', function (req, res, next) { return _this.authStart(req, res, next); });
        server.get(SimpleFBAuth.AuthCallbackPath, function (req, res, next) { return _this.authCallback(req, res, next); });
        server.get(SimpleFBAuth.AuthStartOAuthPath, function (req, res, next) { return _this.authStartOAuth(req, res, next); });
    }
    SimpleFBAuth.create = function (server, connector, settings) {
        if (!SimpleFBAuth.instance) {
            SimpleFBAuth.instance = new SimpleFBAuth(server);
        }
        SimpleFBAuth.instance.connector = connector;
        SimpleFBAuth.instance.settings = settings;
        return SimpleFBAuth.instance;
    };
    SimpleFBAuth.prototype.botSignIn = function (session) {
        var _this = this;
        var userId = session.message.address.user.id;
        var issueNewCard = function () {
            var authUrl = _this.settings.baseUrl + SimpleFBAuth.AuthStartPath + '/' + userId;
            var card = new builder.SigninCard(session).text('Sign in Facebook app').button('Login', authUrl);
            var msg = new builder.Message(session).attachments([card]);
            session.send(msg);
            session.endDialog();
        };
        if (this.userIdFacebookTokenCache[userId]) {
            // Use cached token
            var token = this.userIdFacebookTokenCache[userId];
            // Send a thumbnail card with user's FB profile
            this.CreateFBProfileCard(token, function (card) {
                if (card) {
                    var msg = new builder.Message(session)
                        .text('Cached credential is found. Use cached token to fetch info.')
                        .attachments([card]);
                    session.send(msg);
                    session.endDialog();
                }
                else {
                    // Token is invalid to fetch info (i.e., expired)
                    issueNewCard();
                }
            });
        }
        else {
            // No token cached: issue a new Signin card
            issueNewCard();
        }
    };
    SimpleFBAuth.prototype.botSignOut = function (session) {
        var userId = session.message.address.user.id;
        delete this.userIdFacebookTokenCache[userId];
        var msg = new builder.Message(session).text('Your cached credential has been removed.');
        session.send(msg);
        session.endDialog();
    };
    SimpleFBAuth.prototype.verifySigninState = function (event, query, callback) {
        var _this = this;
        var sendMessage = function (text, card) {
            var msg = new builder.Message().address(event.address);
            if (text) {
                msg.text(text);
            }
            if (card) {
                msg.attachments([card]);
            }
            _this.connector.send([msg.toMessage()], null);
        };
        // Decrypt state string to get code and original userId & channelId
        var state = this.decryptState(query.state);
        var trustableUserId = event.address.user.id;
        var trustableChannelId = event.sourceEvent.channel && event.sourceEvent.channel.id;
        var invalidUserId = state.userId !== trustableUserId;
        var invalidChannelId = state.channelId && trustableChannelId && state.channelId !== trustableChannelId;
        // Verify userId & channelId
        if (invalidUserId || invalidChannelId) {
            sendMessage('Unauthorized: User ID verification failed. Please try again.');
            callback(new Error('User ID verification failed'), null, 401);
            return;
        }
        else {
            // Prepare FB OAuth request
            var fbAppId = this.settings.fbAppClientId;
            var fbOAuthRedirectUrl = this.settings.baseUrl + SimpleFBAuth.AuthCallbackPath;
            var fbAppSecret = this.settings.fbAppClientSecret;
            var fbOAuthTokenUrl = 'https://graph.facebook.com/v2.10/oauth/access_token';
            var fbOAuthTokenParams = "?client_id=" + fbAppId + "&redirect_uri=" + fbOAuthRedirectUrl + "&client_secret=" + fbAppSecret + "&code=" + state.accessCode;
            // Use access code to exchange FB token
            request.get(fbOAuthTokenUrl + fbOAuthTokenParams, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var tokenObj = JSON.parse(body);
                    // Update cache
                    var fbToken = tokenObj['access_token'];
                    _this.userIdFacebookTokenCache[trustableUserId] = fbToken;
                    // Send a thumbnail card with user's FB profile
                    _this.CreateFBProfileCard(fbToken, function (card) {
                        if (card) {
                            sendMessage(null, card);
                            callback(null, null, 200);
                            return;
                        }
                        else {
                            sendMessage('Could not fetch your facebook info. Please try again later.');
                            callback(new Error('Facebook API call failed'), null, 500);
                            return;
                        }
                    });
                }
                else {
                    sendMessage('Facebook token update failed. Please try again later.');
                    callback(new Error('Facebook token update failed'), null, 500);
                    return;
                }
            });
        }
    };
    SimpleFBAuth.prototype.authStart = function (req, res, next) {
        var userId = req.params.userId;
        var authUrl = this.settings.baseUrl + SimpleFBAuth.AuthStartOAuthPath;
        var body = "\n      <html>\n        <head>\n          <script src='" + SimpleFBAuth.TeamsSDK + "'></script>\n        </head>\n        <body>\n          <script>\n            microsoftTeams.initialize();\n            microsoftTeams.getContext((context) => {\n              //- Save user and channel id to cookie\n              document.cookie = 'userId=' + '" + userId + "' + '; Path=/';\n              if (context.channelId) {\n                document.cookie = 'channelId=' + context.channelId + ';Path=/';\n              } else {\n                document.cookie = 'channelId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';\n              }\n              window.location = '" + authUrl + "';\n            });        \n          </script>\n        </body>\n      </html>\n    ";
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'text/html'
        });
        res.write(body);
        res.end();
    };
    SimpleFBAuth.prototype.authStartOAuth = function (req, res, next) {
        var fbAppId = this.settings.fbAppClientId;
        var fbOAuthRedirectUrl = this.settings.baseUrl + SimpleFBAuth.AuthCallbackPath;
        var fbAppScope = this.settings.fbAppScope;
        var fbOAuthUrl = "https://www.facebook.com/v2.10/dialog/oauth?client_id=" + fbAppId + "&redirect_uri=" + fbOAuthRedirectUrl + "&scope=" + fbAppScope;
        res.redirect(fbOAuthUrl, next);
    };
    SimpleFBAuth.prototype.authCallback = function (req, res, next) {
        var onAuthResultBody = function (succeeded, state) {
            return succeeded ? "\n      <html>\n        <head>\n          <script src='" + SimpleFBAuth.TeamsSDK + "'></script>        \n        </head>\n        <body>\n          <script>\n            microsoftTeams.initialize();\n            microsoftTeams.authentication.notifySuccess('" + state + "');\n          </script>\n        </body>\n      </html>\n      " : "\n      <html>\n        <head>\n          <script src='" + SimpleFBAuth.TeamsSDK + "'></script>\n        </head>\n        <body>\n          <script>\n            microsoftTeams.initialize();\n            microsoftTeams.authentication.notifyFailure();\n          </script>\n        </body>\n      </html>\n    ";
        };
        var body = '';
        if (req.query.code) {
            var cookie = this.parseCookie(req.headers.cookie);
            var state = {
                userId: cookie.userId,
                accessCode: req.query.code,
                channelId: cookie.channelId
            };
            body = onAuthResultBody(true, this.encryptState(state));
        }
        else {
            body = onAuthResultBody(false);
        }
        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(body),
            'Content-Type': 'text/html'
        });
        res.write(body);
        res.end();
    };
    SimpleFBAuth.prototype.CreateFBProfileCard = function (fbToken, callback) {
        // Use FB token to perform graph API to fetch user FB information
        var fbGraphUrl = function (endPoint, params) { return 'https://graph.facebook.com/' + endPoint + ("?access_token=" + fbToken + "&") + params; };
        request.get(fbGraphUrl('me', 'fields=name,id,email'), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var fbUser_1 = JSON.parse(body);
                request.get(fbGraphUrl(fbUser_1.id + "/picture", 'height=100'), function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var imgUrl = response.request.uri.href;
                        var card = new builder.ThumbnailCard()
                            .title(fbUser_1.name)
                            .subtitle(fbUser_1.email)
                            .images([new builder.CardImage().url(imgUrl)]);
                        callback(card);
                    }
                    else {
                        callback(null);
                    }
                });
            }
            else {
                callback(null);
            }
        });
    };
    SimpleFBAuth.prototype.parseCookie = function (rawCookie) {
        var cookies = {};
        if (rawCookie) {
            var c = rawCookie.split('; ');
            for (var i = c.length - 1; i >= 0; i--) {
                var v = c[i].split('=');
                cookies[v[0]] = v[1];
            }
        }
        return cookies;
    };
    SimpleFBAuth.prototype.encryptState = function (state) {
        var cipher = crypto.createCipher('aes192', this.settings.fbAppClientSecret);
        var encryptedState = cipher.update(JSON.stringify(state), 'utf8', 'base64');
        encryptedState += cipher.final('base64');
        return encryptedState;
    };
    SimpleFBAuth.prototype.decryptState = function (rawState) {
        var decipher = crypto.createDecipher('aes192', this.settings.fbAppClientSecret);
        var state = decipher.update(rawState, 'base64', 'utf8');
        state += decipher.final('utf8');
        var parsedState = JSON.parse(state);
        return parsedState;
    };
    // Endpoints used in this service
    SimpleFBAuth.AuthStartPath = "/auth/start";
    SimpleFBAuth.AuthStartOAuthPath = "/auth/oauth";
    SimpleFBAuth.AuthCallbackPath = "/auth/callback";
    SimpleFBAuth.TeamsSDK = 'https://statics.teams.cdn.office.net/sdk/v1.5.2/js/MicrosoftTeams.min.js';
    return SimpleFBAuth;
}());
exports.SimpleFBAuth = SimpleFBAuth;
