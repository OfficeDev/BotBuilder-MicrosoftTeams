'use strict'

var restify = require('restify'); 
var builder = require('botbuilder');  
var util = require('util');
var teamsAPI = require('../teamsAPI/TeamsConnector');
var teamsHelper = require('../teamsAPI/TeamsActivityHelper');
var teamsModels = require('../teamsAPI/TeamsModels');
var TenantFilter = require('../teamsAPI/TenantFilter');
var teamsDialogHelper = require('../teamsAPI/TeamsDialogHelper');

var msRest = require('ms-rest');
var client = msRest.ServiceClient;

// ========================================================= 
// Bot Setup 
// =========================================================  

// Setup Restify Server 

var server = restify.createServer(); 

server.listen(process.env.port || process.env.PORT || 3978, function () {    
  console.log('%s listening to %s', server.name, util.inspect(server.address())); 
});  

// Create chat bot 

// var connector = new builder.ChatConnector({     
//   appId: '3ac5850f-8e82-430b-812c-bee26f5adf77',     
//   appPassword: '43QtbDNOKhMoSfdKG9H8EaM' 
// }); 

var connector = new builder.ChatConnector({     
  appId: '3ac5850f-8e82-430b-812c-bee26f5adf77',     
  appPassword: '2QTu6sqS1HsE2JkpQmLib5R' 
}); 

var bot = new builder.UniversalBot(connector); 
// server.post('/api/messages', connector.listen());  

var allowedTenants = ['72f988bf-86f1-41af-91ab-2d7cd011db47'];
//var allowedTenants = [];

var tenantFilter = new TenantFilter(allowedTenants);

server.post('/api/messages', connector.listenAllowedTenant(tenantFilter));

server.post('/api/new', function (req, res) {
  var uid = '29:1MtiAeUCXVDb6Jh5WoJfLcsv-RbK_Mh1rHzMWbVodD0QEfjeKBbIrW07C3C2IkGfM9CTH8DQEct-lp7K9__OmBA';
  var botId = '3ac5850f-8e82-430b-812c-bee26f5adf77';

  // address:
  //     { id: '1492456146769',
  //       channelId: 'msteams',
  //       user:
  //        { id: '29:1MtiAeUCXVDb6Jh5WoJfLcsv-RbK_Mh1rHzMWbVodD0QEfjeKBbIrW07C3C2IkGfM9CTH8DQEct-lp7K9__OmBA',
  //          name: 'Bill Zeng' },
  //       conversation:
  //        { isGroup: true,
  //          id: '19:8c36a398625b4e638a8d397649367b1c@thread.skype;messageid=1492456146769' },
  //       bot:
  //        { id: '28:3ac5850f-8e82-430b-812c-bee26f5adf77',
  //          name: 'zel-bot-getcc' },
  //       serviceUrl: 'https://smba.trafficmanager.net/amer-client-ss.msg/',
  //       useAuth: true },

  var address = 
   { 
     channelId: 'msteams',
     user: { id: '29:1MtiAeUCXVDb6Jh5WoJfLcsv-RbK_Mh1rHzMWbVodD0QEfjeKBbIrW07C3C2IkGfM9CTH8DQEct-lp7K9__OmBA' },
     channelData: {
      tenant:{
        id: '72f988bf-86f1-41af-91ab-2d7cd011db47'
      }
     },
     bot:
      { id: '28:3ac5850f-8e82-430b-812c-bee26f5adf77',
        name: 'zel-bot-getcc' },
     serviceUrl: 'https://smba.trafficmanager.net/amer-client-ss.msg/',
     useAuth: true
    }

  bot.beginTeamsDialog(address, '/');
  res.end();
});

// ========================================================= 
// Bots Dialogs 
// =========================================================  

bot.dialog('/', function (session) {   
  // var callback = (err, result, req, res) => {
  //   session.send('ERR');
  //   session.send(util.inspect(err));
  //   session.send('RES');
  //   session.send(util.inspect(result));
  // }

  //  console.log(util.inspect(session.message, false, 10));

  // connector.getTeamsConnector().Teams.fetchChannelList(
  //   '19:b3e06660c4bc463a9ca0d4f23146f392@thread.skype',
  //   null,
  //   callback
  // ); 

  // console.log(util.inspect(session, null, 3));

  try {

  // session.send('received');

  var toMention = new teamsModels.ChannelAccount('Bill Zeng', '29:1MtiAeUCXVDb6Jh5WoJfLcsv-RbK_Mh1rHzMWbVodD0QEfjeKBbIrW07C3C2IkGfM9CTH8DQEct-lp7K9__OmBA');

  var msg = new builder.Message(session)

  var msg = msg.text(teamsHelper.GetTenantId(msg));

  var mentionedMsg = teamsHelper.AddMetionToText(msg, toMention);

  var generalMessage = teamsHelper.RouteReplyToGeneralChannel(mentionedMsg);

  session.send(generalMessage);
  }
  catch (e) {
     console.log(e);
  }
});

bot.on('conversationUpdate', function (message) {
  console.log(util.inspect(message, null, 3));
  // var data = teamsHelper.GetGeneralChannel(message);
  // console.log(data);
});