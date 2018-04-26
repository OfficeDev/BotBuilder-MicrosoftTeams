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

'use strict';

const models = require('../models');

class TeamEventBase {

  constructor(teamEventType, team, tenantInfo) {
    this.eventType = teamEventType;
    this.team = team;
    this.tenant = tenantInfo;
  }

  mapper() {
    return {
      required: false,
      serializedName: 'TeamEventBase',
      type: {
        name: 'Composite',
        className: 'eventType',
        modelProperties: {
          eventType: {
            required: false,
            serializedName: 'eventType',
            type: {
              name: 'Number'
            }
          },
          teamInfo: {
            required: false,
            serializedName: 'team',
            type: {
              name: 'Composite',
              className: 'TeamInfo'
            }
          },
          tenantInfo: {
            required: false,
            serializedName: 'tenant',
            type: {
              name: 'Composite',
              className: 'TenantInfo'
            }
          }
        }
      }
    };
  }
}

const TeamEventType = {
  MembersAdded :    0,
  MembersRemoved :  1,
  ChannelCreated :  2,
  ChannelDeleted :  3,
  ChannelRenamed:   4,
  TeamRenamed:      5
}

module.exports.TeamEventBase = TeamEventBase;
module.exports.TeamEventType = TeamEventType;
