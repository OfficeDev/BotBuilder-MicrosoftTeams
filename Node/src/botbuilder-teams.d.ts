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
// the following conditions:A
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


/** Information about a Microsoft Teams user. */
export interface ChannelAccount {
  /** Unique identifier for the user. This id should be used when sending the user a message. */
  id: string;

  /** The user's Azure AD object id in the current tenant. This value is immutable and cannot be reassigned or reused. */
  objectId: string;

  /** The user's first or "given" name. */
  givenName: string;

  /** The user's last name, surname or family name. */
  surname: string;

  /** The user's email address. */
  email: string;

  /** The user name of the user principal. */
  userPrincipalName: string;
}

export interface TeamsChannelAccountsResult {
  /** If exists, the caller can continue to call the API with continuationToken to fetch more members */
  continuationToken: string;

  /** A array of team or chat members */
  members: ChannelAccount[];
}

/** Information about a channel in a team. */
export interface ChannelInfo {
  /** Channel id */
  id: string;

  /** Name of the channel */
  name?: string;
}

/** Information about a team. */
export interface TeamInfo {
  /** Team id */
  id: string;

  /** Name of the team */
  name?: string;
}

/** Information about an Office 365 tenant. */
export interface TenantInfo {
  /** Tenant id */
  id: string;
}

/** Message notification settings. */
export interface NotificationSettings {
  /** Indicates that the message should be included in the user's activity feed. Default is false. */
  alert: boolean;
}


/** Represents the set of channel data properties relevant to Teams */
export interface TeamsChannelData {
  /** Information about the current Office 365 tenant. */
  tenant?: TenantInfo;

  /** Information about the current team. Included only for messages sent in a team, or events that relate to a team. */
  team?: TeamInfo;

  /** Information about the current channel. Included only for messages in a channel, or events that relate to a channel. */
  channel?: ChannelInfo;

  /** The kind of team event notification. Included for conversationUpdate activities relating to a team or channel. */
  eventType?: string;

  /** Notification settings for an outgoing message. */
  notification?: NotificationSettings;
}


/**
 * Represents an Office 365 connector card.
 * See the [connector card reference](https://docs.microsoft.com/en-us/outlook/actionable-messages/card-reference) for more information.
 */
export interface IO365ConnectorCard {
  /** Title of the card. */
  title?: string;

  /** Text of the card. */
  text?: string;

  /** Summary for the card, typically a quick description of the card. */
  summary: string;

  /** Custom brand color for the card. If not specified, the brand color defaults to the app's accent color. */
  themeColor?: string;

  /** A collection of sections to include in the card. */
  sections?: IO365ConnectorCardSection[];

  /** A collection of actions that can be invoked on this card. */
  potentialAction?: IO365ConnectorCardActionBase[];
}

/** Determines how the activity image is displayed */
export enum O365ConnectorCardActivityImageTypes {
  /** Image will be cropped as a circle (default) */
  Avatar,

  /** Image will be displayed as a rectangle, retaining its aspect ratio */
  Article
}

/** Represents an Office 365 connector card section. */
export interface IO365ConnectorCardSection {
  /** Title of the card section. */
  title?: string;

  /** Text of the card section. */
  text?: string;

  /** Image displayed within the section. */
  activityImage?: string;

  /** Determines how the activity image is displayed. */
  activityImageType?: string;

  /** Title text to be displayed beside the activity image (two-column layout). */
  activityTitle?: string;

  /** Subtitle text to be displayed beside the activity image (two-column layout). */
  activitySubtitle?: string;

  /** Text to be displayed beside the activity image (two-column layout). */
  activityText?: string;

  /** Indicates if the card text contains markdown. If false, markdown transformations will be not applied. */
  markdown?: boolean;

  /** A collection of facts to be displayed in the section. */
  facts: IO365ConnectorCardFact[];

  /** A collection of images to be displayed in the section. */
  images: IO365ConnectorCardImage[];

  /** A collection of actions that can be invoked on this section. */
  potentialAction?: IO365ConnectorCardActionBase[];
}

/** Implemented by classes that can be converted into an Office 365 connector card section. */
export interface IIsO365ConnectorCardSection {
  /** Returns the JSON object for the connector card section */
  toSection(): IO365ConnectorCardSection;
}

/** Represents an Office 365 connector card fact */
export interface IO365ConnectorCardFact {
  /** Display name */
  name: string;
  /** Display value */
  value: string;
}

/** Implemented by classes that can be converted into an Office 365 connector card fact. */
export interface IIsO365ConnectorCardFact {
  /** Returns the JSON object for the fact */
  toFact(): IO365ConnectorCardFact;
}

/** Represents an Office 365 connector card image */
export interface IO365ConnectorCardImage {
  /** Image url */
  image: string;

  /** Alternative text for the image */
  title?: string;
}

/** Implemented by classes that can be converted into an Office 365 connector card image. */
export interface IIsO365ConnectorCardImage {
  /** Returns the JSON object for the image */
  toImage(): IO365ConnectorCardImage;
}

/** Represents an Office 365 connector card action */
export interface IO365ConnectorCardActionBase {
  /** Type of the action */
  readonly type: string;

  /** Name of the action. This string is used as the title of the button. */
  name: string;

  /** Action id */
  id?: string;
}

/** Implemented by classes that can be converted into an Office 365 connector card action. */
export interface IIsO365ConnectorCardActionBase {
  /** Returns the JSON object for the action */
  toAction(): IO365ConnectorCardActionBase;
}

/** Represents a ViewAction action. */
export interface IO365ConnectorCardViewAction extends IO365ConnectorCardActionBase {
  /** Array of target urls. Only the first url is used, and will be launched when the button is clicked. */
  target: string[];
}

/** Specifies the platform options for an OpenUri action */
 export type O365ConnectorCardOpenUriOS = 'default' | 'iOS' | 'android' | 'windows';

/** Represents the target URI for an OpenUri action */
export interface IO365ConnectorCardOpenUriTarget {
  /** The operating system on which URI will be used, or 'default' */
  os: O365ConnectorCardOpenUriOS;

  /** The URI that will be used on the specified platform */
  uri: string;
}

/** Represents an OpenUri action. */
export interface IO365ConnectorCardOpenUri extends IO365ConnectorCardActionBase {
  /** A collection of target URIs for different platforms. */
  targets: IO365ConnectorCardOpenUriTarget[];
}

/** Represents an HttpPOST action. */
export interface IO365ConnectorCardHttpPOST extends IO365ConnectorCardActionBase {
  /** A template for the payload that will be posted back to the bot via an invoke message */
  body?: string;
}

/** Represents an ActionCard action, which shows a subcard that can take user input. */
export interface IO365ConnectorCardActionCard extends IO365ConnectorCardActionBase {
  /** A collection of input fields that will be displayed on the action card. */
  inputs: IO365ConnectorCardInputBase[];

  /** A collection of actions that can be invoked on the action card. The actions cannot include another IO365ConnectorCardActionCard action. */
  actions: IO365ConnectorCardActionBase[];
}

/** Represents an input field in an Office 365 connector card. */
export interface IO365ConnectorCardInputBase {
  /** Field id */
  id: string;

  /** Determines if the field is required. Default value is false. */
  isRequired?: boolean;

  /** Field title, typically displayed as placeholder text. */
  title: string;

  /** Field default/initial value. */
  value: string;
}

/** Implemented by classes that can be converted into an Office 365 connector card input field. */
export interface IIsO365ConnectorCardInputBase {
  /** Returns the JSON for the input field */
  toInput(): IO365ConnectorCardInputBase;
}

/** Represents a text input field in an Office 365 connector card. */
export interface IO365ConnectorCardTextInput extends IO365ConnectorCardInputBase {
  /** Determines if text input is allowed to contain newlines. Default value is false. */
  isMultiline?: boolean;

  /** Maximum length of the text input. Default value is unlimited. */
  maxLength?: number;
}

/** Represents a date input field in an Office 365 connector card. */
export interface IO365ConnectorCardDateInput extends IO365ConnectorCardInputBase {
  /** Determines if time input should be included. Default value is false (date input only). */
  includeTime?: boolean;
}

/** Represents a multiple-choice input field in an Office 365 connector card. */
export interface IO365ConnectorCardMultichoiceInput extends IO365ConnectorCardInputBase {
  /** A collection of choices to show the user */
  choices: IO365ConnectorCardMultichoiceInputChoice[];

  /** Determines how the choices are rendered. Choices are "compact" (default) or "expanded". */
  style?: O365ConnectorCardMultichoiceInputStyle;

  /** Determines if multiple selections are allowed. Default value is false. */
  isMultiSelect?: boolean;
}

/**
 * Determines how a multiple-choice input field is rendered.
 * "compact" shows only one choice at a time. "expanded" shows all choices at once, with radio buttons or checkboxes.
 */
export type O365ConnectorCardMultichoiceInputStyle = 'compact' | 'expanded';

/** Represents a choice in a multiple-choice input field. */
export interface IO365ConnectorCardMultichoiceInputChoice {
  /** The display text for the choice. */
  display: string;

  /** The value to return when the choice is selected. For multiselect fields, this should not contain "," as that will be used as a separator. */
  value: string;
}

/** Implemented by classes that can be converted into a choice for a multiple-choice input field. */
export interface IIsO365ConnectorCardMultichoiceInputChoice {
  /** Returns the JSON for the choice */
  toChoice(): IO365ConnectorCardMultichoiceInputChoice;
}

/** Represents the value of the invoke messaage triggered by the Office 365 connector card HttpPOST action */
export interface IO365ConnectorCardActionQuery {
  /** The results of body string defined in IO365ConnectorCardHttpPOST with substituted input values. */
  body: string;

  /** The id of the HttpPOST action button that was triggered. */
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

  /** Activity image type. Only avatar and article allowed. */
  activityImageType(imageType: O365ConnectorCardActivityImageTypes): O365ConnectorCardSection;

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

  /** Set choice item rendering style to be 'expanded' - items will be rendered as an expanded item list (radiobox or checkbox). */
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

  /** The text rendered on ActionCard. */
  display(text: string|string[], ...args: any[]): O365ConnectorCardMultichoiceInputChoice;

  /** The value received as results. */
  value(text: string): O365ConnectorCardMultichoiceInputChoice;

  /** Returns the JSON for the current choice item. */
  toChoice(): IO365ConnectorCardMultichoiceInputChoice;
}


/** Represents the value of the invoke message sent at the end of the bot sign-in flow */
export interface ISigninStateVerificationQuery {
  /** The state string provided to `microsoftTeams.authentication.notifySuccess` at the end of the bot sign-in flow. */
  state: string;
}


/** Represents compose extension query options */
export interface ComposeExtensionQueryOptions {
  /** The number of entities to skip */
  skip?: number;

  /** The number of entities to return */
  count?: number;
}

/** Represents a compose extension query parameter */
export interface ComposeExtensionParameter {
  /** Parameter name */
  name: string;
  /** Parameter value */
  value: any;
}

/** Represents a compose extension query */
export interface ComposeExtensionQuery {
  /** The command id of the compose extension command, as defined in the application manifest. */
  commandId: string;

  /** The list of parameters for the compose extension query. */
  parameters?: ComposeExtensionParameter[];

  /** The query options requested by the client. */
  queryOptions?: ComposeExtensionQueryOptions;

  /** The state string provided to `microsoftTeams.authentication.notifySuccess` at the end of the authentication or configuration flow. */
  state?: string;
}

/** Represents an entity returned by a compose extension. */
export interface ComposeExtensionAttachment extends builder.IAttachment {
  /** The representation of the entity that should be used in the results list. If omitted, the preview will be based on the content of the card. */
  preview?: builder.IAttachment;
}

/** The kind of compose extension result */
export type ComposeExtensionResultType = 'result' | 'auth' | 'config' | 'message';

/**
 * Determines how the set of results is displayed.
 * "list" shows a linear list of results. "grid" shows a grid of images.
 */
export type ComposeExtensionAttachmentLayout = 'list' | 'grid';

/** Represents the result of compose extension query. */
export interface ComposeExtensionResult {
  /** The kind of result. */
  type: ComposeExtensionResultType;

  /** Determines the layout of the result list. Default is list layout. */
  attachmentLayout?: ComposeExtensionAttachmentLayout;

  /** The list of entities returned. */
  attachments?: ComposeExtensionAttachment[];

  /** The action to suggest to the user. Used for "auth" and "config" results. */
  suggestedActions?: builder.ISuggestedActions;

  /** The text to display to the user. Used for "message" result. */
  text?: string;
}

/** Represents the response to a compose extension invoke message */
export interface IComposeExtensionResponse {
  /** The result of the query. */
  composeExtension?: ComposeExtensionResult;
}

/** Response builder class that simplifies constructing the response to a compose extension invoke message. */
export class ComposeExtensionResponse {

  /**
   * Creates a new compose extension response.
   * @param type The kind of response to create.
   */
  constructor(type: ComposeExtensionResultType);

  /** Creates a new response representing the results of a query. */
  static result(attachmentLayout: string):  ComposeExtensionResponse;

  /** Creates a new response representing a request to sign in. */
  static auth(): ComposeExtensionResponse;

  /** Creates a new response representing a request to configure the extension. */
  static config(): ComposeExtensionResponse;

  /** Creates a new response representing a message to show the user. */
  static message(): ComposeExtensionResponse;

  /** Results to send to the user. */
  attachments(list: ComposeExtensionAttachment[]): ComposeExtensionResponse;

  /** Suggested actions for "auth" and "config" responses. */
  actions(list: builder.CardAction[]): ComposeExtensionResponse;

  /** Text to display for a "message" response. */
  text(text: string): ComposeExtensionResponse;

  /** Returns the corresponding JSON. */
  toResponse(): IComposeExtensionResponse
}


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

/** Base interface for team event data  */
export interface TeamEventBase {
  /** Specifies the kind of team event that occurred */
  eventType: TeamEventType;

  /** Information about the team */
  team: TeamInfo;

  /** Information about the tenant */
  tenant: TenantInfo;
}

/** Event data for ChannelCreated events */
export interface ChannelCreatedEvent extends TeamEventBase {
  /** Information about the channel that was created */
  channel: ChannelInfo;
}

/** Event data for ChannelDeleted events */
export interface ChannelDeletedEvent extends TeamEventBase {
  /** Information about the channel that was deleted */
  channel: ChannelInfo;
}

/** Event data for ChannelRenamed events */
export interface ChannelRenamedEvent extends TeamEventBase {
  /** Information about the channel that was renamed */
  channel: ChannelInfo;
}

/** Event data for MembersAdded events */
export interface MembersAddedEvent extends TeamEventBase {
  /** List of members added to the team */
  membersAdded: Array<builder.IIdentity>;
}

/** Event data for MembersRemoved events */
export interface MembersRemovedEvent extends TeamEventBase {
  /** List of members removed from the team */
  membersRemoved: Array<builder.IIdentity>;
}

/** Event data for TeamRenamed events */
export interface TeamRenamedEvent extends TeamEventBase {
}


/** Represents an invoke event received by a bot */
export interface IInvokeEvent extends builder.IEvent {
  /** Invoke event name */
  name: string;

  /** Invoke event value */
  value: any;
}

export type ComposeExtensionHandlerType = (event: builder.IEvent, query: ComposeExtensionQuery, callback: (err: Error, result: IComposeExtensionResponse, statusCode?: number) => void) => void;
export type O365ConnectorCardActionHandlerType = (event: builder.IEvent, query: IO365ConnectorCardActionQuery, callback: (err: Error, result: any, statusCode?: number) => void) => void;
export type SigninStateVerificationHandlerType = (event: builder.IEvent, query: ISigninStateVerificationQuery, callback: (err: Error, result: any, statusCode?: number) => void) => void;
export type FileConsentCardResponseHandlerType = (event: builder.IEvent, response: IFileConsentCardResponse, callback: (err: Error, result: any, statusCode?: number) => void) => void;

/** Specialization of the ChatConnector for Microsoft Teams. */
export class TeamsChatConnector extends builder.ChatConnector {

  public static queryInvokeName: string;
  public static querySettingUrlInvokeName: string;
  public static settingInvokeName: string;

  /**
   * Creates a new instance of the TeamsChatConnector.
   * @param settings (Optional) config params that let you specify the bots App ID & Password you were assigned in the Bot Frameworks developer portal.
   */
  constructor(settings?: builder.IChatConnectorSettings);

  /**
  *  Return the list of channels in a team.
  *  @param {string} serviceUrl - The team's service url, which should be taken from a previous message received from that team. If the wrong service url is used, the team will not be found and the method wil fail.
  *  @param {string} teamId - The team id.
  *  @param {function} callback - Function to invoke with the list of channels in the team.
  */
  public fetchChannelList(serviceUrl: string, teamId: string, callback: (err: Error, result: ChannelInfo[]) => void) : void;

  /**
  *  Return information about a given team.
  *  @param {string} serviceUrl - The team's service url, which should be taken from a previous message received from that team. If the wrong service url is used, the team will not be found and the method wil fail.
  *  @param {string} teamId - The team id.
  *  @param {function} callback - Function to invoke with information about the team.
  */
  public fetchTeamInfo(serviceUrl: string, teamId: string, callback: (err: Error, result: TeamInfo) => void) : void;

  /**
  *  Return a list of members in team or chat.
  *  @param {string} serviceUrl - The service url for the team or chat, which should be taken from a previous message received from that team or chat. If the wrong service url is used, the method wil fail.
  *  @param {string} conversationId - The team id or chat conversation id.
  *  @param {function} callback - Function to invoke with the list of members.
  */
  public fetchMembers(serviceUrl: string, conversationId: string, callback: (err: Error, result: ChannelAccount[]) => void) : void;

  /**
  *  Return a list of members in team or chat. The result is paginated if necessary. By default page size is 200.
  *  @param {string} serviceUrl - The service url for the team or chat, which should be taken from a previous message received from that team or chat. If the wrong service url is used, the method wil fail.
  *  @param {string} conversationId - The team id or chat conversation id.
  *  @param {function} callback - Function to invoke with the list of members.
  */
 public fetchMembersWithPaging(serviceUrl: string, conversationId: string, callback: (err: Error, result: TeamsChannelAccountsResult) => void) : void;

   /**
  *  Return a list of members in team or chat. The result is paginated if necessary. By default page size is 200.
  *  @param {string} serviceUrl - The service url for the team or chat, which should be taken from a previous message received from that team or chat. If the wrong service url is used, the method wil fail.
  *  @param {string} conversationId - The team id or chat conversation id.
  *  @param {number} pageSize - Specify the size of paging to fetch members.
  *  @param {function} callback - Function to invoke with the list of members.
  */
 public fetchMembersWithPaging(serviceUrl: string, conversationId: string, pageSize: number, callback: (err: Error, result: TeamsChannelAccountsResult) => void) : void;

  /**
  *  Return a list of members in team or chat. The result is paginated if necessary. By default page size is 200.
  *  @param {string} serviceUrl - The service url for the team or chat, which should be taken from a previous message received from that team or chat. If the wrong service url is used, the method wil fail.
  *  @param {string} conversationId - The team id or chat conversation id.
  *  @param {string} continuationToken - Pass this continuationToken to fetch more members, this is used in subsuquent calls of the API.
  *  @param {function} callback - Function to invoke with the list of members.
  */
 public fetchMembersWithPaging(serviceUrl: string, conversationId: string, continuationToken: string, callback: (err: Error, result: TeamsChannelAccountsResult) => void) : void;

  /**
  *  Return a list of members in team or chat. The result is paginated if necessary. By default page size is 200.
  *  @param {string} serviceUrl - The service url for the team or chat, which should be taken from a previous message received from that team or chat. If the wrong service url is used, the method wil fail.
  *  @param {string} conversationId - The team id or chat conversation id.
  *  @param {number} pageSize - Specify the size of paging to fetch members.
  *  @param {string} continuationToken - Pass this continuationToken to fetch more members, this is used in subsuquent calls of the API.
  *  @param {function} callback - Function to invoke with the list of members.
  */
 public fetchMembersWithPaging(serviceUrl: string, conversationId: string, pageSize: number, continuationToken: string, callback: (err: Error, result: TeamsChannelAccountsResult) => void) : void;


  /**
  *  Start a reply chain in a channel.
  *  @param {string} serviceUrl - The team's service url, which should be taken from a previous message received from that team. If the wrong service url is used, the team will not be found and the method wil fail.
  *  @param {string} channelId - The id of the channel to post to.
  *  @param {builder.IMessage|builder.IIsMessage} message - The message to post in the channel.
  *  @param {function} callback - Function to invoke with the address of the new message. The address is populated correctly with the activity id and the reply chain conversation id.
  */
  public startReplyChain(serviceUrl: string, channelId: string, message: builder.IMessage|builder.IIsMessage, callback: (err: Error, address: builder.IChatConnectorAddress) => void) : void;

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
  *  Set a handler for Office 365 connector card actions.
  *  @param handler The function to execute when an Office 365 connector card action invoke activity is received.
  */
  public onO365ConnectorCardAction(handler: O365ConnectorCardActionHandlerType): void;

  /**
  *  Set a handler to verify the final state sent by client that is originally received from signin web flow when it's finished.
  *  @param handler The function to execute when a signin state verification invoke activity is received.
  */
  public onSigninStateVerification(handler: SigninStateVerificationHandlerType): void;

  /**
  *  Set a handler for compose extension queries.
  *  @param commandId The command id.
  *  @param handler The function to execute when a compose extension query with the given command id is received.
  */
  public onQuery(commandId: string, handler: ComposeExtensionHandlerType): void;

  /**
  *  Set a handler for compose extension invoke request that asks for a settings url.
  *  @param handler The handler to execute when a compose extension query settings url invoke activity is received.
  */
  public onQuerySettingsUrl(handler: ComposeExtensionHandlerType): void;

  /**
  *  Set a handler for compose extension invoke request made after setting flow is successfully finished
  *  @param handler The function to execute when a compose extension settings update invoke activity is received.
  */
  public onSettingsUpdate(handler: ComposeExtensionHandlerType): void;

  /**
  *  Set a handler for compose extension invoke request made when a search result item is selected
  *  @param handler The function to execute when a compose extension select item invoke activity is received.
  */
  public onSelectItem(handler: ComposeExtensionHandlerType): void;

  /**
  *  Set a handler that is called when the response to a file consent card is received .
  *  @param handler The function to execute when a file consent card invoke activity is received.
  */
  public onFileConsentCardResponse(handler: FileConsentCardResponseHandlerType): void;
}

/**
 * Determines where to add the mention text to the message.
 * @deprecated Construct a MentionEntity instance, and insert its `text` property into the message.
 */
export enum MentionTextLocation {
  /** Adds the mention text to the beginning of the message. */
  PrependText,

  /** Adds the mention text to the end of the message. */
  AppendText
}

export class TeamsMessage extends builder.Message {

  /**
   * Creates a new O365 connector card.
   * @param session (Optional) will be used to localize any text.
   */
  constructor(session?: builder.Session);

  /**
  *  Return alert flag to mark this message as Alert/Notification in sourceEvent.
  */
  public static alertFlag: any;

  /**
  *  Enable bot to send a message to mention user
  *  @param {builder.IIdentity} mentionedUser - The user to mention
  *  @param {MentionTextLocation} textLocation - This defines append or prepend the mention text
  *  @param {string} mentionText - text to mention
  *  @deprecated Construct a MentionEntity instance, and insert its `text` property to the message.
  */
  public addMentionToText(mentionedUser: builder.IIdentity, textLocation?: MentionTextLocation, mentionText?: string): TeamsMessage;

  /**
  *  Returns specific event data for a team conversation update event.
  *  The activity must have been received from a team; otherwise the method will throw an error.
  *  @param {IConversationUpdate} message - user message like adding member to channel, rename etc
  */
  public static getConversationUpdateData(message: builder.IConversationUpdate): TeamEventBase;

  /**
  *  Gets a ChannelInfo object that represents the General channel of the team that corresponds to a message.
  *  The message must have been received from a team; otherwise the method will throw an error.
  *  @param {IEvent} message - The message sent to bot.
  */
  public static getGeneralChannel(message: builder.IEvent): ChannelInfo;

  /**
  *  Sets the address information in the message so that it goes to the team's General channel.
  *  The incoming message in the session must come from a team; otherwise the method will throw an error.
  */
  public routeReplyToGeneralChannel(): TeamsMessage;

  /**
  *  Gets the tenant id of the Office 365 tenant in which this message was sent.
  *  @param {IEvent} message - The message sent to bot.
  */
  public static getTenantId(message: builder.IEvent): string;

  /**
  *  Returns the text of the message, with all mentions (bot, user, team and channel) removed. The original message is not modified.
  *  @param {IMessage} message - The original message.
  */
  public static getTextWithoutMentions(message: builder.IMessage): string;
}


/** Middleware that removes all mentions of the receiving bot. */
export class StripBotAtMentions implements builder.IMiddlewareMap
{
    /** Called in series once an incoming message has been bound to a session. Executed after [receive](#receive) middleware.  */
    public readonly botbuilder: builder.ISessionMiddleware|builder.ISessionMiddleware[];
}


/** Represents a mention in a message */
export class MentionEntity {
  /** The entity type (always "mention") */
  readonly type: string;

  /** The object (user, team, or channel) to be mentioned. */
  mentioned: any;

  /** The text to show in the message. */
  text: string;
}

/** Represents a mention of a user. */
export class UserMention extends MentionEntity {
    /**
    *  Initialize a new instance of UserMention.
    *  @param {IIdentity} user - User object to mention. The user.id property is required.
    *  @param {string} text - The text to use in the message. Required if user.name is empty.
    */
    constructor(user: builder.IIdentity, text?: string);
}

/** Represents a mention of a channel. */
export class ChannelMention extends MentionEntity {
    /**
    *  Initialize a new instance of ChannelMention.
    *  @param {ChannelInfo} channel - Channel to mention. Both channel.id and channel.name are required. You can get the name from the fetchChannelList API, or use a generic name like 'channel'.
    */
    constructor(channel: ChannelInfo);
}

/** Represents a mention of a team. */
export class TeamMention extends MentionEntity {
    /**
    *  Initialize a new instance of TeamMention.
    *  @param {TeamInfo} team - Team to mention. Both team.id and team.name are required. You can get the name from the fetchTeamInfo API, or use a generic name like 'team'.
    */
    constructor(team: TeamInfo);
}


/**
 * File consent card builder class.
 */
export declare class FileConsentCard implements builder.IIsAttachment {

  /** Creates a new file consent card builder. */
  constructor(session?: builder.Session);

  /** Name of the file. */
  name(name: string): FileConsentCard;

  /** Description of the file. */
  description(description: string|string[], ...args: any[]): FileConsentCard;

  /** Approximate size of the file in bytes. */
  sizeInBytes(sizeInBytes: number): FileConsentCard;

  /** Context to return if the user accepts the proposed file upload. */
  acceptContext(context: any): FileConsentCard;

  /** Context to return if the user declines the proposed file upload. */
  declineContext(context: any): FileConsentCard;

  /**
   * Context to return whether the user accepts or declines the proposed file upload.
   * Shorthand for calls to `acceptContext(context)` and `declineContext(context)` with the same value.
   */
  context(context: any): FileConsentCard;

  /** Returns the JSON for the card */
  toAttachment(): builder.IAttachment;
}

/** Name of the file consent invoke activity */
export const fileConsentInvokeName = "fileConsent/invoke";

/** Represents the value of the invoke activity sent when the user acts on a file consent card. */
export interface IFileConsentCardResponse {

  /** The action the user took. */
  action: FileConsentCardAction;

  /** The context associated with the action. */
  context?: any;

  /** If the user accepted the file, contains information about the file to be uploaded. */
  uploadInfo?: IFileUploadInfo;
}

/** Actions the user can take on the file consent card. */
export enum FileConsentCardAction {

  /** File was accepted. */
  accept = "accept",

  /** File was declined. */
  decline = "decline",
}

/** Information about the file to be uploaded. */
export interface IFileUploadInfo {

  /** Name of the file. */
  name: string;

  /** URL to an upload session that the bot can use to set the file contents. */
  uploadUrl: string;

  /** URL to file. */
  contentUrl: string;

  /** ID that uniquely identifies the file. */
  uniqueId: string;

  /** Type of the file. */
  fileType: string;
}

/** Represents a file download info attachment. */
export interface IFileDownloadInfo extends builder.IAttachment {

  /** The additional content of the attachment. */
  content: IFileDownloadInfoContent;
}

/** Additional content of a file download info attachment. */
export interface IFileDownloadInfoContent {

  /** Type of the file. */
  fileType: string;

  /** Short-lived download url for the file. */
  downloadUrl: string;
}

/**
* Helpers for working with file download info attachments.
*/
export declare class FileDownloadInfo {

  /** Content type of a file download info attachment. */
  static contentType: string;

  /**
   * Returns the attachments in the list that are of type file download info.
   * @param attachments the attachments in the message
   */
  static filter(attachments: builder.IAttachment[]|undefined): IFileDownloadInfo[]|undefined;
}

/**
 * File info card builder class.
 */
export declare class FileInfoCard implements builder.IIsAttachment {

  /** Creates a new file info card builder. */
  constructor(session?: builder.Session);

  /** Name of the file. */
  name(name: string): FileInfoCard;

  /** URL to the file. */
  contentUrl(url: string): FileInfoCard;

  /** Unique ID of the file. */
  uniqueId(uniqueId: string): FileInfoCard;

  /** Type of the file. */
  fileType(fileType: string): FileInfoCard;

  /**
   * Creates a file info card from the data in a `IFileUploadInfo` object.
   * @param uploadInfo The object containing the information that should be used to populate the card.
   */
  static fromFileUploadInfo(uploadInfo: IFileUploadInfo): FileInfoCard;

  /** Returns the JSON for the card */
  toAttachment(): builder.IAttachment;
}

/**
 * List card builder class.
 */
export declare class ListCard implements builder.IIsAttachment {
  /** Creates a new list card builder. */
  constructor(session?: builder.Session);

  /** Card title. */
  title(title: string|string[], ...args: any[]): this;

  /** Card items. */
  items(list: (IListCardItem|IIsListCardItem)[]): this;

  /** Card buttons. */
  buttons(list: (builder.ICardAction|builder.IIsCardAction)[]): this;

  /** 
   * Adds an item to the list. 
   * @param item The list item to add.
   */
  addItem(item: IListCardItem|IIsListCardItem): this;

  /** Returns the JSON object for the attachment. */
  toAttachment(): builder.IAttachment;
}

/**
* List card item builder class.
*/
export declare class ListCardItem implements IIsListCardItem {
  /** Creates a new list card item builder. */
  constructor(session?: builder.Session);
  
  /** The type of the list item. Defaults to resultItem. */
  type(type: ListCardItemType): this;

  /** List item title. Applies to items of type: resultItem. */
  title(text: string|string[], ...args: any[]): this;

  /** List item subtitle. Applies to items of type: resultItem. */
  subtitle(text: string|string[], ...args: any[]): this;

  /** List item icon url. Applies to items of type: resultItem. */
  icon(url: string): this;

  /** Action to execute when the item is tapped. Applies to items of type: resultItem.*/
  tap(action: builder.ICardAction|builder.IIsCardAction): this;

  /** Returns the JSON for the item */
  toItem(): IListCardItem;
}

/**
 * List card item types.
 */
export enum ListCardItemType {
  /** Generic result item */
  resultItem = 'resultItem',

  /** List separator */
  separator = 'separator',
}

/**
 * Interface for a list card item.
 */
export interface IListCardItem {
    
  /** Type of the list item */
  type: ListCardItemType;

  /** List item id */
  id?: string;

  /** List item title */
  title?: string;

  /** List item subtitle */
  subtitle?: string;

  /** List item icon url */
  icon?: string;

  /** List item tap action */
  tap?: builder.ICardAction;
}

/**
* Interface for a type convertible to a list card item.
*/
export interface IIsListCardItem {
  /** Returns the JSON for the item */
  toItem(): IListCardItem;
}