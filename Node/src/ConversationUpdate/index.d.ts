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
import { ChannelInfo, TeamInfo, TenantInfo } from '../models';

/** Types of team events for which a bot can receive notifications. */
export enum TeamEventType {
	/** A bot or team member was added to the team. */
	MembersAdded = 0,
  
	/** A bot or team member was removed from the team */
	MembersRemoved = 1,
  
	/** A channel was created in the team */
	ChannelCreated = 2,
  
	/** A channel in the team was deleted */
	ChannelDeleted = 3,
  
	/** A channel in the team was renamed */
	ChannelRenamed = 4,
  
	/** The team was renamed */
	TeamRenamed = 5,
}

export declare class TeamEventBase {
	constructor(team: TeamInfo, tenant: TenantInfo);
}

export declare class ChannelCreatedEvent {
	constructor(channel: ChannelInfo, team: TeamInfo, tenant: TenantInfo);
}

export declare class ChannelDeletedEvent {
	constructor(channel: ChannelInfo, team: TeamInfo, tenant: TenantInfo);
}

export declare class ChannelRenamedEvent {
	constructor(channel: ChannelInfo, team: TeamInfo, tenant: TenantInfo);
}

export declare class MembersAddedEvent {
	constructor(membersAdded: Array<builder.IIdentity>, team: TeamInfo, tenant: TenantInfo);
}

export declare class MembersRemovedEvent {
	constructor(membersRemoved: Array<builder.IIdentity>, team: TeamInfo, tenant: TenantInfo);
}

export declare class TeamRenamedEvent {
	constructor(team: TeamInfo, tenant: TenantInfo);
}

