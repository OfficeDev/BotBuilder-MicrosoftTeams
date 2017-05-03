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
import { TeamsChatConnector, TeamsMessage, TeamsModels } from 'botbuilder-teams';

// Put your registered bot here, to register bot, go to bot framework
// var appName: string = 'app name';
// var appId: string = 'app id';
// var appPassword: string = 'app password';
// var userId: string = 'user id';
// var tenantId: string = 'tenant id';

var appName: string = 'zel-bot-getcc';
var appId: string = '3ac5850f-8e82-430b-812c-bee26f5adf77';
var appPassword: string = 'OgFmsCEi7ydz7M11kFDTZrd';
var userId: string = 'e5ef3302-c442-4c3e-88ba-d4c5602b761a';
var tenantId: string = '72f988bf-86f1-41af-91ab-2d7cd011db47';

var server = restify.createServer(); 
server.listen(3978, function () {    
  console.log('%s listening to %s', server.name, util.inspect(server.address())); 
});  

// Create chat bot 
var connector = new TeamsChatConnector({     
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
		builder.Prompts.choice(session, "Choose an option:", 'Fetch channel list|Mention user|Start new 1 on 1 chat|Route message to general channel');
	},
	function (session, results) {
		console.log(results);
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
			default:
				session.endDialog();
				break;
		}
	}
]); 

bot.on('conversationUpdate', function (message) {
	var event = TeamsMessage.getConversationUpdateData(message);
	console.log(event);
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

bot.dialog('MentionUser', function (session: builder.Session) {
	// user name/user id
	var toMention: builder.IIdentity = {
	  name: 'Bill Zeng',
	  id: userId
	};
	var msg = new TeamsMessage(session).text(TeamsMessage.getTenantId(session.message));
	var mentionedMsg = msg.addMentionToText(toMention);
	session.send(mentionedMsg);
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
	var msg = new TeamsMessage(session).text(TeamsMessage.getTenantId(session.message));
	var mentionedMsg = msg.addMentionToText(toMention);
	var generalMessage = mentionedMsg.routeReplyToGeneralChannel();
	session.send(generalMessage);
});

// example for compose extension
var wikipediaHandler = function (event: builder.IEvent, query: TeamsModels.ComposeExtensionQuery, callback: (err: Error, result: TeamsModels.ComposeExtensionResult, statusCode: number) => void): void {
	var keyword = 'wiki';
	if (query.parameters && query.parameters.length > 0) {
		keyword = query.parameters[0].value;
	}

	var apiUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=[keyword]&srlimit=10&format=json";
  apiUrl = apiUrl.replace("[keyword]", keyword);
  apiUrl = encodeURI(apiUrl);
  var logo: builder.ICardImage = { 
  	alt: "wikipedia logo",
  	url: "http://adigaskell.org/wp-content/uploads/2014/08/wikipedia-logo.jpg", 
  	tap: null
  };
  https.get(apiUrl, function (resHttp) {
  	var body = '';
  	
  	resHttp.on('data', function (data) {
  		body += data;
  	});

  	resHttp.on('end', function () {
  		try {
  			let callbackReturn = { 
  				composeExtension : {
	  				type: "result",
	          attachmentLayout: "list",
	          attachments: []
  				}
  			};
  			var result = JSON.parse(body).query.search;
  			if (result.length > 0) {
  				result.forEach((oneResult) => {
  					let card = new builder.ThumbnailCard()
  											.title(oneResult.title)
  											.images([logo])
  											.text(oneResult.snippet + " ...")
  											.buttons([
  												{
  													type: "openUrl",
  													title: "Go to Wikipedia",
  													value: "https://en.wikipedia.org/wiki/" + encodeURI(oneResult.title)
  												}
  											]);
  					callbackReturn.composeExtension.attachments.push(card['data']);
  				});
  			}
  			callback(null, callbackReturn, 200);
  		}
  		catch (e) {
  			callback(e, null, 500);
  		}
  	});
  });
}

connector.onQuery('insertWikipedia', wikipediaHandler);
