// 
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
// 
// Microsoft Bot Framework: http://botframework.com
// 
// Bot Builder SDK Github:
// https://github.com/Microsoft/BotBuilder
// 
// Copyright (c) Microsoft Corporation
// All rights reserved.
// 
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//


import * as builder from 'botbuilder';
import { TeamEventBase, MembersAddedEvent, MembersRemovedEvent, TeamRenamedEvent, ChannelCreatedEvent, ChannelDeletedEvent, ChannelRenamedEvent } from './ConversationUpdate'
import { ChannelInfo, ChannelAccount, TeamInfo, TenantInfo } from './models';

export enum MentionTextLocation {
	PrependText,
	AppendText
}

export class TeamsMessage extends builder.Message {
	
	constructor(private session?: builder.Session) {
		super(session);
	}

	public addMentionToText(mentionedUser: ChannelAccount, textLocation: MentionTextLocation = MentionTextLocation.PrependText, mentionText: string): TeamsMessage{
		if (!mentionedUser || !mentionedUser.id) {
			throw new Error('Mentioned user and user ID cannot be null');
		}

		if (!mentionedUser.name && !mentionText) {
			throw new Error('Either mentioned user name or mentionText must have a value');
		}

		var toMention = !mentionText? mentionedUser.name : mentionText;
		var mentionEntityText = '<at>'+toMention+'</at>';

		this.data.text = !this.data.text? '' : this.data.text;

		if (textLocation == MentionTextLocation.AppendText) {
			this.text(this.data.text + " " + mentionEntityText);
		}
		else {
			this.text(mentionEntityText + " " + this.data.text);
		}

		this.addEntity({
			'mentioned' : {
				'id' : mentionedUser.id,
				'name' : mentionedUser.name
			},
			'text' : mentionEntityText,
			'type' : 'mention'
		});

		return this;
	}

	public static getConversationUpdateData(activity: builder.IConversationUpdate): TeamEventBase {
		if (activity.sourceEvent) {
			var channelData = activity.sourceEvent;
			if (channelData.eventType) {
				var team = this.populateTeam(channelData);
				var tenant = this.populateTenant(channelData);
				switch (channelData.eventType) {
					case 'teamMemberAdded':
						var members = this.populateMembers(activity.membersAdded);
						return new MembersAddedEvent(
							members,
							team,
							tenant
						);
					case 'teamMemberRemoved':
						var members = this.populateMembers(activity.membersRemoved);
						return new MembersRemovedEvent(
							members,
							team,
							tenant
						);
					case 'channelCreated':
						var channel = this.populateChannel(channelData);
						return new ChannelCreatedEvent(
							channel,
							team,
							tenant
						);
					case 'channelDeleted':
						var channel = this.populateChannel(channelData);
						return new ChannelDeletedEvent(
							channel,
							team,
							tenant
						);
					case 'channelRenamed':
						var channel = this.populateChannel(channelData);
						return new ChannelRenamedEvent(
							channel,
							team,
							tenant
						);
					case 'teamRenamed':
						return new TeamRenamedEvent(
							team,
							tenant
						);
				}
			}
			
			throw Error('EventType missing in ChannelData');
		}
		else {
			throw Error('ChannelData missing in message');
		}
	}

	public static getGeneralChannel(activity: builder.IMessage): ChannelInfo {
		if (activity.sourceEvent) {
			var channelData = activity.sourceEvent;
			var team = this.populateTeam(channelData);
			if (team) {
				return new ChannelInfo(
					team.name,
					team.id
				);
			}
		}
		return null;
	}

	public routeReplyToGeneralChannel(): TeamsMessage {
		var team = this.session.message.sourceEvent.team;
		if (!team) return null;
		var teamId = team.id;
		var conversation = this.data.address.conversation;
		var messageId = conversation.id.split(';')[1];
		this.data.address.conversation.id = teamId;
		return this;
	}

	public static getTenantId(activity: builder.IMessage): string {
		if (!activity) return null;
		var channelData = activity.sourceEvent;
		if (channelData) {
			var tenant = this.populateTenant(channelData);
			if (tenant) {
				return tenant.id;
			}
		}
		return null;
	}

	private static populateMembers(members: Array<any>): Array<ChannelAccount> {
		var ret: ChannelAccount[] = [];
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

	private static populateTeam(channelData: any): TeamInfo {
		if (!channelData || !channelData.team) return null;
		return new TeamInfo (
			channelData.team.name, 
			channelData.team.id
		);
	}

	private static populateTenant(channelData: any): TenantInfo {
		if (!channelData || !channelData.tenant) return null;
		return new TenantInfo (
			channelData.tenant.id
		);
	}

	private static populateChannel(channelData: any): ChannelInfo {
		if (!channelData || !channelData.channel) return null;
		return new ChannelInfo (
			channelData.channel.name,
			channelData.channel.id
		);
	}

}
