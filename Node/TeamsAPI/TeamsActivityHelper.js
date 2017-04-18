'use strict';

var util = require('util');

var models = require('./TeamsModels');
var builder = require('botbuilder');
var teamsAPI = require('./TeamsAPI/teams');
var conversationUpdate = require('./ConversationUpdate')

var MentionTextLocation = {
	PrependText : 0,
	AppendText : 1
}

exports.MentionTextLocation = MentionTextLocation; 

exports.AddMetionToText = function (message, mentionedUser, textlocation = MentionTextLocation.PrependText, mentionText) {

	if (!message) {
		throw new Error('message', 'Message object can not be null');
	}

	if (!mentionedUser || !mentionedUser.id) {
		throw new Error('mentionedUser', 'Mentioned user and user ID cannot be null');
	}

	if (!mentionedUser.name && !mentionText) {
		throw new Error('Either mentioned user name or mentionText must have a value');
	}

	var toMention = !mentionText? mentionedUser.name : mentionText;
	var mentionEntityText = '<at>'+toMention+'</at>';

	message.data.text = !message.data.text? '' : message.data.text;

	if (textlocation == MentionTextLocation.AppendText) {
		message.text(message.data.text + " " + mentionEntityText);
	}
	else {
		message.text(mentionEntityText + " " + message.data.text);
	}

	message.addEntity({
		'mentioned' : {
			'id' : mentionedUser.id,
			'name' : mentionedUser.name
		},
		'text' : mentionEntityText,
		'type' : 'mention'
	});

	return message;
}

exports.GetConversationUpdateData = function (message) {
	if (message.sourceEvent) {
		var channelData = message.sourceEvent;
		if (channelData.eventType) {
			var team = populateTeam(channelData);
			var tenant = populateTenant(channelData);
			switch (channelData.eventType) {
				case 'teamMemberAdded':
					var members = populateMembers(message.membersAdded);
					return new conversationUpdate.MembersAddedEvent(
						members,
						team,
						tenant
					);
				case 'teamMemberRemoved':
					var members = populateMembers(message.membersRemoved);
					return new conversationUpdate.MembersRemovedEvent(
						members,
						team,
						tenant
					);
				case 'channelCreated':
					var channel = populateChannel(channelData);
					return new conversationUpdate.ChannelCreatedEvent(
						channel,
						team,
						tenant
					);
				case 'channelDeleted':
					var channel = populateChannel(channelData);
					return new conversationUpdate.ChannelDeletedEvent(
						channel,
						team,
						tenant
					);
				case 'channelRenamed':
					var channel = populateChannel(channelData);
					return new conversationUpdate.ChannelRenamedEvent(
						channel,
						team,
						tenant
					);
				case 'teamRenamed':
					return new conversationUpdate.TeamRenamedEvent(
						team,
						tenant
					);
			}
		}
		
		throw Error('ConversationUpdate', 'EventType missing in ChannelData');
	}
	else {
		throw Error('ConversationUpdate', 'ChannelData missing in message');
	}
}

exports.GetGeneralChannel = function (message) {
	var ChannelInfo = models.ChannelInfo;
	if (message.sourceEvent) {
		var channelData = message.sourceEvent;
		var team = populateTeam(channelData);
		if (team) {
			return new ChannelInfo(
				team.name,
				team.id
			);
		}
	}
	return null;
}

exports.RouteReplyToGeneralChannel = function (message) {
	if (!message || !(message instanceof builder.Message)) return null;
	var team = message.session.message.sourceEvent.team;
	if (!team) return null;
	var teamId = team.id;
	var conversation = message.data.address.conversation;
	var messageId = conversation.id.split(';')[1];
	message.data.address.conversation.id = teamId+';'+messageId;
	return message
}

exports.GetTenantId = function (message) {
	if (!message || !(message instanceof builder.Message)) return null;
	var ChannelInfo = models.ChannelInfo;
	if (!message.session || !message.session.message) return null;
	var channelData = message.session.message.sourceEvent;
	if (channelData) {
		var tenant = populateTenant(channelData);
		if (tenant) {
			return tenant.id;
		}
	}
	return null;
}

var populateMembers = function (members) {
	var ChannelAccount = models.ChannelAccount;
	var ret = [];
	if (!members) return ret;
	for (var i in members) {
		var member = members[i];
		if (!member.id && !member.name) continue;
		var account = new ChannelAccount (
			member.name, 
			member.id
		);
		ret.push(account);
	}
	return ret;
}

var populateTeam = function (channelData) {
	var TeamInfo = models.TeamInfo;
	if (!channelData || !channelData.team) return null;
	return new TeamInfo (
		channelData.team.name, 
		channelData.team.id
	);
}

var populateTenant = function (channelData) {
	var TenantInfo = models.TenantInfo;
	if (!channelData || !channelData.tenant) return null;
	return new TenantInfo (
		channelData.tenant.id
	);
}

var populateChannel = function (channelData) {
	var ChannelInfo = models.ChannelInfo;
	if (!channelData || !channelData.channel) return null;
	return new ChannelInfo (
		channelData.channel.name,
		channelData.channel.id
	);
}