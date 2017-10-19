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
var simpleFBAuth_1 = require("./simpleFBAuth");
// Put your registered bot here, to register bot, go to bot framework
var appName = 'app name';
var appId = 'app id';
var appPassword = 'app password';
var userId = 'user id';
var tenantId = 'tenant id';
// Create chat bot 
var connector = new teams.TeamsChatConnector({
    appId: appId,
    appPassword: appPassword
});
var server = restify.createServer();
server.listen(3978, function () {
    console.log('%s listening to %s', server.name, util.inspect(server.address()));
});
// this will receive nothing, you can put your tenant id in the list to listen
connector.setAllowedTenants([]);
// this will reset and allow to receive from any tenants
connector.resetAllowedTenants();
server.post('/api/v1/bot/messages', connector.listen());
var bot = new builder.UniversalBot(connector);
// create the bot auth agent
var botSigninSettings = {
    baseUrl: 'https://...',
    fbAppClientId: 'fb app id',
    fbAppClientSecret: 'fb app secret',
    fbAppScope: 'public_profile,email,user_friends' // put Facebook access scope
};
var botAuth = simpleFBAuth_1.SimpleFBAuth.create(server, connector, botSigninSettings);
// Strip bot at mention text, set text property to text without specific Bot at mention, find original text in textWithBotMentions
// e.g. original text "<at>zel-bot-1</at> hello please find <at>Bot</at>" and zel-bot-1 is the Bot we at mentions. 
// Then it text would be "hello please find <at>Bot</at>", the original text could be found at textWithBotMentions property.
// This is to resolve inaccuracy for regex or LUIS scenarios.
var stripBotAtMentions = new teams.StripBotAtMentions();
bot.use(stripBotAtMentions);
bot.dialog('/', [
    function (session) {
        builder.Prompts.choice(session, "Choose an option:", 'Fetch channel list|Mention user|Start new 1 on 1 chat|Route message to general channel|FetchMemberList|Send O365 actionable connector card|FetchTeamInfo(at Bot in team)|Start New Reply Chain (in channel)|Issue a Signin card to sign in a Facebook app|Logout Facebook app and clear cached credentials|MentionChannel|MentionTeam|NotificationFeed');
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
            case 5:
                session.beginDialog('SendO365Card');
                break;
            case 6:
                session.beginDialog('FetchTeamInfo');
                break;
            case 7:
                session.beginDialog('StartNewReplyChain');
                break;
            case 8:
                session.beginDialog('Signin');
                break;
            case 9:
                session.beginDialog('Signout');
                break;
            case 10:
                session.beginDialog('MentionChannel');
                break;
            case 11:
                session.beginDialog('MentionTeam');
                break;
            case 12:
                session.beginDialog('NotificationFeed');
                break;
            default:
                session.endDialog();
                break;
        }
    }
]);
bot.on('conversationUpdate', function (message) {
    console.log(message);
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
    connector.fetchMembers(session.message.address.serviceUrl, conversationId, function (err, result) {
        if (err) {
            session.endDialog('There is some error');
        }
        else {
            session.endDialog('%s', JSON.stringify(result));
        }
    });
});
bot.dialog('FetchTeamInfo', function (session) {
    var teamId = session.message.sourceEvent.team.id;
    connector.fetchTeamInfo(session.message.address.serviceUrl, teamId, function (err, result) {
        if (err) {
            session.endDialog('There is some error');
        }
        else {
            session.endDialog('%s', JSON.stringify(result));
        }
    });
});
bot.dialog('StartNewReplyChain', function (session) {
    var channelId = session.message.sourceEvent.channel.id;
    var message = new teams.TeamsMessage(session).text(teams.TeamsMessage.getTenantId(session.message));
    connector.startReplyChain(session.message.address.serviceUrl, channelId, message, function (err, address) {
        if (err) {
            console.log(err);
            session.endDialog('There is some error');
        }
        else {
            console.log(address);
            var msg = new teams.TeamsMessage(session).text("this is a reply message.").address(address);
            session.send(msg);
            session.endDialog();
        }
    });
});
bot.dialog('MentionUser', function (session) {
    // user name/user id
    var user = {
        id: userId,
        name: 'Bill Zeng'
    };
    var mention = new teams.UserMention(user);
    var msg = new teams.TeamsMessage(session).addEntity(mention).text(mention.text + ' ' + teams.TeamsMessage.getTenantId(session.message));
    session.send(msg);
    session.endDialog();
});
bot.dialog('MentionChannel', function (session) {
    // user name/user id
    var channelId = null;
    if (session.message.address.conversation.id) {
        var splitted = session.message.address.conversation.id.split(';', 1);
        channelId = splitted[0];
    }
    var teamId = session.message.sourceEvent.team.id;
    connector.fetchChannelList(session.message.address.serviceUrl, teamId, function (err, result) {
        if (err) {
            session.endDialog('There is some error');
        }
        else {
            var channelName = null;
            for (var i in result) {
                var channelInfo = result[i];
                if (channelId == channelInfo['id']) {
                    channelName = channelInfo['name'] || 'General';
                    break;
                }
            }
            var channel = {
                id: channelId,
                name: channelName
            };
            var mention = new teams.ChannelMention(channel);
            var msg = new teams.TeamsMessage(session).addEntity(mention).text(mention.text + ' This is a test message to at mention the channel.');
            session.send(msg);
            session.endDialog();
        }
    });
});
bot.dialog('MentionTeam', function (session) {
    // user name/user id
    var channelId = null;
    if (session.message.address.conversation.id) {
        var splitted = session.message.address.conversation.id.split(';', 1);
        channelId = splitted[0];
    }
    var team = {
        id: channelId,
        name: 'All'
    };
    var mention = new teams.TeamMention(team);
    var msg = new teams.TeamsMessage(session).addEntity(mention).text(mention.text + ' This is a test message to at mention the team. ');
    session.send(msg);
    session.endDialog();
});
bot.dialog('NotificationFeed', function (session) {
    // user name/user id
    var msg = new teams.TeamsMessage(session).text("This is a test notification message.");
    // This is a dictionary which could be merged with other properties
    var alertFlag = teams.TeamsMessage.AlertFlag;
    var notification = msg.sourceEvent({
        '*': alertFlag
    });
    // this should trigger an alert
    session.send(notification);
    session.endDialog();
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
    session.endDialog();
});
bot.dialog('SendO365Card', function (session) {
    // multiple choice examples
    var actionCard1 = new teams.O365ConnectorCardActionCard(session)
        .id("card-1")
        .name("Multiple Choice")
        .inputs([
        new teams.O365ConnectorCardMultichoiceInput(session)
            .id("list-1")
            .title("Pick multiple options")
            .isMultiSelect(true)
            .isRequired(true)
            .style('expanded')
            .choices([
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice 1").value("1"),
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice 2").value("2"),
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice 3").value("3")
        ]),
        new teams.O365ConnectorCardMultichoiceInput(session)
            .id("list-2")
            .title("Pick multiple options")
            .isMultiSelect(true)
            .isRequired(true)
            .style('compact')
            .choices([
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice 4").value("4"),
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice 5").value("5"),
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice 6").value("6")
        ]),
        new teams.O365ConnectorCardMultichoiceInput(session)
            .id("list-3")
            .title("Pick an options")
            .isMultiSelect(false)
            .style('expanded')
            .choices([
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice a").value("a"),
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice b").value("b"),
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice c").value("c")
        ]),
        new teams.O365ConnectorCardMultichoiceInput(session)
            .id("list-4")
            .title("Pick an options")
            .isMultiSelect(false)
            .style('compact')
            .choices([
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice x").value("x"),
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice y").value("y"),
            new teams.O365ConnectorCardMultichoiceInputChoice(session).display("Choice z").value("z")
        ])
    ])
        .actions([
        new teams.O365ConnectorCardHttpPOST(session)
            .id("card-1-btn-1")
            .name("Send")
            .body(JSON.stringify({
            list1: '{{list-1.value}}',
            list2: '{{list-2.value}}',
            list3: '{{list-3.value}}',
            list4: '{{list-4.value}}'
        }))
    ]);
    // text input examples
    var actionCard2 = new teams.O365ConnectorCardActionCard(session)
        .id("card-2")
        .name("Text Input")
        .inputs([
        new teams.O365ConnectorCardTextInput(session)
            .id("text-1")
            .title("multiline, no maxLength")
            .isMultiline(true),
        new teams.O365ConnectorCardTextInput(session)
            .id("text-2")
            .title("single line, no maxLength")
            .isMultiline(false),
        new teams.O365ConnectorCardTextInput(session)
            .id("text-3")
            .title("multiline, max len = 10, isRequired")
            .isMultiline(true)
            .isRequired(true)
            .maxLength(10),
        new teams.O365ConnectorCardTextInput(session)
            .id("text-4")
            .title("single line, max len = 10, isRequired")
            .isMultiline(false)
            .isRequired(true)
            .maxLength(10)
    ])
        .actions([
        new teams.O365ConnectorCardHttpPOST(session)
            .id("card-2-btn-1")
            .name("Send")
            .body(JSON.stringify({
            text1: '{{text-1.value}}',
            text2: '{{text-2.value}}',
            text3: '{{text-3.value}}',
            text4: '{{text-4.value}}'
        }))
    ]);
    // date / time input examples
    var actionCard3 = new teams.O365ConnectorCardActionCard(session)
        .id("card-3")
        .name("Date Input")
        .inputs([
        new teams.O365ConnectorCardDateInput(session)
            .id("date-1")
            .title("date with time")
            .includeTime(true)
            .isRequired(true),
        new teams.O365ConnectorCardDateInput(session)
            .id("date-2")
            .title("date only")
            .includeTime(false)
            .isRequired(false)
    ])
        .actions([
        new teams.O365ConnectorCardHttpPOST(session)
            .id("card-3-btn-1")
            .name("Send")
            .body(JSON.stringify({
            date1: '{{date-1.value}}',
            date2: '{{date-2.value}}'
        }))
    ]);
    var section = new teams.O365ConnectorCardSection(session)
        .markdown(true)
        .title("**section title**")
        .text("section text")
        .activityTitle("activity title")
        .activitySubtitle("activity sbtitle")
        .activityImage("http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg")
        .activityText("activity text")
        .facts([
        new teams.O365ConnectorCardFact(session).name("Fact name 1").value("Fact value 1"),
        new teams.O365ConnectorCardFact(session).name("Fact name 2").value("Fact value 2"),
    ])
        .images([
        new teams.O365ConnectorCardImage(session).title("image 1").image("http://connectorsdemo.azurewebsites.net/images/MicrosoftSurface_024_Cafe_OH-06315_VS_R1c.jpg"),
        new teams.O365ConnectorCardImage(session).title("image 2").image("http://connectorsdemo.azurewebsites.net/images/WIN12_Scene_01.jpg"),
        new teams.O365ConnectorCardImage(session).title("image 3").image("http://connectorsdemo.azurewebsites.net/images/WIN12_Anthony_02.jpg")
    ]);
    var card = new teams.O365ConnectorCard(session)
        .summary("O365 card summary")
        .themeColor("#E67A9E")
        .title("card title")
        .text("card text")
        .sections([section])
        .potentialAction([
        actionCard1,
        actionCard2,
        actionCard3,
        new teams.O365ConnectorCardViewAction(session)
            .name('View Action')
            .target('http://microsoft.com'),
        new teams.O365ConnectorCardOpenUri(session)
            .id('open-uri')
            .name('Open Uri')["default"]('http://microsoft.com')
            .iOS('http://microsoft.com')
            .android('http://microsoft.com')
            .windowsPhone('http://microsoft.com')
    ]);
    var msg = new teams.TeamsMessage(session)
        .summary("A sample O365 actionable card")
        .attachments([card]);
    session.send(msg);
    session.endDialog();
});
// example for o365 connector actionable card
var o365CardActionHandler = function (event, query, callback) {
    var userName = event.address.user.name;
    var body = JSON.parse(query.body);
    var msg = new builder.Message()
        .address(event.address)
        .summary("Thanks for your input!")
        .textFormat("xml")
        .text("<h2>Thanks, " + userName + "!</h2><br/><h3>Your input action ID:</h3><br/><pre>" + query.actionId + "</pre><br/><h3>Your input body:</h3><br/><pre>" + JSON.stringify(body, null, 2) + "</pre>");
    connector.send([msg.toMessage()], function (err, address) {
    });
    callback(null, null, 200);
};
connector.onO365ConnectorCardAction(o365CardActionHandler);
// example for signin card
bot.dialog('Signin', function (session) { return botAuth.botSignIn(session); });
bot.dialog('Signout', function (session) { return botAuth.botSignOut(session); });
connector.onSigninStateVerification(function (event, query, callback) { return botAuth.verifySigninState(event, query, callback); });
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
