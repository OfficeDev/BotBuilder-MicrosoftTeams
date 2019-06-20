var builder = require('botbuilder');
var assert = require('assert');
var tm = require('../lib/TeamsMessage');
var TeamsMessage = tm.TeamsMessage;
var MentionTextLocation = tm.MentionTextLocation;

describe('TeamsMessage', function () {
  describe('#addMentionToText', function (done) {
    it('should throw error if pass in null mentionedUser', function () {      
      var connector = new builder.ConsoleConnector();
      var bot = new builder.UniversalBot(connector);
      bot.dialog('/', function (session) { 
        var message = new TeamsMessage(session);
        assert.throws(function() {
          message.addMentionToText(null, MentionTextLocation.PrependText, '');
        }, Error, 'Mentioned user and user ID cannot be null');
      });
      bot.on('send', function (message) {
        done();
      });
      connector.processMessage('start');
    });

    it('should throw error if pass in null mention name', function () {
      var connector = new builder.ConsoleConnector();
      var bot = new builder.UniversalBot(connector);
      bot.dialog('/', function (session) { 
        var message = new TeamsMessage(session);
        assert.throws(function() {
          message.addMentionToText({id: 'test'}, MentionTextLocation.PrependText, '');
        }, Error, 'Mentioned user and user ID cannot be null');   
      });
      bot.on('send', function (message) {
        done();
      });
      connector.processMessage('start');
    });

    it('should mention user', function () {
      var connector = new builder.ConsoleConnector();
      var bot = new builder.UniversalBot(connector);
      bot.dialog('/', function (session) { 
        var message = new TeamsMessage(session);
        var msg = message.addMentionToText({id: 'test', name: 'test'}, MentionTextLocation.PrependText, '');
        assert([
          {
            'mentioned': {
              'id': 'test',
              'name': 'test'
            },
            'text': '<at>test</at>',
            'type': 'mention'
          }
        ], msg.entities); 
      });
      bot.on('send', function (message) {
        done();
      });
      connector.processMessage('start');
    });

    it('should mention defined text', function () {
      var connector = new builder.ConsoleConnector();
      var bot = new builder.UniversalBot(connector);
      bot.dialog('/', function (session) { 
        var message = new TeamsMessage(session);
        var msg = message.addMentionToText({id: 'test'}, MentionTextLocation.PrependText, 'test');
        assert([
          {
            'mentioned': {
              'id': 'test',
              'name': 'test'
            },
            'text': '<at>test</at>',
            'type': 'mention'
          }
        ], msg.entities);
      });
      bot.on('send', function (message) {
        done();
      });
      connector.processMessage('start');
    });

    it('should prepend mention text', function () {
      var connector = new builder.ConsoleConnector();
      var bot = new builder.UniversalBot(connector);
      bot.dialog('/', function (session) { 
        var message = new TeamsMessage(session).text('aaa');
        var msg = message.addMentionToText({id: 'test'}, MentionTextLocation.PrependText, 'test');
        assert([
          {
            'mentioned': {
              'id': 'test',
              'name': 'test'
            },
            'text': '<at>test</at> aaa',
            'type': 'mention'
          }
        ], msg.entities);
      });
      bot.on('send', function (message) {
        done();
      });
      connector.processMessage('start');
    });

    it('should append mention text', function () {
      var connector = new builder.ConsoleConnector();
      var bot = new builder.UniversalBot(connector);
      bot.dialog('/', function (session) { 
        var message = new TeamsMessage(session);
        var msg = message.addMentionToText({id: 'test'}, MentionTextLocation.AppendText, 'test');
        assert([
          {
            'mentioned': {
              'id': 'test',
              'name': 'test'
            },
            'text': 'aaa <at>test</at>',
            'type': 'mention'
          }
        ], msg.entities);
      });
      bot.on('send', function (message) {
        done();
      });
      connector.processMessage('start');
    });

    it('should mention user with UserMention', function () {
      let user = {
        id: 'test',
        name: 'test'
      };

      let mention = new tm.UserMention(user);
      var message = new TeamsMessage(null);
      var msg = message.addEntity(mention);
      assert([
        {
          'mentioned': {
            'id': 'test',
            'name': 'test',
            'type': 'user'
          },
          'text': '<at>test</at>',
          'type': 'mention'
        }
      ], msg.entities);
    });

    it('should mention channel with ChannelMention', function () {
      let channel = {
        id: 'test',
        name: 'test'
      };

      let mention = new tm.ChannelMention(channel);
      var message = new TeamsMessage(null);
      var msg = message.addEntity(mention);
      assert([
        {
          'mentioned': {
            'id': 'test',
            'name': 'test',
            'type': 'channel'
          },
          'text': '<at>test</at>',
          'type': 'mention'
        }
      ], msg.entities);
    });

    it('should mention team with TeamMention', function () {
      let team = {
        id: 'test',
        name: 'test'
      };

      let mention = new tm.ChannelMention(team);
      var message = new TeamsMessage(null);
      var msg = message.addEntity(mention);
      assert([
        {
          'mentioned': {
            'id': 'test',
            'name': 'test',
            'type': 'team'
          },
          'text': '<at>test</at>',
          'type': 'mention'
        }
      ], msg.entities);
    });
  });

  describe('#getConversationUpdateData', function (done) {
    it('should return MembersAddedEvent', function() {
      var activity = { 
        membersAdded: [ { id: '29:userId', name: 'test-user' } ],
        type: 'conversationUpdate',
        timestamp: '2017-04-21T19:36:02.069Z',
        sourceEvent:
         { team: { id: '19:threadId', name:'test-team' },
           eventType: 'teamMemberAdded',
           tenant: { id: 'tenantId' } },
        text: '',
        attachments: [],
        entities: [],
        address:
         { id: 'f:073c7c95',
           channelId: 'msteams',
           user: { id: '29:userId' },
           conversation:
            { isGroup: true,
              id: '19:threadId' },
           bot:
            { id: '28:userId',
              name: 'Bot' },
           serviceUrl: 'https://smba.trafficmanager.net/amer-client-ss.msg/',
           useAuth: true },
        source: 'msteams',
        agent: 'botbuilder',
        user: { id: '29:userId' } 
      };
      var event = TeamsMessage.getConversationUpdateData(activity);
      assert(
      {
        eventType: 0,
        team: { id: '19:threadId', name:'test-team' },
        tenant: { id: 'tenantId' },
        membersAdded: [{ id: '29:userId', name: 'test-user' }]
      }, event);
    });

    it('should return MembersRemovedEvent', function() {
      var activity = { 
        membersRemoved: [ { id: '29:userId', name: 'test-user' } ],
        type: 'conversationUpdate',
        timestamp: '2017-04-21T19:36:02.069Z',
        sourceEvent:
         { team: { id: '19:threadId', name:'test-team' },
           eventType: 'teamMemberRemoved',
           tenant: { id: 'tenantId' } },
        text: '',
        attachments: [],
        entities: [],
        address:
         { id: 'f:073c7c95',
           channelId: 'msteams',
           user: { id: '29:userId' },
           conversation:
            { isGroup: true,
              id: '19:threadId' },
           bot:
            { id: '28:userId',
              name: 'Bot' },
           serviceUrl: 'https://smba.trafficmanager.net/amer-client-ss.msg/',
           useAuth: true },
        source: 'msteams',
        agent: 'botbuilder',
        user: { id: '29:userId' } 
      };
      var event = TeamsMessage.getConversationUpdateData(activity);
      assert(
      {
        eventType: 1,
        team: { id: '19:threadId', name:'test-team' },
        tenant: { id: 'tenantId' },
        membersRemoved: [{ id: '29:userId', name: 'test-user' }]
      }, event);
    });

    it('should return ChannelCreatedEvent', function() {
      var activity = { 
        type: 'conversationUpdate',
        timestamp: '2017-04-21T19:48:51.895Z',
        sourceEvent:
         { channel:
            { id: '19:threadId',
              name: 'test-channel' },
           team: { id: '19:threadId' },
           eventType: 'channelCreated',
           tenant: { id: 'tenantId' } },
        text: '',
        attachments: [],
        entities: [],
        address:
         { id: 'f:e61925f2',
           channelId: 'msteams',
           user: { id: '29:userId' },
           conversation:
            { isGroup: true,
              id: '19:threadId' },
           bot:
            { id: '28:userId',
              name: 'Bot' },
           serviceUrl: 'https://smba.trafficmanager.net/amer-client-ss.msg/',
           useAuth: true },
        source: 'msteams',
        agent: 'botbuilder',
        user: { id: '29:userId' } 
      };
      var event = TeamsMessage.getConversationUpdateData(activity);
      assert(
      {
        eventType: 2,
        team: { id: '19:threadId', name:'test-team' },
        tenant: { id: 'tenantId' },
        channel: { id: '19:threadId', name: 'test-channel' }
      }, event);
    });

    it('should return ChannelDeletedEvent', function() {
      var activity = { 
        type: 'conversationUpdate',
        timestamp: '2017-04-21T19:48:51.895Z',
        sourceEvent:
         { channel:
            { id: '19:threadId',
              name: 'test-channel' },
           team: { id: '19:threadId' },
           eventType: 'channelDeleted',
           tenant: { id: 'tenantId' } },
        text: '',
        attachments: [],
        entities: [],
        address:
         { id: 'f:e61925f2',
           channelId: 'msteams',
           user: { id: '29:userId' },
           conversation:
            { isGroup: true,
              id: '19:threadId' },
           bot:
            { id: '28:userId',
              name: 'Bot' },
           serviceUrl: 'https://smba.trafficmanager.net/amer-client-ss.msg/',
           useAuth: true },
        source: 'msteams',
        agent: 'botbuilder',
        user: { id: '29:userId' } 
      };
      var event = TeamsMessage.getConversationUpdateData(activity);
      assert(
      {
        eventType: 3,
        team: { id: '19:threadId', name:'test-team' },
        tenant: { id: 'tenantId' },
        channel: { id: '19:threadId', name: 'test-channel' }
      }, event);
    });

    it('should return ChannelRenamedEvent', function() {
      var activity = { 
        type: 'conversationUpdate',
        timestamp: '2017-04-21T19:48:51.895Z',
        sourceEvent:
         { channel:
            { id: '19:threadId',
              name: 'test-channel' },
           team: { id: '19:threadId' },
           eventType: 'channelRenamed',
           tenant: { id: 'tenantId' } },
        text: '',
        attachments: [],
        entities: [],
        address:
         { id: 'f:e61925f2',
           channelId: 'msteams',
           user: { id: '29:userId' },
           conversation:
            { isGroup: true,
              id: '19:threadId' },
           bot:
            { id: '28:userId',
              name: 'Bot' },
           serviceUrl: 'https://smba.trafficmanager.net/amer-client-ss.msg/',
           useAuth: true },
        source: 'msteams',
        agent: 'botbuilder',
        user: { id: '29:userId' } 
      };
      var event = TeamsMessage.getConversationUpdateData(activity);
      assert(
      {
        eventType: 4,
        team: { id: '19:threadId', name:'test-team' },
        tenant: { id: 'tenantId' },
        channel: { id: '19:threadId', name: 'test-channel' }
      }, event);
    });

    it('should return TeamRenamedEvent', function() {
      var activity = { 
        type: 'conversationUpdate',
        timestamp: '2017-04-21T19:59:07.954Z',
        sourceEvent:
         { team:
            { id: '19:threadId',
              name: 'new-team-name' },
           eventType: 'teamRenamed',
           tenant: { id: 'tenantId' } },
        text: '',
        attachments: [],
        entities: [],
        address:
         { id: 'f:053fe4c9',
           channelId: 'msteams',
           user: { id: '29:userId' },
           conversation:
            { isGroup: true,
              id: '19:threadId' },
           bot:
            { id: '28:userId',
              name: 'zel-bot-getcc' },
           serviceUrl: 'https://smba.trafficmanager.net/amer-client-ss.msg/',
           useAuth: true },
        source: 'msteams',
        agent: 'botbuilder',
        user: { id: '29:userId' } 
      }
      var event = TeamsMessage.getConversationUpdateData(activity);
      assert(
      {
        eventType: 5,
        team: { id: '19:threadId', name: 'new-team-name' },
        tenant: { id: 'tenantId' }
      }, event);
    });
  });

  describe('#getGeneralChannel', function (done) {
    it('should return general channel', function () {
      var activity = { 
        membersRemoved: [ { id: '29:userId', name: 'test-user' } ],
        type: 'conversationUpdate',
        timestamp: '2017-04-21T19:36:02.069Z',
        sourceEvent:
         { team: { id: '19:threadId', name:'test-team' },
           eventType: 'teamMemberRemoved',
           tenant: { id: 'tenantId' } },
        text: '',
        attachments: [],
        entities: [],
        address:
         { id: 'f:073c7c95',
           channelId: 'msteams',
           user: { id: '29:userId' },
           conversation:
            { isGroup: true,
              id: '19:threadId' },
           bot:
            { id: '28:userId',
              name: 'Bot' },
           serviceUrl: 'https://smba.trafficmanager.net/amer-client-ss.msg/',
           useAuth: true },
        source: 'msteams',
        agent: 'botbuilder',
        user: { id: '29:userId' } 
      };
      var generalChannel = TeamsMessage.getGeneralChannel(activity);
      assert(
      {
        name: 'test-team',
        id: '19:threadId'
      }, generalChannel);
    });
  });

  describe('#getTenantId', function (done) {
    it('should return tenant id', function () {
      var activity = { 
        membersRemoved: [ { id: '29:userId', name: 'test-user' } ],
        type: 'conversationUpdate',
        timestamp: '2017-04-21T19:36:02.069Z',
        sourceEvent:
         { team: { id: '19:threadId', name:'test-team' },
           eventType: 'teamMemberRemoved',
           tenant: { id: 'tenantId' } },
        text: '',
        attachments: [],
        entities: [],
        address:
         { id: 'f:073c7c95',
           channelId: 'msteams',
           user: { id: '29:userId' },
           conversation:
            { isGroup: true,
              id: '19:threadId' },
           bot:
            { id: '28:userId',
              name: 'Bot' },
           serviceUrl: 'https://smba.trafficmanager.net/amer-client-ss.msg/',
           useAuth: true },
        source: 'msteams',
        agent: 'botbuilder',
        user: { id: '29:userId' } 
      };
      var tenantId = TeamsMessage.getTenantId(activity);
      assert('tenantId', tenantId);
    });
  });

  describe('#getTextWithoutMentions', function (done) {
    it('should return text without mentions', function () {
      var messageToExtract = {
          "text": "<at>zel-bot-getcc</at>  this is a test message  <at>zel-bot-getcc</at>  yes it is  <at>zel-bot-getcc</at>",
          "textFormat": "plain",
          "attachments": [
              {
                  "contentType": "text/html",
                  "content": "<div><span contenteditable=\"false\" itemscope=\"\" itemtype=\"http://schema.skype.com/Mention\" itemid=\"0\">zel-bot-getcc</span>&#160;this is a test message <span contenteditable=\"false\" itemscope=\"\" itemtype=\"http://schema.skype.com/Mention\" itemid=\"1\">zel-bot-getcc</span>&#160;yes it is <span contenteditable=\"false\" itemscope=\"\" itemtype=\"http://schema.skype.com/Mention\" itemid=\"2\">zel-bot-getcc</span></div>"
              }
          ],
          "type": "message",
          "timestamp": "2017-04-25T19:52:02.61Z",
          "id": "1493149922893",
          "channelId": "msteams",
          "serviceUrl": "https://smba.trafficmanager.net/amer-client-ss.msg/",
          "from": {
              "id": "user id",
              "name": "Bill Zeng"
          },
          "conversation": {
              "isGroup": true,
              "id": "group id"
          },
          "recipient": {
              "id": "bot id",
              "name": "zel-bot-getcc"
          },
          "entities": [
              {
                  "mentioned": {
                      "id": "bot id",
                      "name": "zel-bot-getcc"
                  },
                  "text": "<at>zel-bot-getcc</at>",
                  "type": "mention"
              },
              {
                  "mentioned": {
                      "id": "bot id",
                      "name": "zel-bot-getcc"
                  },
                  "text": "<at>zel-bot-getcc</at>",
                  "type": "mention"
              },
              {
                  "mentioned": {
                      "id": "bot id",
                      "name": "zel-bot-getcc"
                  },
                  "text": "<at>zel-bot-getcc</at>",
                  "type": "mention"
              },
              {
                  "locale": "en-US",
                  "country": "US",
                  "platform": "Windows",
                  "type": "clientInfo"
              }
          ],
          "channelData": {
              "teamsChannelId": "thread id",
              "teamsTeamId": "thread id",
              "channel": {
                  "id": "thread id"
              },
              "team": {
                  "id": "thread id"
              },
              "tenant": {
                  "id": "tenant id"
              }
          }
      }
      var cleanText = TeamsMessage.getTextWithoutMentions(messageToExtract);
      assert('this is a test message yes it is', cleanText);
    });
  });
});
