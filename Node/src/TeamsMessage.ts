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

  /**
  *  Enable bot to send a message to mention user
  *  @param {ChannelAccount} mentionedUser - The team id, you can look it up in session object.
  *  @param {MentionTextLocation} textLocation - This defines append or prepend the mention text
  *  @param {string} mentionText - text to mention
  */
  public addMentionToText(mentionedUser: ChannelAccount, textLocation: MentionTextLocation = MentionTextLocation.PrependText, mentionText: string): TeamsMessage{
    if (!mentionedUser || !mentionedUser.id) {
      throw new Error('Mentioned user and user ID cannot be null');
    }

    if (!mentionedUser.name && !mentionText) {
      throw new Error('Either mentioned user name or mentionText must have a value');
    }

    var toMention = !mentionText ? mentionedUser.name : mentionText;
    var mentionEntityText = '<at>'+toMention+'</at>';

    this.data.text = !this.data.text ? '' : this.data.text;

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

  /**
  *  Return conversation update related event 
  *  @param {IConversationUpdate} message - user message like adding member to channel, rename etc
  */
  public static getConversationUpdateData(message: builder.IConversationUpdate): TeamEventBase {
    if (message.sourceEvent) {
      var channelData = message.sourceEvent;
      if (channelData.eventType) {
        var team = this.populateTeam(channelData);
        var tenant = this.populateTenant(channelData);
        switch (channelData.eventType) {
          case 'teamMemberAdded':
            var members = this.populateMembers(message.membersAdded);
            return new MembersAddedEvent(
              members,
              team,
              tenant
            );
          case 'teamMemberRemoved':
            var members = this.populateMembers(message.membersRemoved);
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

  /**
  *  Get message related team info
  *  @param {IMessage} message - The message sent to bot.
  */
  public static getGeneralChannel(message: builder.IMessage): ChannelInfo {
    if (!message) {
      throw new Error('Message can not be null');
    }
    
    if (message.sourceEvent) {
      var channelData = message.sourceEvent;
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

  /**
  *  Route message to general channel
  */
  public routeReplyToGeneralChannel(): TeamsMessage {
    var team = this.session.message.sourceEvent.team;
    if (!team) return null;
    var teamId = team.id;
    var conversation = this.data.address.conversation;
    this.data.address.conversation.id = teamId;
    return this;
  }

  /**
  *  Get message related tenant id
  *  @param {IMessage} message - The message sent to bot.
  */
  public static getTenantId(message: builder.IMessage): string {
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
