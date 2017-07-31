/*-----------------------------------------------------------------------------
This Bot demonstrates how to use teams extension for a bot. 

# RUN THE BOT:
    Run the bot from the command line using "node app.js" and then type 
    "hello" to wake the bot up.
    
-----------------------------------------------------------------------------*/

/// <reference path="./typings/index.d.ts" />

import * as util from 'util';
import * as restify from 'restify';
import * as builder from 'botbuilder';
import * as https from 'https';
import * as teams from 'botbuilder-teams';

// Put your registered bot here, to register bot, go to bot framework
var appName: string = 'app name';
var appId: string = 'app id';
var appPassword: string = 'app password';
var userId: string = 'user id';
var tenantId: string = 'tenant id';

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

// Strip bot at mention text, set text property to text without specific Bot at mention, find original text in textWithBotMentions
// e.g. original text "<at>zel-bot-1</at> hello please find <at>Bot</at>" and zel-bot-1 is the Bot we at mentions. 
// Then it text would be "hello please find <at>Bot</at>", the original text could be found at textWithBotMentions property.
// This is to resolve inaccuracy for regex or LUIS scenarios.
var stripBotAtMentions = new teams.StripBotAtMentions();
bot.use(stripBotAtMentions);

bot.dialog('/', [
  function (session) {
    builder.Prompts.choice(session, "Choose an option:", 'Fetch channel list|Mention user|Start new 1 on 1 chat|Route message to general channel|FetchMemberList|Send O365 actionable connector card');
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
      default:
        session.endDialog();
        break;
    }
  }
]); 

bot.on('conversationUpdate', function (message) {
  var event = teams.TeamsMessage.getConversationUpdateData(message);
});

bot.dialog('FetchChannelList', function (session: builder.Session) {
  var teamId = session.message.sourceEvent.team.id;
  connector.fetchChannelList(
    (<builder.IChatConnectorAddress>session.message.address).serviceUrl,
    teamId,
    (err, result) => {
      if (err) {
        session.endDialog('There is some error');
      }
      else {
        session.endDialog('%s', JSON.stringify(result));
      }
    }
  );
});

bot.dialog('FetchMemberList', function (session: builder.Session) {
  var conversationId = session.message.address.conversation.id;
  connector.fetchMembers(
    (<builder.IChatConnectorAddress>session.message.address).serviceUrl,
    conversationId,
    (err, result) => {
      if (err) {
        session.endDialog('There is some error');
      }
      else {
        session.endDialog('%s', JSON.stringify(result));
      }
    }
  );
});

bot.dialog('MentionUser', function (session: builder.Session) {
  // user name/user id
  var toMention: builder.IIdentity = {
    name: 'Bill Zeng',
    id: userId
  };
  var msg = new teams.TeamsMessage(session).text(teams.TeamsMessage.getTenantId(session.message));
  var mentionedMsg = (<teams.TeamsMessage>msg).addMentionToText(toMention);
  session.send(mentionedMsg);
  session.endDialog();
});

bot.dialog('StartNew1on1Chat', function (session: builder.Session) {
  var address = 
   { 
     channelId: 'msteams',
     user: { id: userId },
     channelData: {
      tenant:{
        id: tenantId
      }
     },
     bot:
      { 
        id: appId,
        name: appName 
      },
     serviceUrl: (<builder.IChatConnectorAddress>session.message.address).serviceUrl,
     useAuth: true
    }
    bot.beginDialog(address, '/');
});

bot.dialog('RouteMessageToGeneral', function (session: builder.Session) {
  // user name/user id
  var toMention: builder.IIdentity = {
    name: 'Bill Zeng',
    id: userId
  };
  var msg = new teams.TeamsMessage(session).text(teams.TeamsMessage.getTenantId(session.message));
  var mentionedMsg = (<teams.TeamsMessage>msg).addMentionToText(toMention);
  var generalMessage = mentionedMsg.routeReplyToGeneralChannel();
  session.send(generalMessage);
  session.endDialog();
});

bot.dialog('SendO365Card', function (session: builder.Session) {
  // multiple choice examples
  let actionCard1 = new teams.O365ConnectorCardActionCard(session)
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
                      list4: '{{list-4.value}}'}))
                  ]);
  
  // text input examples
  let actionCard2 = new teams.O365ConnectorCardActionCard(session)
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
                      text4: '{{text-4.value}}'}))
                  ]);

  // date / time input examples
  let actionCard3 = new teams.O365ConnectorCardActionCard(session)
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
                      date2: '{{date-2.value}}'}))
                  ]);

  let section = new teams.O365ConnectorCardSection(session)
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

  let card = new teams.O365ConnectorCard(session)
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
                  .name('Open Uri')
                  .default('http://microsoft.com')
                  .iOS('http://microsoft.com')
                  .android('http://microsoft.com')
                  .windowsPhone('http://microsoft.com')]);

  var msg = new teams.TeamsMessage(session)
                .summary("A sample O365 actionable card")
                .attachments([card]);

  session.send(msg);
  session.endDialog();
});

// example for o365 connector actionable card
var o365CardActionHandler = function (event: builder.IEvent, query: teams.IO365ConnectorCardActionQuery, callback: (err: Error, result: any, statusCode: number) => void): void {
  let userName = event.address.user.name;
  let body = JSON.parse(query.body);
  let msg = new builder.Message()
            .address(event.address)
            .summary("Thanks for your input!")
            .textFormat("xml")
            .text(`<h2>Thanks, ${userName}!</h2><br/><h3>Your input action ID:</h3><br/><pre>${query.actionId}</pre><br/><h3>Your input body:</h3><br/><pre>${JSON.stringify(body, null, 2)}</pre>`);
  connector.send([msg.toMessage()], (err: Error, address?: builder.IAddress[]) => {

  });
  callback(null, null, 200);
}

connector.onO365ConnectorCardAction(o365CardActionHandler);

// example for compose extension
var composeExtensionHandler = function (event: builder.IEvent, query: teams.ComposeExtensionQuery, callback: (err: Error, result: teams.IComposeExtensionResponse, statusCode: number) => void): void {
  // parameters should be identical to manifest
  if (query.parameters[0].name != "sample-parameter") {
    return callback(new Error("Parameter mismatch in manifest"), null, 500);
  }

  var logo: builder.ICardImage = { 
    alt: "logo",
    url: "http://logo.jpg", 
    tap: null
  };

  try {
    let card = new builder.ThumbnailCard()
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
    let response = teams.ComposeExtensionResponse.result("list").attachments([card.toAttachment()]);
    callback(null, response.toResponse(), 200);
  }
  catch (e) {
    callback(e, null, 500);
  }
}

connector.onQuery('composeExtensionHandler', composeExtensionHandler);
