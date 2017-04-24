/*-----------------------------------------------------------------------------
This Bot demonstrates how to use teams extension for a bot. 

# RUN THE BOT:
    Run the bot from the command line using "node app.js" and then type 
    "hello" to wake the bot up.
    
-----------------------------------------------------------------------------*/

var util = require('util');
var restify = require('restify'); 
var builder = require('botbuilder');  
var TeamsChatConnector = require('../lib/TeamsChatConnector').TeamsChatConnector;
var TeamsMessage = require('../lib/TeamsMessage').TeamsMessage;
var TeamsModels = require('../lib/models');

// Put your registered bot here, to register bot, go to bot framework
var appName = 'app name';
var appId = 'app id';
var appPassword = 'app password';
var userId = 'user id';
var tenantId = 'tenant id';

var server = restify.createServer(); 
server.listen(process.env.port || process.env.PORT || 3978, function () {    
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

server.post('/api/messages', connector.listen());
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

bot.dialog('FetchChannelList', function (session) {
	var teamId = session.message.sourceEvent.team.id;
	connector.fetchChannelList(
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

bot.dialog('MentionUser', function (session) {
	// user name/user id
	var toMention = new TeamsModels.ChannelAccount('Bill Zeng', userId);
	var msg = new TeamsMessage(session).text(TeamsMessage.getTenantId(session.message));
	var mentionedMsg = msg.addMentionToText(toMention);
	session.send(mentionedMsg);
});

bot.dialog('StartNew1on1Chat', function (session) {
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
      { id: appId,
        name: appName },
     serviceUrl: session.message.address.serviceUrl,
     useAuth: true
    }
  	bot.beginDialog(address, '/');
});

bot.dialog('RouteMessageToGeneral', function (session) {
	// user name/user id
	var toMention = new TeamsModels.ChannelAccount('Bill Zeng', userId);
	var msg = new TeamsMessage(session).text(TeamsMessage.getTenantId(session.message));
	var mentionedMsg = msg.addMentionToText(toMention);
	var generalMessage = mentionedMsg.routeReplyToGeneralChannel();
	session.send(generalMessage);
});
