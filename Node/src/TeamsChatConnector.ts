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
import { TenantFilter } from './TenantFilter';

var WebResource = msRest.WebResource;

export class TeamsChatConnector extends builder.ChatConnector {

	constructor(private settings: builder.IChatConnectorSettings = {}) {
		super(settings)
	}

	public fetchChannelList(teamId: string, options: msRest.RequestOptions, callback: msRest.ServiceCallback<Object>) : void {
		var restClient = new RestClient('https://smba.trafficmanager.net/apis', null);
		var remoteQuery = new RemoteQuery(restClient);
		remoteQuery.fetchChannelList(teamId, options, callback);
	}

	public listenAllowedTenant(tenantFilter: TenantFilter): IWebMiddleware {
		return (req, res) => {
      if (req.body) {
        this.verifyBotFramework(req, res);
      } else {
        var requestData = '';
        req.on('data', (chunk) => {
          requestData += chunk
        });
        req.on('end', () => {
          req.body = JSON.parse(requestData);
          if (req.body && req.body.channelData) {
          	var channelData = req.body.channelData;
          	if (channelData.tenant && channelData.tenant.id) {
          		var tenantId = channelData.tenant.id;
          		if (!tenantFilter.isAllowedTenant(tenantId)) {
          			console.log('Tenant: '+tenantId+' not allowed. Please update tenant filter.')
          			return res.end();
          		}
          	}
          }
          this.verifyBotFramework(req, res);
        });
      }
    };
	}
}
