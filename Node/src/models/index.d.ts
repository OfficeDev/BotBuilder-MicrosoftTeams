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
 * Initializes a new instance of the ChannelAccount class.
 * @constructor
 * A channel account object which decribes the member.
 * @member {string} [id] Unique identifier representing a member
 *
 * @member {string} [obejctId] User Id
 *
 * @member {string} [givenName] Name of the member
 *
 * @member {string} [surname] Name of the member
 *
 * @member {string} [userPrincipalName] Name of the member
 *
 * @member {string} [email] Email of the member
 *
 *
 */
export interface ChannelAccount {
  id: string;
  objectId: string;
  givenName: string;
  surname: string;
  email: string;
  userPrincipalName: string;
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

/**
 * @class
 * Initializes a new instance of the ComposeExtensionQueryOptions class.
 * @constructor
 * Compose extensions query options
 *
 * @member {number} [skip] Number of entities to skip
 *
 * @member {number} [count] Number of entities to fetch
 *
 */
export interface ComposeExtensionQueryOptions {
  skip?: number;
  count?: number;
}

/**
 * @class
 * Initializes a new instance of the ComposeExtensionParameter class.
 * @constructor
 * Compose extension query parameters
 *
 * @member {string} [name] Name of the parameter
 *
 * @member {object} [value] Value of the parameter
 *
 */
export interface ComposeExtensionParameter {
  name?: string;
  value?: any;
}

/**
 * @class
 * Initializes a new instance of the ComposeExtensionQuery class.
 * @constructor
 * Compose extension query
 *
 * @member {string} [commandId] Id of the command assigned by Bot
 *
 * @member {array} [parameters] Parameters for the query
 *
 * @member {object} [queryOptions]
 *
 * @member {number} [queryOptions.skip] Number of entities to skip
 *
 * @member {number} [queryOptions.count] Number of entities to fetch
 *
 * @member {string} [state] state parameter used by the bot to send back at the end of authentication/configuration flow
 *
 */
export interface ComposeExtensionQuery {
  commandId?: string;
  parameters?: ComposeExtensionParameter[];
  queryOptions?: ComposeExtensionQueryOptions;
  state?: string;
}

/**
 * @class
 * Initializes a new instance of the ComposeExtensionAttachment class.
 * @constructor
 * Compose extension attachment.
 *
 * @member {object} [preview]
 *
 * @member {string} [preview.contentType] mimetype/Contenttype for the file
 *
 * @member {string} [preview.contentUrl] Content Url
 *
 * @member {object} [preview.content] Embedded content
 *
 * @member {string} [preview.name] (OPTIONAL) The name of the attachment
 *
 * @member {string} [preview.thumbnailUrl] (OPTIONAL) Thumbnail associated with
 * attachment
 *
 */
export interface ComposeExtensionAttachment extends builder.IAttachment {
  preview?: builder.IAttachment;
}

/**
 * @class
 * Initializes a new instance of the ComposeExtensionResult class.
 * @constructor
 * Compose extension result
 *
 * @member {string} [attachmentLayout] Hint for how to deal with multiple
 * attachments.
 *
 * @member {string} [type] The type of the result
 *
 * @member {array} [attachments] Attachments
 *
 * @member {array} [suggestedActions] suggestedActions
 *
 * @member {string} [text] text
 */

export interface ComposeExtensionResult {
  attachmentLayout?: string;
  type?: string;
  attachments?: ComposeExtensionAttachment[];
  suggestedActions?: builder.ISuggestedActions;
  text?: string;
}


/**
 * @class
 * Initializes a new instance of the ComposeExtensionResponse class.
 * @constructor
 * Compose extension response
 *
 * @member {object} [composeExtension]
 *
 * @member {string} [composeExtension.attachmentLayout] Hint for how to deal
 * with multiple attachments.
 *
 * @member {string} [composeExtension.type] The type of the result
 *
 * @member {array} [composeExtension.attachments] Attachments
 *
 */
export interface IComposeExtensionResponse {
  composeExtension?: ComposeExtensionResult;
}

export class ComposeExtensionResponse {

  constructor(type: string);

  result(attachmentLayout: string):  ComposeExtensionResponse;

  auth(): ComposeExtensionResponse;

  config(): ComposeExtensionResponse;

  attachments(list: ComposeExtensionAttachment[]): ComposeExtensionResponse;

  actions(list: builder.CardAction[]): ComposeExtensionResponse;

  toResponse(): IComposeExtensionResponse
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
