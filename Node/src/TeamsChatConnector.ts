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

var WebResource = msRest.WebResource;

export class TeamsChatConnector extends builder.ChatConnector {

  private allowedTenants: string[];

	constructor(settings: builder.IChatConnectorSettings = {}) {
		super(settings)
    this.allowedTenants = null;
	}

	public fetchChannelList(teamId: string, callback: (err: any, result: any, request: any, response: any) => void, serverUrl: string = 'https://smba.trafficmanager.net/amer-client-ss.msg') : void {
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
          throw new Error('Failed to authorize request');
        }
    });
	}

  public setAllowedTenants(tenants: string[]) {
    if (tenants != null) this.allowedTenants = tenants;
  }

  public resetAllowedTenants() {
    this.allowedTenants = null;
  }

  protected onDispatchEvents(events: builder.IEvent[], callback: (err: Error, body: any, status?: number) => void): void {
    if (this.allowedTenants) {
      var filteredEvents: builder.IEvent[] = [];
      for (var event of events) {
        if (event.sourceEvent.tenant && this.allowedTenants.indexOf(event.sourceEvent.tenant.id) > -1) filteredEvents.push(event);
      }
      super.onDispatchEvents(filteredEvents, callback);
    }
    else {
      super.onDispatchEvents(events, callback);
    }
  }
}
