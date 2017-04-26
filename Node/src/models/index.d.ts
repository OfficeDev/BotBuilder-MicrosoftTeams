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


import * as moment from "moment";


/**
 * @class
 * Initializes a new instance of the ChannelInfo class.
 * @constructor
 * A channel info object which decribes the channel.
 * @member {string} [name] Name of the channel
 *
 * @member {string} [id] Unique identifier representing a channel
 *
 *
 */
export interface ChannelInfo {
  name?: string;
  id?: string;
}

/**
 * @class
 * Initializes a new instance of the ConversationList class.
 * @constructor
 * List of channels under a team
 *
 * @member {array} [conversations]
 *
 */
export interface ConversationList {
  conversations?: ChannelInfo[];
}

/**
 * @class
 * Initializes a new instance of the TeamInfo class.
 * @constructor
 * Describes a team
 *
 * @member {string} [name] Name of team.
 *
 * @member {string} [id] Unique identifier representing a team
 *
 *
 */
export interface TeamInfo {
  name?: string;
  id?: string;
}

/**
 * @class
 * Initializes a new instance of the TenantInfo class.
 * @constructor
 * Describes a tenant
 *
 * @member {string} [id] Unique identifier representing a tenant
 *
 */
export interface TenantInfo {
  id?: string;
}

/**
 * @class
 * Initializes a new instance of the TeamsChannelData class.
 * @constructor
 * List of channels under a team
 *
 * @member {object} [channel]
 *
 * @member {string} [channel.id] Unique identifier representing a channel
 *
 * @member {string} [channel.name] Name of the channel
 *
 * @member {string} [eventType] Type of event.
 *
 * @member {object} [team]
 *
 * @member {string} [team.id] Unique identifier representing a team
 *
 * @member {string} [team.name] Name of team.
 *
 * @member {object} [tenant]
 *
 * @member {string} [tenant.id] Unique identifier representing a tenant
 *
 */
export interface TeamsChannelData {
  channel?: ChannelInfo;
  eventType?: string;
  team?: TeamInfo;
  tenant?: TenantInfo;
}

/**
 * @class
 * Initializes a new instance of the O365ConnectorCardFact class.
 * @constructor
 * O365 connector card fact
 *
 * @member {string} [name] Name of the fact
 *
 * @member {string} [value] Value for the fact
 *
 */
export interface O365ConnectorCardFact {
  name?: string;
  value?: string;
}

/**
 * @class
 * Initializes a new instance of the O365ConnectorCardImage class.
 * @constructor
 * O365 connector card image
 *
 * @member {string} [image] URL for the image
 *
 */
export interface O365ConnectorCardImage {
  image?: string;
}

/**
 * @class
 * Initializes a new instance of the O365ConnectorCardActionBase class.
 * @constructor
 * O365 connector card action base
 *
 * @member {string} [type] Type of the item
 *
 */
export interface O365ConnectorCardActionBase {
  type?: string;
}

/**
 * @class
 * Initializes a new instance of the O365ConnectorCardSection class.
 * @constructor
 * O365 connector card section
 *
 * @member {string} [title] Title of the section
 *
 * @member {string} [text] Text for the section
 *
 * @member {string} [activityTitle] Activity title
 *
 * @member {string} [activitySubtitle] Activity subtitle
 *
 * @member {string} [activityText] Activity text
 *
 * @member {string} [activityImage] Activity image
 *
 * @member {array} [facts] Set of sections for the current card
 *
 * @member {array} [images] Set of sections for the current card
 *
 * @member {array} [potentialAction] Set of sections for the current card
 *
 */
export interface O365ConnectorCardSection {
  title?: string;
  text?: string;
  activityTitle?: string;
  activitySubtitle?: string;
  activityText?: string;
  activityImage?: string;
  facts?: O365ConnectorCardFact[];
  images?: O365ConnectorCardImage[];
  potentialAction?: O365ConnectorCardActionBase[];
}

/**
 * @class
 * Initializes a new instance of the O365ConnectorCard class.
 * @constructor
 * O365 connector card
 *
 * @member {string} [title] Title of the item
 *
 * @member {string} [text] Text for the card
 *
 * @member {string} [summary] Summary for the card
 *
 * @member {string} [themeColor] Theme color for the card
 *
 * @member {array} [sections] Set of sections for the current card
 *
 */
export interface O365ConnectorCard {
  title?: string;
  text?: string;
  summary?: string;
  themeColor?: string;
  sections?: O365ConnectorCardSection[];
}

/**
 * @class
 * Initializes a new instance of the O365ConnectorCardViewAction class.
 * @constructor
 * @member {string} [name] Name of the action
 *
 * @member {array} [target] Target urls
 *
 */
export interface O365ConnectorCardViewAction extends O365ConnectorCardActionBase {
  name?: string;
  target?: string[];
}

export declare class ChannelInfo {
  constructor(name: string, id: string);
}

export declare class TeamInfo {
  constructor(name: string, id: string);
}

export declare class TenantInfo {
  constructor(id: string);
}
