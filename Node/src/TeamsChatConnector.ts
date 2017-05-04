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
import * as msRest from 'ms-rest';
import RemoteQuery = require('./RemoteQuery/teams');
import RestClient = require('./RemoteQuery/RestClient');
import { ChannelInfo, ComposeExtensionQuery, ComposeExtensionResult, ComposeExtensionParameter, ComposeExtensionResponse } from './models';

var WebResource = msRest.WebResource;

export type ComposeExtensionQueryHandlerType = (event: builder.IEvent, query: ComposeExtensionQuery, callback: (err: Error, result: ComposeExtensionResult, statusCode: number) => void) => void;

export interface IInvokeEvent extends builder.IEvent {
  name: string;
  value: any;
}

export class TeamsChatConnector extends builder.ChatConnector {

  private allowedTenants: string[];

  private queryHandlers: { [id: string]: ComposeExtensionQueryHandlerType } = {};

  constructor(settings: builder.IChatConnectorSettings = {}) {
    super(settings)
    this.allowedTenants = null;
  }

  /**
  *  Return a list of conversations in a team
  *  @param {string} teamId - The team id, you can look it up in session object.
  *  @param {function} callback - This callback returns err or result.
  *  @param {string} serverUrl - Server url is composed of baseUrl and cloud name, remember to find your correct cloud name in session or the function will not find the team.
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
          callback(new Error('Failed to authorize request'), null);
        }
    });
  }

  /**
  *  Set the list of allowed tenants. Messages from tenants not on the list will be dropped silently.
  *  @param {array} tenants - Ids of allowed tenants.
  */
  public setAllowedTenants(tenants: string[]) {
    if (tenants != null) {
      this.allowedTenants = tenants;
    }
  }

  /**
  *  Reset allowed tenants, ask connector to receive every message sent from any source.
  */
  public resetAllowedTenants() {
    this.allowedTenants = null;
  }

  public onQuery(commandId: string, handler: ComposeExtensionQueryHandlerType): void {
    this.queryHandlers[commandId] = handler;
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
      let invoke = <IInvokeEvent>event;
      if (invoke.type == 'invoke') {
        switch (invoke.name) {
          case 'composeExtension/query':
            this.dispatchQuery(invoke, callback);
            break;
          default:
            realEvents.push(event);
            break;
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

  private dispatchQuery(event: IInvokeEvent, callback: (err: Error, body: ComposeExtensionResult, status?: number) => void): void {
    let query = <ComposeExtensionQuery>event.value;
    let handler = this.queryHandlers[query.commandId];
    if (handler) {
      try {
        handler(event, query, callback);
      }
      catch (e) {
        console.log(e);
        callback(e, null, 500);
      }
    }
    else {
      callback(new Error("Query handler [" + query.commandId + "] not found."), null, 500);
    }
  }
}
