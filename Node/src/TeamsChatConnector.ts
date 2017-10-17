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

var WebResource = msRest.WebResource;

export type ComposeExtensionHandlerType = (event: builder.IEvent, query: ComposeExtensionQuery, callback: (err: Error, result: IComposeExtensionResponse, statusCode?: number) => void) => void;
export type O365ConnectorCardActionHandlerType = (event: builder.IEvent, query: IO365ConnectorCardActionQuery, callback: (err: Error, result: any, statusCode?: number) => void) => void;
export type SigninStateVerificationHandlerType = (event: builder.IEvent, query: ISigninStateVerificationQuery, callback: (err: Error, result: any, statusCode?: number) => void) => void;

export interface IInvokeEvent extends builder.IEvent {
  name: string;
  value: any;
}

export interface ReplyResult {
  id: string,
  activityId: string
}

export interface IFunctionResponse {
  status?: number;
  body?: any;
}

export class TeamsChatConnector extends builder.ChatConnector {
  private static o365CardActionInvokeName:string = 'actionableMessage/executeAction';
  private static signinStateVerificationInvokeName:string = 'signin/verifyState';
  private static queryInvokeName:string = 'composeExtension/query';
  private static querySettingUrlInvokeName:string = 'composeExtension/querySettingUrl';
  private static selectItemInvokeName:string = 'composeExtension/selectItem';
  private static settingInvokeName:string = 'composeExtension/setting';

  private allowedTenants: string[];

  private o365CardActionHandler: O365ConnectorCardActionHandlerType;
  private signinStateVerificationHandler: SigninStateVerificationHandlerType;
  private queryHandlers: { [id: string]: ComposeExtensionHandlerType } = {};
  private querySettingsUrlHandler: ComposeExtensionHandlerType;
  private settingsUpdateHandler: ComposeExtensionHandlerType;
  private selectItemInvokeHandler: ComposeExtensionHandlerType;

  constructor(settings: builder.IChatConnectorSettings = {}) {
    super(settings)
    this.allowedTenants = null;
  }

  /**
   * Add Azure Functions support to ChatConnector
   */
  public listen(): (context: any, req: any) => void {
    var _listen = super.listen();
    return (context, req) => {
        var response: IFunctionResponse = {};
        _listen(req, {
            send: function (status: number, body?: any): void {
                if (context) {
                    response.status = status;
                    if (body) {
                        response.body = body;
                    }
                    context.res = response;
                    context.done();
                    context = null;
                }
            },
            status: function (val?: number): number {
                if (typeof val === 'number') {
                    response.status = val;
                }
                return response.status || 200;
            },
            end: function () {
                if (context) {
                    context.res = response;
                    context.done();
                    context = null;
                }
            }
        });
    };
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
  *  @deprecated Since version 0.1.2 Will be deleted in version 0.1.5. Use fetchMembers(serverUrl, conversationId, callback).
  *  Return a list of members in a conversation or channel
  *  @param {string} serverUrl - Server url is composed of baseUrl and cloud name, remember to find your correct cloud name in session or the function will not find the team.
  *  @param {string} conversationId - The conversation id or channel id, you can look it up in session object.
  *  @param {string} tenantId - The tenantId, you can look it up in session object.
  *  @param {function} callback - This callback returns err or result.
  */
  public fetchMemberList(serverUrl: string, conversationId: string, tenantId: string, callback: (err: Error, result: ChannelAccount[]) => void) : void {
    var options: msRest.RequestOptions = {customHeaders: {}, jar: false};
    var restClient = new RestClient(serverUrl, null);
    var remoteQuery = new RemoteQuery(restClient);
    this.getAccessToken((err, token) => {
        if (!err && token) {
          options.customHeaders = {
            'Authorization': 'Bearer ' + token,
            'X-MsTeamsTenantId' : tenantId
          };
          remoteQuery.fetchMemberList(conversationId, options, callback);
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
    var realEvents: builder.IEvent[] = [];
    for (var event of events) {
      if (event.type === 'invoke') {
        let invoke = <IInvokeEvent>event;
        let compExtHandler: ComposeExtensionHandlerType;
        let o365Handler: O365ConnectorCardActionHandlerType;
        let signinStateHandler: SigninStateVerificationHandlerType;
        switch (invoke.name) {
          case TeamsChatConnector.queryInvokeName:
            compExtHandler = this.dispatchQuery.bind(this);
            break;
          case TeamsChatConnector.querySettingUrlInvokeName:
            compExtHandler = this.querySettingsUrlHandler.bind(this);
            break;
          case TeamsChatConnector.settingInvokeName:
            compExtHandler = this.settingsUpdateHandler.bind(this);
            break;
          case TeamsChatConnector.selectItemInvokeName:
            compExtHandler = this.selectItemInvokeHandler.bind(this);
            break;
          case TeamsChatConnector.o365CardActionInvokeName:
            o365Handler = this.o365CardActionHandler.bind(this);
            break;
          case TeamsChatConnector.signinStateVerificationInvokeName:
            signinStateHandler = this.signinStateVerificationHandler.bind(this);
            break;
          default:
            realEvents.push(event);
            break;
        }

        if (compExtHandler) {
          try {
            let query = <ComposeExtensionQuery>(invoke.value);
            compExtHandler(invoke, query, callback);
          }
          catch (e) {
            return callback(e, null, 500);
          }
        }

        if (o365Handler) {
          try {
            let query = <IO365ConnectorCardActionQuery>(invoke.value);
            o365Handler(invoke, query, callback);
          }
          catch (e) {
            return callback(e, null, 500);
          }
        }

        if (signinStateHandler) {
          try {
            let query = <ISigninStateVerificationQuery>(invoke.value);
            signinStateHandler(invoke, query, callback);
          }
          catch (e) {
            return callback(e, null, 500);
          }
        }        
      }
      else {
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
