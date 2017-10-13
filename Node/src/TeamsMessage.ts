// 
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
// 
// Microsoft Teams: https://dev.office.com/microsoft-teams
// 
// Bot Builder Microsoft Teams SDK GitHub
// https://github.com/OfficeDev/BotBuilder-MicrosoftTeams
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
import { ChannelInfo, TeamInfo, TenantInfo } from './models';

export enum MentionTextLocation {
  PrependText,
  AppendText
}

/**
 * @class
 * At mention entity in message.
 *
 * @member {string} [type] at mention type, its value is always mention.
 *
 * @member {object} [mentioned] mentioned object with id, type and text value.
 *
 * @member {string} [text] text value to display in the message
 *
 */
export class MentionEntity {
  type: string;
  mentioned: any;
  text: string;
}

/**
 * @class
 * At mention user entity in message.
 *
 * @member {string} [type] at mention type, its value is always mention.
 *
 * @member {object} [mentioned] mentioned object with id, type and text value.
 *
 * @member {string} [text] text value to display in the message
 *
 */
export class UserMention extends MentionEntity {
  /**
    *  Initialize a new instance of at mention user entity
    *  @param {IIdentity} user - User object to at mention.
    *  @param {string} text - At mention string to display.
    */  
  constructor(user: builder.IIdentity, text?: string) {
    super();
    if (!user || !user.id) {
      throw new Error('Mentioned user and user ID cannot be null');
    }

    if (!user.name && !text) {
      throw new Error('Either mentioned user name or mentionText must have a value');
    }

    let mentionEntityText = text || user.name;
    this.type = 'mention';   
    this.text = '<at>'+mentionEntityText+'</at>';
    this.mentioned = {
      'id' : user.id,
      'name' : mentionEntityText,
      'type': 'user'
    };
  }
}

/**
 * @class
 * At mention channel entity in message.
 *
 * @member {string} [type] at mention type, its value is always mention.
 *
 * @member {object} [mentioned] mentioned object with id, type and text value.
 *
 * @member {string} [text] text value to display in the message
 *
 */
export class ChannelMention extends MentionEntity {
  /**
    *  Initialize a new instance of at mention channel entity
    *  @param {ChannelInfo} channel - The channel to at mention.
    */
  constructor(channel: ChannelInfo) {
    super();
    if (!channel || !channel.id) {
      throw new Error('Mentioned channel and channel ID cannot be null');
    }

    if (!channel.name) {
      throw new Error('Channel name must have a value, use General as name if it is a team');
    }

    this.type = 'mention';
    this.text = '<at>'+channel.name+'</at>';
    this.mentioned = {
      'id' : channel.id,
      'name' : channel.name,
      'type': 'channel'
    };
  }
}

export class TeamsMessage extends builder.Message {
  
  constructor(private session?: builder.Session) {
    super(session);
  }

  /**
  *  Deprecated, please use UserMention and ChannelMention
  *  Enable bot to send a message to mention user
  *  @param {builder.IIdentity} mentionedUser - The team id, you can look it up in session object.
  *  @param {MentionTextLocation} textLocation - This defines append or prepend the mention text
  *  @param {string} mentionText - text to mention
  */
  public addMentionToText(mentionedUser: builder.IIdentity, textLocation: MentionTextLocation = MentionTextLocation.PrependText, mentionText: string): TeamsMessage {
    
    // Deprecated
    console.warn("new TeamsMessage(session).addMentionToText is deprecated. Use UserMention or ChannelMention instead.");

    if (!mentionedUser || !mentionedUser.id) {
      throw new Error('Mentioned user and user ID cannot be null');
    }

    if (!mentionedUser.name && !mentionText) {
      throw new Error('Either mentioned user name or mentionText must have a value');
    }

    if (mentionText) {
      mentionedUser.name = mentionText;
    }

    var mentionEntityText = '<at>'+mentionedUser.name+'</at>';

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
      
      throw new Error('EventType missing in ChannelData');
    }
    else {
      throw new Error('ChannelData missing in message');
    }
  }

  /**
  *  Get message related team info
  *  @param {IEvent} message - The message sent to bot.
  */
  public static getGeneralChannel(message: builder.IEvent): ChannelInfo {
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
    if (!team) {
      throw new Error('Team cannot be null, session message is not correct.');
    }
    var teamId = team.id;
    var conversation = this.data.address.conversation;
    this.data.address.conversation.id = teamId;
    return this;
  }

  /**
  *  Get message related tenant id
  *  @param {IEvent} message - The message sent to bot.
  */
  public static getTenantId(message: builder.IEvent): string {
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

  /**
  *  Retrun message without mentions
  *  @param {IMessage} message - The message with mentions
  */
  public static getTextWithoutMentions(message: builder.IMessage): string {
    var text = message.text;
    if (message.entities) {
      message.entities
        .filter(entity => entity.type === "mention")
        .forEach(entity => {
          text = text.replace(entity.text, "");
        });
      text = text.trim();
    }
    return text;
  }

  private static populateMembers(members: Array<any>): Array<builder.IIdentity> {
    var ret: builder.IIdentity[] = [];
    if (!members) return ret;
    for (var i in members) {
      var member = members[i];
      if (!member.id && !member.name) continue;
      var account = {
        name: member.name,
        id: member.id
      }
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


