/*-----------------------------------------------------------------------------
This Bot demonstrates how to use teams extension for a bot.

# RUN THE BOT:
    Run the bot from the command line using "node app.js" and then type
    "hello" to wake the bot up.
    
-----------------------------------------------------------------------------*/
"use strict";
exports.__esModule = true;
/// <reference path="./typings/index.d.ts" />
var util = require("util");
var restify = require("restify");
var builder = require("botbuilder");
var teams = require("botbuilder-teams");
// Put your registered bot here, to register bot, go to bot framework
// var appName: string = 'app name';
// var appId: string = 'app id';
// var appPassword: string = 'app password';
// var userId: string = 'user id';
// var tenantId: string = 'tenant id';
var appName = 'zel-bot-getcc';
var appId = '3ac5850f-8e82-430b-812c-bee26f5adf77';
var appPassword = 'OgFmsCEi7ydz7M11kFDTZrd';
var userId = 'e5ef3302-c442-4c3e-88ba-d4c5602b761a';
var tenantId = '72f988bf-86f1-41af-91ab-2d7cd011db47';
var server = restify.createServer();
server.listen(3978, function () {
    console.log('%s listening to %s', server.name, util.inspect(server.address()));
});
// Create chat bot 
var connector = new teams.TeamsChatConnector({
    appId: appId,
    appPassword: appPassword
});
// this will receive nothing, you can put your tenant id in the list to listen
connector.setAllowedTenants([]);
// this will reset and allow to receive from any tenants
connector.resetAllowedTenants();
server.post('/api/v1/bot/messages', connector.listen());
var bot = new builder.UniversalBot(connector);
bot.dialog('/', [
    function (session) {
        builder.Prompts.choice(session, "Choose an option:", 'Fetch channel list|Mention user|Start new 1 on 1 chat|Route message to general channel|FetchMemberList');
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('FetchChannelList');
                break;
            case 1:
                session.beginDialog('MentionUser');
                break;
            case 2:
                session.beginDialog('StartNew1on1Chat');
                break;
            case 3:
                session.beginDialog('RouteMessageToGeneral');
                break;
            case 4:
                session.beginDialog('FetchMemberList');
                break;
            default:
                session.endDialog();
                break;
        }
    }
]);
bot.on('conversationUpdate', function (message) {
    var event = teams.TeamsMessage.getConversationUpdateData(message);
});
bot.dialog('FetchChannelList', function (session) {
    var teamId = session.message.sourceEvent.team.id;
    connector.fetchChannelList(session.message.address.serviceUrl, teamId, function (err, result) {
        if (err) {
            session.endDialog('There is some error');
        }
        else {
            session.endDialog('%s', JSON.stringify(result));
        }
    });
});
bot.dialog('FetchMemberList', function (session) {
    var conversationId = session.message.address.conversation.id;
    connector.fetchMemberList(session.message.address.serviceUrl, conversationId, teams.TeamsMessage.getTenantId(session.message), function (err, result) {
        if (err) {
            session.endDialog('There is some error');
        }
        else {
            session.endDialog('%s', JSON.stringify(result));
        }
    });
});
bot.dialog('MentionUser', function (session) {
    // user name/user id
    var toMention = {
        name: 'Bill Zeng',
        id: userId
    };
    var msg = new teams.TeamsMessage(session).text(teams.TeamsMessage.getTenantId(session.message));
    var mentionedMsg = msg.addMentionToText(toMention);
    session.send(mentionedMsg);
});
bot.dialog('StartNew1on1Chat', function (session) {
    var address = {
        channelId: 'msteams',
        user: { id: userId },
        channelData: {
            tenant: {
                id: tenantId
            }
        },
        bot: {
            id: appId,
            name: appName
        },
        serviceUrl: session.message.address.serviceUrl,
        useAuth: true
    };
    bot.beginDialog(address, '/');
});
bot.dialog('RouteMessageToGeneral', function (session) {
    // user name/user id
    var toMention = {
        name: 'Bill Zeng',
        id: userId
    };
    var msg = new teams.TeamsMessage(session).text(teams.TeamsMessage.getTenantId(session.message));
    var mentionedMsg = msg.addMentionToText(toMention);
    var generalMessage = mentionedMsg.routeReplyToGeneralChannel();
    session.send(generalMessage);
});
// example for compose extension
var composeExtensionHandler = function (event, query, callback) {
    // parameters should be identical to manifest
    if (query.parameters[0].name != "sample-parameter") {
        return callback(new Error("Parameter mismatch in manifest"), null, 500);
    }
    var logo = {
        alt: "logo",
        url: "http://logo.jpg",
        tap: null
    };
    try {
        var card = new builder.ThumbnailCard()
            .title("sample title")
            .images([logo])
            .text("sample text")
            .buttons([
            {
                type: "openUrl",
                title: "Go to somewhere",
                value: "https://url.com"
            }
        ]);
        var response = teams.ComposeExtensionResponse.result("list").attachments([card.toAttachment()]);
        callback(null, response.toResponse(), 200);
    }
    catch (e) {
        callback(e, null, 500);
    }
};
connector.onQuery('composeExtensionHandler', composeExtensionHandler);
