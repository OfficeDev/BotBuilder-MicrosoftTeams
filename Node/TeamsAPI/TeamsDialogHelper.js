'use strict';

var builder = require('botbuilder');
var consts = require("./consts");
var utils = require("./utils");
var async = require("async");
var urlJoin = require("url-join");

builder.UniversalBot.prototype.beginTeamsDialog = function (address, dialogId, dialogArgs, done) {
	var _this = this;
  this.lookupUser(address, function (user) {
    var msg = {
      type: consts.messageType,
      agent: consts.agent,
      source: address.channelId,
      sourceEvent: {},
      address: utils.clone(address),
      text: '',
      user: user
    };
    _this.ensureTeamsConversation(msg.address, function (adr) {
      msg.address = adr;
      var conversationId = msg.address.conversation ? msg.address.conversation.id : null;
      var storageCtx = {
        userId: msg.user.id,
        conversationId: conversationId,
        address: msg.address,
        persistUserData: _this.settings.persistUserData,
        persistConversationData: _this.settings.persistConversationData
      };
      _this.dispatch(storageCtx, msg, dialogId, dialogArgs, _this.errorLogger(done), true);
    }, _this.errorLogger(done));
  }, this.errorLogger(done));
}

builder.UniversalBot.prototype.ensureTeamsConversation = function (address, done, error) {
  var _this = this;
  this.tryCatch(function () {
    if (!address.conversation) {
      var connector = _this.connector(address.channelId);
      if (!connector) {
        throw new Error("Invalid channelId='" + address.channelId + "'");
      }
      connector.startTeamsConversation(address, function (err, adr) {
        if (!err) {
            _this.tryCatch(function () { return done(adr); }, error);
        }
        else if (error) {
            error(err);
        }
      });
    }
    else {
      _this.tryCatch(function () { return done(address); }, error);
    }
  }, error);
};

builder.ChatConnector.prototype.startTeamsConversation = function (address, done) {
	if (address && address.user && address.bot && address.serviceUrl) {
    var options = {
      method: 'POST',
      url: urlJoin(address.serviceUrl, '/v3/conversations'),
      body: {
        bot: address.bot,
        members: [address.user],
        channelData: address.channelData 
      },
      json: true
    };
    this.authenticatedRequest(options, function (err, response, body) {
      var adr;
      if (!err) {
        try {
          var obj = typeof body === 'string' ? JSON.parse(body) : body;
          if (obj && obj.hasOwnProperty('id')) {
            adr = utils.clone(address);
            adr.conversation = { id: obj['id'] };
            if (adr.id) {
              delete adr.id;
            }
          }
          else {
            err = new Error('Failed to start conversation: no conversation ID returned.');
          }
        }
        catch (e) {
          err = e instanceof Error ? e : new Error(e.toString());
      	}
      }
      if (err) {
        logger.error('ChatConnector: startConversation - error starting conversation.');
      }
      done(err, adr);
    });
  }
  else {
    logger.error('ChatConnector: startConversation - address is invalid.');
    done(new Error('Invalid address.'));
  }
}
