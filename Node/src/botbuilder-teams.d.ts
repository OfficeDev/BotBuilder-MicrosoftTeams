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
 * @interface
 * Interface of O365 connector card
 *
 * @member {string} [title] Title of the card
 *
 * @member {string} [text] Text for the card
 *
 * @member {string} [summary] Summary for the card
 *
 * @member {string} [themeColor] Theme color for the card
 *
 * @member {array} [sections] Set of sections for the current card
 *
 * @member {array} [potentialAction] Set of actions for the current card
 *
 */
export interface IO365ConnectorCard {
  title?: string;
  text?: string;
  summary: string;
  themeColor?: string;
  sections?: IO365ConnectorCardSection[];
  potentialAction?: IO365ConnectorCardActionBase[];
}

/**
 * @interface
 * Interface of O365 connector card section
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
 * @member {boolean} [markdown] Use markdown for all text contents. Default vaule is true.
 *
 * @member {array} [facts] Set of facts for the current section
 *
 * @member {array} [images] Set of images for the current section
 *
 * @member {array} [potentialAction] Set of actions for the current section
 *
 */
export interface IO365ConnectorCardSection {
  title?: string;
  text?: string;
  activityTitle?: string;
  activitySubtitle?: string;
  activityText?: string;
  activityImage?: string;
  markdown?: boolean;
  facts: IO365ConnectorCardFact[];
  images: IO365ConnectorCardImage[];
  potentialAction?: IO365ConnectorCardActionBase[];
}

export interface IIsO365ConnectorCardSection {
  toSection(): IO365ConnectorCardSection;
}

/**
 * @interface
 * Interface of O365 connector card fact
 *
 * @member {string} [name] Display name of the fact
 *
 * @member {string} [value] Display value for the fact
 *
 */
export interface IO365ConnectorCardFact {
  name: string;
  value: string;
}

export interface IIsO365ConnectorCardFact {
  toFact(): IO365ConnectorCardFact;
}

/**
 * @interface
 * Interface of O365 connector card image
 *
 * @member {string} [image] URL for the image
 *
 * @member {string} [title] Alternative text for the image
 *
 */
export interface IO365ConnectorCardImage {
  image: string;
  title?: string;
}

export interface IIsO365ConnectorCardImage {
  toImage(): IO365ConnectorCardImage;
}

/**
 * @interface
 * Base interface of O365 connector card action.
 *
 * @member {string} [type] Type of the action
 *
 * @member {string} [name] Name of the action that will be used as button title
 *
 * @member {string} [id] Action Id
 *
 */
export interface IO365ConnectorCardActionBase {
  readonly type: string;
  name: string;
  id?: string;
}

export interface IIsO365ConnectorCardActionBase {
  toAction(): IO365ConnectorCardActionBase;
}

/**
 * @interface
 * Interface of O365 connector card ViewAction action
 *
 * @member {array} [target] Target urls, only the first url effective for card button
 *
 */
export interface IO365ConnectorCardViewAction extends IO365ConnectorCardActionBase {
  target: string[];
}

/**
 * @type
 * Type of literal strings used for OpenUri target (IO365ConnectorCardOpenUriTarget) operating systems (os).
 *
 */
export type O365ConnectorCardOpenUriOS = 'default' | 'iOS' | 'android' | 'windows';

/**
 * @interface
 * Interface of O365 connector card OpenUri target
 *
 * @member {O365ConnectorCardOpenUriOS} [os] Target operating system
 *
 * @member {string} [uri] Target url
 *
 */
export interface IO365ConnectorCardOpenUriTarget {
  os: O365ConnectorCardOpenUriOS;
  uri: string;
}

/**
 * @interface
 * Interface of O365 connector card OpenUri action
 *
 * @member {O365ConnectorCardOpenUriOS} [os] Target operating system
 *
 * @member {string} [uri] Target url
 *
 */
export interface IO365ConnectorCardOpenUri extends IO365ConnectorCardActionBase {
  targets: IO365ConnectorCardOpenUriTarget[];
}

/**
 * @interface
 * Interface of O365 connector card HttpPOST action
 * 
 * @member {string} [body] Content to be posted back to bots via invoke.
 *
 */
export interface IO365ConnectorCardHttpPOST extends IO365ConnectorCardActionBase {
  body?: string;
}

/**
 * @interface
 * Interface of O365 connector card ActionCard action
 * 
 * @member {array} [inputs] Set of inputs contained in this ActionCard whose each item can be in any subtype of IO365ConnectorCardInputBase
 * 
 * @member {array} [actions] Set of actions contained in this ActionCard whose each item can be in any subtype of IO365ConnectorCardInputBase except IO365ConnectorCardActionCard, as nested ActionCard is forbidden.
 *
 */
export interface IO365ConnectorCardActionCard extends IO365ConnectorCardActionBase {
  inputs: IO365ConnectorCardInputBase[];
  actions: IO365ConnectorCardActionBase[];
}

/**
 * @interface
 * Base interface of O365 connector card input for ActionCard action
 * 
 * @member {string} [type] Input type name
 * 
 * @member {string} [id] Input Id. It must be unique per entire O365 connector card.
 * 
 * @member {boolean} [isRequired] Define if this input is a required field. Default value is false.
 * 
 * @member {string} [title] Input title that will be shown as the placeholder
 * 
 * @member {string} [value] Default value for this input field
 */
export interface IO365ConnectorCardInputBase {
  id: string;
  isRequired?: boolean;
  title: string;
  value: string;
}

export interface IIsO365ConnectorCardInputBase {
  toInput(): IO365ConnectorCardInputBase;
}

/**
 * @interface
 * Interface of O365 connector card text input
 * 
 * @member {boolean} [isMultiline] Define if text input is allowed for multiple lines. Default value is false.
 * 
 * @member {number} [maxLength] Maximum length of text input. Default value is unlimited.
 *  
 */
export interface IO365ConnectorCardTextInput extends IO365ConnectorCardInputBase{
  isMultiline?: boolean;
  maxLength?: number;
}

/**
 * @interface
 * Interface of O365 connector card date input
 * 
 * @member {boolean} [includeTime] Include time input field. Default value  is false (date only).
 *  
 */
export interface IO365ConnectorCardDateInput extends IO365ConnectorCardInputBase{
  includeTime?: boolean;
}

/**
 * @interface
 * Interface of O365 connector card multiple choice input
 * 
 * @member {array} [choices] Set of choices whose each item can be in any subtype of IO365ConnectorCardMultichoiceInputChoice.
 * 
 * @member {O365ConnectorCardMultichoiceInputStyle} [style] Choice item rendering style. Could be 'compact' (default) or 'expanded'.
 * 
 * @member {boolean} [isMultiSelect] Define if this input field allows multiple selections. Default value is false.
 *  
 */
export interface IO365ConnectorCardMultichoiceInput extends IO365ConnectorCardInputBase{
  choices: IO365ConnectorCardMultichoiceInputChoice[];
  style?: O365ConnectorCardMultichoiceInputStyle;
  isMultiSelect?: boolean; 
}

/**
 * @type
 * Type of literal strings used for multi-choice input (IO365ConnectorCardMultichoiceInput) rendering style.
 *
 */
export type O365ConnectorCardMultichoiceInputStyle = 'compact' | 'expanded';

/**
 * @interface
 * Interface of O365 connector card multiple choice input item
 * 
 * @member {string} [display] The text rednered on ActionCard.
 * 
 * @member {string} [value] The value received as results.
 * 
 */
export interface IO365ConnectorCardMultichoiceInputChoice {
  display: string;
  value: string;
}

export interface IIsO365ConnectorCardMultichoiceInputChoice {
  toChoice(): IO365ConnectorCardMultichoiceInputChoice;
}

/**
 * @interface
 * Interface of O365 connector card HttpPOST invoke query
 * 
 * @member {string} [body] The results of body string defined in IO365ConnectorCardHttpPOST with substituted input values
 * 
 * @member {string} [actionId] Action Id associated with the HttpPOST action button triggered, defined in IO365ConnectorCardActionBase.
 *  
 */
export interface IO365ConnectorCardActionQuery {
  body: string;
  actionId: string;
}

/** Card builder class that simplifies building O365 connector cards. */
export declare class O365ConnectorCard implements builder.IIsAttachment {

  /** 
   * Creates a new O365 connector card. 
   * @param session (Optional) will be used to localize any text. 
   */
  constructor(session?: builder.Session);

  /** Title of the card. */
  title(text: string|string[], ...args: any[]): O365ConnectorCard;

  /** Text for the card. */
  text(text: string|string[], ...args: any[]): O365ConnectorCard;

  /** Summary for the card. */
  summary(text: string|string[], ...args: any[]): O365ConnectorCard;

  /** Theme color for the card. */
  themeColor(text: string|string[], ...args: any[]): O365ConnectorCard;

  /** Set of sections for the current card. */
  sections(list: IO365ConnectorCardSection[]|IIsO365ConnectorCardSection[]): O365ConnectorCard;
  
  /** Set of actions for the current card. */
  potentialAction(list: IO365ConnectorCardActionBase[]|IIsO365ConnectorCardActionBase[]): O365ConnectorCard;

  /** Returns the JSON for the card */
  toAttachment(): builder.IAttachment;
}

/** Card builder class that simplifies building O365 connector card sections. */
export declare class O365ConnectorCardSection implements IIsO365ConnectorCardSection {

  /** 
   * Creates a new O365 connector card section. 
   * @param session (Optional) will be used to localize any text. 
   */
  constructor(session?: builder.Session);

  /** Title of the section. */
  title(text: string|string[], ...args: any[]): O365ConnectorCardSection;

  /** Text for the section. */
  text(text: string|string[], ...args: any[]): O365ConnectorCardSection;

  /** Activity title. */
  activityTitle(text: string|string[], ...args: any[]): O365ConnectorCardSection;

  /** Activity subtitle. */
  activitySubtitle(text: string|string[], ...args: any[]): O365ConnectorCardSection;

  /** Activity text. */
  activityText(text: string|string[], ...args: any[]): O365ConnectorCardSection;

  /** Activity image. */
  activityImage(imageUrl: string): O365ConnectorCardSection;

  /** Use markdown for all text contents. Default value is true. */
  markdown(flag: boolean): O365ConnectorCardSection;

  /** Set of facts for the current section. */
  facts(list: IO365ConnectorCardFact[]|IIsO365ConnectorCardFact[]): O365ConnectorCardSection;

  /** Set of images for the current section. */
  images(list: IO365ConnectorCardImage[]|IIsO365ConnectorCardImage[]): O365ConnectorCardSection;

  /** Set of actions for the current section. */
  potentialAction(list: IO365ConnectorCardActionBase[]|IIsO365ConnectorCardActionBase[]): O365ConnectorCardSection;
  
  /** Returns the JSON for the current section */
  toSection(): IO365ConnectorCardSection;
}

/** Card builder class that simplifies building O365 connector card section facts. */
export declare class O365ConnectorCardFact implements IIsO365ConnectorCardFact {

  /** 
   * Creates a new O365 connector card section fact. 
   * @param session (Optional) will be used to localize any text. 
   */
  constructor(session?: builder.Session);

  /** Display name of the fact. */
  name(v: string): O365ConnectorCardFact;

  /** Display value for the fact. */
  value(text: string|string[], ...args: any[]): O365ConnectorCardFact;

  /** Returns the JSON for the current fact */
  toFact(): IO365ConnectorCardFact;
}

/** Card builder class that simplifies building O365 connector card section images. */
export declare class O365ConnectorCardImage implements IIsO365ConnectorCardImage {

  /** 
   * Creates a new O365 connector card section image. 
   * @param session (Optional) will be used to localize any text. 
   */  
  constructor(session?: builder.Session);

  /** URL for the image. */
  image(url: string): O365ConnectorCardImage;

  /** Alternative text for the image. */
  title(text: string|string[], ...args: any[]): O365ConnectorCardImage;

  /** Returns the JSON for the current image. */
  toImage(): IO365ConnectorCardImage;
}

/** Card builder class that simplifies building O365 connector ViewAction action. */
export declare class O365ConnectorCardViewAction implements IIsO365ConnectorCardActionBase {

  /** 
   * Creates a new O365 connector card ViewAction action object. 
   * @param session (Optional) will be used to localize any text. 
   */  
  constructor(session?: builder.Session);

  /** Name of the action that will be used as button title. */
  name(text: string|string[], ...args: any[]): O365ConnectorCardViewAction;

  /** Action Id. */
  id(actionId: string): O365ConnectorCardViewAction;

  /** Target URL. */
  target(targetUrl: string): O365ConnectorCardViewAction;

  /** Returns the JSON for the current action. */
  toAction(): IO365ConnectorCardViewAction;
}

/** Card builder class that simplifies building O365 connector OpenUri action. */
export declare class O365ConnectorCardOpenUri implements IIsO365ConnectorCardActionBase {

  /** 
   * Creates a new O365 connector card OpenUri action object. 
   * @param session (Optional) will be used to localize any text. 
   */  
  constructor(session?: builder.Session);

  /** Name of the action that will be used as button title. */  
  name(text: string|string[], ...args: any[]): O365ConnectorCardOpenUri;

  /** Action Id. */
  id(actionId: string): O365ConnectorCardOpenUri;

  /** Directly assign target urls associated different platforms. */
  targets(platformUrlMap: {[os in O365ConnectorCardOpenUriOS]?: string}): O365ConnectorCardOpenUri;

  /** Default target URL. It will be also used for desktop / web clients. */
  default(targetUrl: string): O365ConnectorCardOpenUri;

  /** Target URL for iOS devices. */
  iOS(targetUrl: string): O365ConnectorCardOpenUri;

  /** Target URL for Android devices. */
  android(targetUrl: string): O365ConnectorCardOpenUri;

  /** Target URL for Windows phone. */
  windowsPhone(targetUrl: string): O365ConnectorCardOpenUri;
  
  /** Returns the JSON for the current action. */
  toAction(): IO365ConnectorCardOpenUri;
}

/** Card builder class that simplifies building O365 connector HttpPOST action. */
export declare class O365ConnectorCardHttpPOST implements IIsO365ConnectorCardActionBase {

  /** 
   * Creates a new O365 connector card HttpPOST action object. 
   * @param session (Optional) will be used to localize any text. 
   */  
  constructor(session?: builder.Session);

  /** Name of the action that will be used as button title. */  
  name(text: string|string[], ...args: any[]): O365ConnectorCardHttpPOST;

  /** Action Id. */
  id(actionId: string): O365ConnectorCardHttpPOST;

  /** Content to be posted back to bots via invoke. */
  body(text: string): O365ConnectorCardHttpPOST;
  
  /** Returns the JSON for the current action. */
  toAction(): IO365ConnectorCardHttpPOST;
}

/** Card builder class that simplifies building O365 connector ActionCard action. */
export declare class O365ConnectorCardActionCard implements IIsO365ConnectorCardActionBase {

  /** 
   * Creates a new O365 connector card ActionCard action object. 
   * @param session (Optional) will be used to localize any text. 
   */  
  constructor(session?: builder.Session);

  /** Name of the action that will be used as button title. */  
  name(text: string|string[], ...args: any[]): O365ConnectorCardActionCard;

  /** Action Id. */
  id(actionId: string): O365ConnectorCardActionCard;

  /** Set of actions contained in this ActionCard whose each item can be any type of other actions except O365ConnectorCardActionCard, as nested ActionCard is forbidden. */
  actions(list: IO365ConnectorCardActionBase[]|IIsO365ConnectorCardActionBase[]): O365ConnectorCardActionCard;

  /** Set of inputs contained in this ActionCard. */
  inputs(list: IO365ConnectorCardInputBase[]|IIsO365ConnectorCardInputBase[]): O365ConnectorCardActionCard;
  
  /** Returns the JSON for the current action. */
  toAction(): IO365ConnectorCardActionCard;
}

/** Card builder class that simplifies building O365 connector text inputs. */
export declare class O365ConnectorCardTextInput implements IIsO365ConnectorCardInputBase {

  /** 
   * Creates a new O365 connector card TextInput object. 
   * @param session (Optional) will be used to localize any text. 
   */  
  constructor(session?: builder.Session);

  /** Input Id. It must be unique per entire O365 connector card. */
  id(inputId: string): O365ConnectorCardTextInput;

  /** Define if this input is a required field. Default value is false. */
  isRequired(flag: boolean): O365ConnectorCardTextInput;

  /** Input title that will be shown as the placeholder. */
  title(text: string|string[], ...args: any[]): O365ConnectorCardTextInput;

  /** Default value for this input field. */
  value(text: string): O365ConnectorCardTextInput;

  /** Define if text input is allowed for multiple lines. Default value is false. */
  isMultiline(flag: boolean): O365ConnectorCardTextInput;

  /** Maximum length of text input. Default value is unlimited. */
  maxLength(len: number): O365ConnectorCardTextInput;

  /** Returns the JSON for the current input. */
  toInput(): IO365ConnectorCardTextInput;
}

/** Card builder class that simplifies building O365 connector date inputs. */
export declare class O365ConnectorCardDateInput implements IIsO365ConnectorCardInputBase {

  /** 
   * Creates a new O365 connector card DateInput object. 
   * @param session (Optional) will be used to localize any text. 
   */  
  constructor(session?: builder.Session);

  /** Input Id. It must be unique per entire O365 connector card. */
  id(inputId: string): O365ConnectorCardDateInput;

  /** Define if this input is a required field. Default value is false. */
  isRequired(flag: boolean): O365ConnectorCardDateInput;

  /** Input title that will be shown as the placeholder. */
  title(text: string|string[], ...args: any[]): O365ConnectorCardDateInput;

  /** Default value for this input field. */
  value(text: string): O365ConnectorCardDateInput;

  /** Include time input field. Default value  is false (date only). */
  includeTime(flag: boolean): O365ConnectorCardDateInput;

  /** Returns the JSON for the current input. */
  toInput(): IO365ConnectorCardDateInput;
}

/** Card builder class that simplifies building O365 connector multiple-choice inputs. */
export declare class O365ConnectorCardMultichoiceInput implements IIsO365ConnectorCardInputBase {

  /** 
   * Creates a new O365 connector card MultichoiceInput object. 
   * @param session (Optional) will be used to localize any text. 
   */  
  constructor(session?: builder.Session);

  /** Input Id. It must be unique per entire O365 connector card. */
  id(inputId: string): O365ConnectorCardMultichoiceInput;

  /** Define if this input is a required field. Default value is false. */
  isRequired(flag: boolean): O365ConnectorCardMultichoiceInput;

  /** Input title that will be shown as the placeholder. */
  title(text: string|string[], ...args: any[]): O365ConnectorCardMultichoiceInput;

  /** Default value for this input field. */
  value(text: string): O365ConnectorCardMultichoiceInput;

  /** Define if this input field allows multiple selections. Default value is false (single selection). */
  isMultiSelect(flag: boolean): O365ConnectorCardMultichoiceInput;

  /** Choice item rendering style. Could be 'compact' (default) or 'expanded'. */
  style(s: O365ConnectorCardMultichoiceInputStyle): O365ConnectorCardMultichoiceInput;

  /** Set choice item rendering style to be 'compact' - items will be rendered as a dropdown list. */
  compactStyle(): O365ConnectorCardMultichoiceInput;

  /** Set choice item rendering style to be 'expanded' - items will be rednered as an expanded item list (radiobox or checkbox). */
  expandedStyle(): O365ConnectorCardMultichoiceInput;

  /** Set of choices. */
  choices(list: IO365ConnectorCardMultichoiceInputChoice[]|IIsO365ConnectorCardMultichoiceInputChoice[]): O365ConnectorCardMultichoiceInput;

  /** Returns the JSON for the current input. */
  toInput(): IO365ConnectorCardMultichoiceInput;
}

/** Card builder class that simplifies building O365 connector MultichoiceInput choice items. */
export declare class O365ConnectorCardMultichoiceInputChoice implements IIsO365ConnectorCardMultichoiceInputChoice {

  /** 
   * Creates a new O365 connector card MultichoiceInput choice item. 
   * @param session (Optional) will be used to localize any text. 
   */  
  constructor(session?: builder.Session);

  /** The text rednered on ActionCard. */
  display(text: string|string[], ...args: any[]): O365ConnectorCardMultichoiceInputChoice;

  /** The value received as results. */
  value(text: string): O365ConnectorCardMultichoiceInputChoice;

  /** Returns the JSON for the current choice item. */
  toChoice(): IO365ConnectorCardMultichoiceInputChoice;
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

  static result(attachmentLayout: string):  ComposeExtensionResponse;

  static auth(): ComposeExtensionResponse;

  static config(): ComposeExtensionResponse;

  static message(): ComposeExtensionResponse;

  attachments(list: ComposeExtensionAttachment[]): ComposeExtensionResponse;

  actions(list: builder.CardAction[]): ComposeExtensionResponse;

  text(text: string): ComposeExtensionResponse;

  toResponse(): IComposeExtensionResponse
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

export declare class ChannelInfo {
  constructor(name: string, id: string);
}

export declare class TeamInfo {
  constructor(name: string, id: string);
}

export declare class TenantInfo {
  constructor(id: string);
}

export type ComposeExtensionHandlerType = (event: builder.IEvent, query: ComposeExtensionQuery, callback: (err: Error, result: IComposeExtensionResponse, statusCode: number) => void) => void;
export type O365ConnectorCardActionHandlerType = (event: builder.IEvent, query: IO365ConnectorCardActionQuery, callback: (err: Error, result: any, statusCode: number) => void) => void;

export interface IInvokeEvent extends builder.IEvent {
  name: string;
  value: any;
}

export class TeamsChatConnector extends builder.ChatConnector {
  public static queryInvokeName: string;
  public static querySettingUrlInvokeName: string;
  public static settingInvokeName: string;

  constructor(settings?: builder.IChatConnectorSettings);

  /**
  *  Return a list of conversations in a team
  *  @param {string} serverUrl - Server url is composed of baseUrl and cloud name, remember to find your correct cloud name in session or the function will not find the team.
  *  @param {string} teamId - The team id, you can look it up in session object.
  *  @param {function} callback - This callback returns err or result.
  */
  public fetchChannelList(serverUrl: string, teamId: string, callback: (err: Error, result: ChannelInfo[]) => void) : void;

  /**
  *  @deprecated Since version 0.1.2 Will be deleted in version 0.1.5. Use fetchMembers(serverUrl, conversationId, callback).
  *  Return a list of members in a conversation or channel
  *  @param {string} serverUrl - Server url is composed of baseUrl and cloud name, remember to find your correct cloud name in session or the function will not find the team.
  *  @param {string} conversationId - The conversation id or channel id, you can look it up in session object.
  *  @param {string} tenantId - The tenantId, you can look it up in session object.
  *  @param {function} callback - This callback returns err or result.
  */
  public fetchMemberList(serverUrl: string, conversationId: string, tenantId: string, callback: (err: Error, result: ChannelAccount[]) => void) : void;

  /**
  *  Return a list of members in a team or channel
  *  @param {string} serverUrl - Server url is composed of baseUrl and cloud name, remember to find your correct cloud name in session or the function will not find the team.
  *  @param {string} conversationId - The conversation id or channel id, you can look it up in session object.
  *  @param {function} callback - This callback returns err or result.
  */
  public fetchMembers(serverUrl: string, conversationId: string, callback: (err: Error, result: ChannelAccount[]) => void) : void;

  /**
  *  Set the list of allowed tenants. Messages from tenants not on the list will be dropped silently.
  *  @param {array} tenants - Ids of allowed tenants.
  */
  public setAllowedTenants(tenants: string[]) : void;

  /**
  *  Reset allowed tenants, ask connector to receive every message sent from any source.
  */
  public resetAllowedTenants() : void;

  /**
  *  Set a handler for o365 connector card action execution
  */
  public onO365ConnectorCardAction(handler: O365ConnectorCardActionHandlerType): void;

  /**
  *  Set a handler by commandId of a compose extension query
  */
  public onQuery(commandId: string, handler: ComposeExtensionHandlerType): void;

  /**
  *  Set a handler for compose extension invoke request that queries setting url
  */
  public onQuerySettingsUrl(handler: ComposeExtensionHandlerType): void;

  /**
  *  Set a handler for compose extension invoke request made after setting flow is successfully finished
  */
  public onSettingsUpdate(handler: ComposeExtensionHandlerType): void;

  /**
  *  Set a handler for compose extension invoke request made when a search result item is selected
  */
  public onSelectItem(handler: ComposeExtensionHandlerType): void;
}

export enum MentionTextLocation {
  PrependText,
  AppendText
}

export class TeamsMessage extends builder.Message {

  constructor(session?: builder.Session);

  /**
  *  Enable bot to send a message to mention user
  *  @param {builder.IIdentity} mentionedUser - The team id, you can look it up in session object.
  *  @param {MentionTextLocation} textLocation - This defines append or prepend the mention text
  *  @param {string} mentionText - text to mention
  */
  public addMentionToText(mentionedUser: builder.IIdentity, textLocation?: MentionTextLocation, mentionText?: string): TeamsMessage;

  /**
  *  Return conversation update related event
  *  @param {IConversationUpdate} message - user message like adding member to channel, rename etc
  */
  public static getConversationUpdateData(message: builder.IConversationUpdate): TeamEventBase;

  /**
  *  Get message related team info
  *  @param {IEvent} message - The message sent to bot.
  */
  public static getGeneralChannel(message: builder.IEvent): ChannelInfo;

  /**
  *  Route message to general channel
  */
  public routeReplyToGeneralChannel(): TeamsMessage;

  /**
  *  Get message related tenant id
  *  @param {IEvent} message - The message sent to bot.
  */
  public static getTenantId(message: builder.IEvent): string;

  /**
  *  Retrun message without mentions
  *  @param {IMessage} message - The message with mentions
  */
  public static getTextWithoutMentions(message: builder.IMessage): string;
}

export class StripBotAtMentions implements builder.IMiddlewareMap
{
    /** Called in series once an incoming message has been bound to a session. Executed after [receive](#receive) middleware.  */
    public readonly botbuilder: builder.ISessionMiddleware|builder.ISessionMiddleware[];
}