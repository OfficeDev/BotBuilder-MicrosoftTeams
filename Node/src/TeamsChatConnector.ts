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
import * as msRest from 'ms-rest';
import RemoteQuery = require('./RemoteQuery/teams');
import RestClient = require('./RemoteQuery/RestClient');
import { ChannelAccount, ChannelInfo, ComposeExtensionQuery, IComposeExtensionResponse, ComposeExtensionParameter, ComposeExtensionResponse, IO365ConnectorCardActionQuery, ISigninStateVerificationQuery, TeamInfo } from './models';
import { IFileConsentCardResponse } from './models/FileConsentCardResponse';

var WebResource = msRest.WebResource;

export type ComposeExtensionHandlerType = (event: builder.IEvent, query: ComposeExtensionQuery, callback: (err: Error, result: IComposeExtensionResponse, statusCode?: number) => void) => void;
export type O365ConnectorCardActionHandlerType = (event: builder.IEvent, query: IO365ConnectorCardActionQuery, callback: (err: Error, result: any, statusCode?: number) => void) => void;
export type SigninStateVerificationHandlerType = (event: builder.IEvent, query: ISigninStateVerificationQuery, callback: (err: Error, result: any, statusCode?: number) => void) => void;
export type FileConsentCardResponseHandlerType = (event: builder.IEvent, response: IFileConsentCardResponse, callback: (err: Error, result: any, statusCode?: number) => void) => void;

export interface IInvokeEvent extends builder.IEvent {
  name: string;
  value: any;
}

export interface ReplyResult {
  id: string,
  activityId: string
}

export class TeamsChatConnector extends builder.ChatConnector {
  private static o365CardActionInvokeName = 'actionableMessage/executeAction';
  private static signinStateVerificationInvokeName = 'signin/verifyState';
  private static queryInvokeName = 'composeExtension/query';
  private static querySettingUrlInvokeName = 'composeExtension/querySettingUrl';
  private static selectItemInvokeName = 'composeExtension/selectItem';
  private static settingInvokeName = 'composeExtension/setting';
  private static fileConsentInvokeName = 'fileConsent/invoke';

  private allowedTenants: string[];

  private o365CardActionHandler: O365ConnectorCardActionHandlerType;
  private signinStateVerificationHandler: SigninStateVerificationHandlerType;
  private queryHandlers: { [id: string]: ComposeExtensionHandlerType } = null;
  private querySettingsUrlHandler: ComposeExtensionHandlerType;
  private settingsUpdateHandler: ComposeExtensionHandlerType;
  private selectItemInvokeHandler: ComposeExtensionHandlerType;
  private fileConsentCardResponseHandler: FileConsentCardResponseHandlerType;

  constructor(settings: builder.IChatConnectorSettings = {}) {
    super(settings)
    this.allowedTenants = null;
  }

  /**
  *  Return a list of conversations in a team
  *  @param {string} serverUrl - Server url is composed of baseUrl and cloud name, remember to find your correct cloud name in session or the function will not find the team.
  *  @param {string} teamId - The team id, you can look it up in session object.
  *  @param {function} callback - This callback returns err or result.
  */
  public fetchChannelList(serverUrl: string, teamId: string, callback: (err: Error, result: ChannelInfo[]) => void) : void {
    var options: msRest.RequestOptions = {customHeaders: {}, jar: false};
    var restClient = new RestClient(serverUrl, null);
    var remoteQuery = new RemoteQuery(restClient);
    this.getAccessToken((err, token) => {
        if (!err && token) {
          options.customHeaders = {
            'Authorization': 'Bearer ' + token
          };
          remoteQuery.fetchChannelList(teamId, options, callback);
        } else {
          return callback(new Error('Failed to authorize request'), null);
        }
    });
  }

  /**
  *  Return info of a team given team id
  *  @param {string} serverUrl - Server url is composed of baseUrl and cloud name, remember to find your correct cloud name in session or the function will not find the team.
  *  @param {string} teamId - The team id, you can look it up in session object.
  *  @param {function} callback - This callback returns err or result.
  */
  public fetchTeamInfo(serverUrl: string, teamId: string, callback: (err: Error, result: TeamInfo) => void) : void {
    var options: msRest.RequestOptions = {customHeaders: {}, jar: false};
    var restClient = new RestClient(serverUrl, null);
    var remoteQuery = new RemoteQuery(restClient);
    this.getAccessToken((err, token) => {
        if (!err && token) {
          options.customHeaders = {
            'Authorization': 'Bearer ' + token
          };
          remoteQuery.fetchTeamInfo(teamId, options, callback);
        } else {
          return callback(new Error('Failed to authorize request'), null);
        }
    });
  }

  /**
  *  Return a list of members in a team or channel
  *  @param {string} serverUrl - Server url is composed of baseUrl and cloud name, remember to find your correct cloud name in session or the function will not find the team.
  *  @param {string} conversationId - The conversation id or channel id, you can look it up in session object.
  *  @param {function} callback - This callback returns err or result.
  */
  public fetchMembers(serverUrl: string, conversationId: string, callback: (err: Error, result: ChannelAccount[]) => void) : void {
    var options: msRest.RequestOptions = {customHeaders: {}, jar: false};
    var restClient = new RestClient(serverUrl, null);
    var remoteQuery = new RemoteQuery(restClient);
    this.getAccessToken((err, token) => {
        if (!err && token) {
          options.customHeaders = {
            'Authorization': 'Bearer ' + token
          };
          remoteQuery.fetchMemberList(conversationId, options, callback);
        } else {
          return callback(new Error('Failed to authorize request'), null);
        }
    });
  }

  /**
  *  Return members in a team or channel with pagination
  *  @param {string} serverUrl - Server url is composed of baseUrl and cloud name, remember to find your correct cloud name in session or the function will not find the team.
  *  @param {string} conversationId - The conversation id or channel id, you can look it up in session object.
  *  @param {function} callback - This callback returns err or result.
  *  @param {function} pageSize - How many members to fetch per page
  *  @param {function} continuationToken - continuationToken if this is a subsequent call to fetch more members
  */
  public fetchPagedMembers(
    serverUrl: string,
    conversationId: string,
    callback: (err: Error, result: ChannelAccount[]) => void,
    pageSize?: number,
    continuationToken?: string): void {
    let options = {
      pageSize: pageSize,
      continuationToken: continuationToken,
      customHeaders: {},
      jar: false
    };
    var restClient = new RestClient(serverUrl, null);
    var remoteQuery = new RemoteQuery(restClient);
    this.getAccessToken((err, token) => {
        if (!err && token) {
          options.customHeaders = {
            "Authorization": "Bearer " + token
          };
          remoteQuery.fetchPagedMemberList(conversationId, options, callback);
        } else {
          return callback(new Error("Failed to authorize request"), null);
        }
    });
  }


  /**
  *  Return a newly started reply chain address in channel
  *  @param {string} serverUrl - Server url is composed of baseUrl and cloud name, remember to find your correct cloud name in session or the function will not find the team.
  *  @param {string} channelId - The channel id, will post in the channel.
  *  @param {builder.IMessage|builder.IIsMessage} message - The message to post in the channel.
  *  @param {function} callback - This callback returns err or result.
  */
  public startReplyChain(serverUrl: string, channelId: string, message: builder.IMessage|builder.IIsMessage, callback?: (err: Error, address: builder.IChatConnectorAddress) => void) : void {
    var options: msRest.RequestOptions = {customHeaders: {}, jar: false};
    var restClient = new RestClient(serverUrl, null);
    var remoteQuery = new RemoteQuery(restClient);
    this.getAccessToken((err, token) => {
        if (!err && token) {
          options.customHeaders = {
            'Authorization': 'Bearer ' + token
          };

          var iMessage: builder.IMessage = null;
          if ((<builder.IIsMessage>message).toMessage)
          {
            iMessage = (<builder.IIsMessage>message).toMessage();
          }
          else if ((<builder.IMessage>message).address)
          {
            iMessage = <builder.IMessage>message;
          }
          else
          {
            throw new Error("Message type is wrong. Need either IMessage or IIsMessage");
          }

          var innerCallback = function (err: Error, result: ReplyResult) {

            if (!callback)
            {
              return;
            }

            if (result && result.hasOwnProperty("id") && result.hasOwnProperty("activityId"))
            {
              var messageAddress = <builder.IChatConnectorAddress>iMessage.address;
              var address: builder.IChatConnectorAddress = <builder.IChatConnectorAddress>{
                ... messageAddress,
                channelId : 'msteams',
                conversation: { id: result.id },
                id : result.activityId
              };

              if (address.user) {
                  delete address.user;
              }

              return callback(null, address);
            }
            else
            {
              let error = new Error("Failed to start reply chain: no conversation ID and activity ID returned.");
              return callback(error, null);
            }
          }

          remoteQuery.beginReplyChainInChannel(channelId, iMessage, options, innerCallback);
        }
        else {
          if (callback)
          {
            return callback(new Error('Failed to authorize request'), null);
          }
        }
    });
  }

  /**
  * @override
  *
  * Change default implementation to ignore endOfCoversation message types
  *
  */
  public send(messages: builder.IMessage[], done: (err: Error, addresses?: builder.IAddress[]) => void): void {
    return super.send(messages.filter((m) => m.type !== "endOfConversation"), done)
  }

  /**
  *  Set the list of allowed tenants. Messages from tenants not on the list will be dropped silently.
  *  @param {array} tenants - Ids of allowed tenants.
  */
  public setAllowedTenants(tenants: string[]) : void {
    if (tenants != null) {
      this.allowedTenants = tenants;
    }
  }

  /**
  *  Reset allowed tenants, ask connector to receive every message sent from any source.
  */
  public resetAllowedTenants() : void {
    this.allowedTenants = null;
  }

  public onO365ConnectorCardAction(handler: O365ConnectorCardActionHandlerType): void {
    this.o365CardActionHandler = handler;
  }

  public onSigninStateVerification(handler: SigninStateVerificationHandlerType): void {
    this.signinStateVerificationHandler = handler;
  }

  public onQuery(commandId: string, handler: ComposeExtensionHandlerType): void {
    if (!this.queryHandlers) {
      this.queryHandlers = {};
    }
    this.queryHandlers[commandId] = handler;
  }

  public onQuerySettingsUrl(handler: ComposeExtensionHandlerType) {
    this.querySettingsUrlHandler = handler;
  }

  public onSettingsUpdate(handler: ComposeExtensionHandlerType) {
    this.settingsUpdateHandler = handler;
  }

  public onSelectItem(handler: ComposeExtensionHandlerType) {
    this.selectItemInvokeHandler = handler;
  }

  public onFileConsentCardResponse(handler: FileConsentCardResponseHandlerType) {
    this.fileConsentCardResponseHandler = handler;
  }

  protected onDispatchEvents(events: builder.IEvent[], callback: (err: Error, body: any, status?: number) => void): void {
    if (this.allowedTenants) {
      var filteredEvents: builder.IEvent[] = [];
      for (var event of events) {
        if (event.sourceEvent.tenant && this.allowedTenants.indexOf(event.sourceEvent.tenant.id) > -1) {
          filteredEvents.push(event);
        }
      }
      this.dispatchEventOrQuery(filteredEvents, callback);
    }
    else {
      this.dispatchEventOrQuery(events, callback);
    }
  }

  private dispatchEventOrQuery(events: builder.IEvent[], callback: (err: Error, body: any, status?: number) => void): void {
    var realEvents: builder.IEvent[] = [];    // Events to be dispatched by ChatConnector

    for (var event of events) {
      if (event.type === 'invoke') {
        let invoke = <IInvokeEvent>event;
        let invokeHandler: (event: builder.IEvent, value: any, callback: (err: Error, body: any, status?: number) => void) => void;

        switch (invoke.name) {
          case TeamsChatConnector.queryInvokeName:
            if (this.queryHandlers) {
              invokeHandler = this.dispatchQuery.bind(this);
            }
            break;

          case TeamsChatConnector.querySettingUrlInvokeName:
            if (this.querySettingsUrlHandler) {
              invokeHandler = this.querySettingsUrlHandler.bind(this);
            }
            break;

          case TeamsChatConnector.settingInvokeName:
            if (this.settingsUpdateHandler) {
              invokeHandler = this.settingsUpdateHandler.bind(this);
            }
            break;

          case TeamsChatConnector.selectItemInvokeName:
            if (this.selectItemInvokeHandler) {
              invokeHandler = this.selectItemInvokeHandler.bind(this);
            }
            break;

          case TeamsChatConnector.o365CardActionInvokeName:
            if (this.o365CardActionHandler) {
              invokeHandler = this.o365CardActionHandler.bind(this);
            }
            break;

          case TeamsChatConnector.signinStateVerificationInvokeName:
            if (this.signinStateVerificationHandler) {
              invokeHandler = this.signinStateVerificationHandler.bind(this);
            }
            break;

          case TeamsChatConnector.fileConsentInvokeName:
            if (this.fileConsentCardResponseHandler) {
              invokeHandler = this.fileConsentCardResponseHandler.bind(this);
            }
            break;

          default:
            // Generic invoke activity, defer to default handling of invoke activities
            realEvents.push(event);
            break;
        }

        if (invokeHandler) {
          try {
            invokeHandler(invoke, invoke.value, callback);
          }
          catch (e) {
            return callback(e, null, 500);
          }
        } else {
          // No handler registered, defer to default handling of invoke activities
          realEvents.push(event);
        }
      } else {
        // Use default handling for all other activities
        realEvents.push(event);
      }
    }

    if (realEvents.length > 0) {
      super.onDispatchEvents(realEvents, callback);
    }
  }

  private dispatchQuery(event: builder.IEvent, query: ComposeExtensionQuery, callback: (err: Error, body: IComposeExtensionResponse, status?: number) => void): void {
    let handler = this.queryHandlers[query.commandId];
    if (handler) {
      handler(event, query, callback);
    }
    else {
      return callback(new Error("Query handler [" + query.commandId + "] not found."), null, 500);
    }
  }
}
