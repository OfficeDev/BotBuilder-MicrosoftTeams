"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var builder = require("botbuilder");
var ConversationUpdate_1 = require("./ConversationUpdate");
var models_1 = require("./models");
var MentionTextLocation;
(function (MentionTextLocation) {
    MentionTextLocation[MentionTextLocation["PrependText"] = 0] = "PrependText";
    MentionTextLocation[MentionTextLocation["AppendText"] = 1] = "AppendText";
})(MentionTextLocation = exports.MentionTextLocation || (exports.MentionTextLocation = {}));
var TeamsMessage = (function (_super) {
    __extends(TeamsMessage, _super);
    function TeamsMessage(session) {
        var _this = _super.call(this, session) || this;
        _this.session = session;
        return _this;
    }
    TeamsMessage.prototype.addMentionToText = function (mentionedUser, textLocation, mentionText) {
        if (textLocation === void 0) { textLocation = MentionTextLocation.PrependText; }
        if (!mentionedUser || !mentionedUser.id) {
            throw new Error('Mentioned user and user ID cannot be null');
        }
        if (!mentionedUser.name && !mentionText) {
            throw new Error('Either mentioned user name or mentionText must have a value');
        }
        var toMention = !mentionText ? mentionedUser.name : mentionText;
        var mentionEntityText = '<at>' + toMention + '</at>';
        this.data.text = !this.data.text ? '' : this.data.text;
        if (textLocation == MentionTextLocation.AppendText) {
            this.text(this.data.text + " " + mentionEntityText);
        }
        else {
            this.text(mentionEntityText + " " + this.data.text);
        }
        this.addEntity({
            'mentioned': {
                'id': mentionedUser.id,
                'name': mentionedUser.name
            },
            'text': mentionEntityText,
            'type': 'mention'
        });
        return this;
    };
    TeamsMessage.getConversationUpdateData = function (message) {
        if (message.sourceEvent) {
            var channelData = message.sourceEvent;
            if (channelData.eventType) {
                var team = this.populateTeam(channelData);
                var tenant = this.populateTenant(channelData);
                switch (channelData.eventType) {
                    case 'teamMemberAdded':
                        var members = this.populateMembers(message.membersAdded);
                        return new ConversationUpdate_1.MembersAddedEvent(members, team, tenant);
                    case 'teamMemberRemoved':
                        var members = this.populateMembers(message.membersRemoved);
                        return new ConversationUpdate_1.MembersRemovedEvent(members, team, tenant);
                    case 'channelCreated':
                        var channel = this.populateChannel(channelData);
                        return new ConversationUpdate_1.ChannelCreatedEvent(channel, team, tenant);
                    case 'channelDeleted':
                        var channel = this.populateChannel(channelData);
                        return new ConversationUpdate_1.ChannelDeletedEvent(channel, team, tenant);
                    case 'channelRenamed':
                        var channel = this.populateChannel(channelData);
                        return new ConversationUpdate_1.ChannelRenamedEvent(channel, team, tenant);
                    case 'teamRenamed':
                        return new ConversationUpdate_1.TeamRenamedEvent(team, tenant);
                }
            }
            throw new Error('EventType missing in ChannelData');
        }
        else {
            throw new Error('ChannelData missing in message');
        }
    };
    TeamsMessage.getGeneralChannel = function (message) {
        if (!message) {
            throw new Error('Message can not be null');
        }
        if (message.sourceEvent) {
            var channelData = message.sourceEvent;
            var team = this.populateTeam(channelData);
            if (team) {
                return new models_1.ChannelInfo(team.name, team.id);
            }
        }
        return null;
    };
    TeamsMessage.prototype.routeReplyToGeneralChannel = function () {
        var team = this.session.message.sourceEvent.team;
        if (!team) {
            throw new Error('Team cannot be null, session message is not correct.');
        }
        var teamId = team.id;
        var conversation = this.data.address.conversation;
        this.data.address.conversation.id = teamId;
        return this;
    };
    TeamsMessage.getTenantId = function (message) {
        if (!message) {
            throw new Error('Message can not be null');
        }
        var channelData = message.sourceEvent;
        if (channelData) {
            var tenant = this.populateTenant(channelData);
            if (tenant) {
                return tenant.id;
            }
        }
        return null;
    };
    TeamsMessage.getTextWithoutMentions = function (message) {
        var text = message.text;
        if (message.entities) {
            message.entities
                .filter(function (entity) { return entity.type === "mention"; })
                .forEach(function (entity) {
                text = text.replace(entity.text, "");
            });
            text = text.trim();
        }
        return text;
    };
    TeamsMessage.populateMembers = function (members) {
        var ret = [];
        if (!members)
            return ret;
        for (var i in members) {
            var member = members[i];
            if (!member.id && !member.name)
                continue;
            var account = {
                name: member.name,
                id: member.id
            };
            ret.push(account);
        }
        return ret;
    };
    TeamsMessage.populateTeam = function (channelData) {
        if (!channelData || !channelData.team)
            return null;
        return new models_1.TeamInfo(channelData.team.name, channelData.team.id);
    };
    TeamsMessage.populateTenant = function (channelData) {
        if (!channelData || !channelData.tenant)
            return null;
        return new models_1.TenantInfo(channelData.tenant.id);
    };
    TeamsMessage.populateChannel = function (channelData) {
        if (!channelData || !channelData.channel)
            return null;
        return new models_1.ChannelInfo(channelData.channel.name, channelData.channel.id);
    };
    return TeamsMessage;
}(builder.Message));
exports.TeamsMessage = TeamsMessage;
