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
const TeamEventBase = require('./teamEventBase').TeamEventBase;
const TeamEventType = require('./teamEventBase').TeamEventType;

/**
 * @class
 * Initializes a new instance of the ChannelDeletedEvent class.
 * @constructor
 * Channel Deleted in Teams
 *
 * @member {ChannelInfo} [channel] 
 *
 * @member {TeamInfo} [team] Team info for channel
 *
 * @member {TenantInfo} [tenant] Tenant info for channel
 *
 */

class ChannelDeletedEvent extends TeamEventBase {
  constructor(channel, team, tenant) {
    super(
      ChannelDeletedEvent.eventType, 
      team, 
      tenant
    );
    this.channel = channel;
  }

  mapper() {
    return {
      required: false,
      serializedName: 'ChannelDeletedEvent',
      type: {
        name: 'Composite',
        className: 'ChannelDeletedEvent',
        modelProperties: {
          channel: {
            required: false,
            serializedName: 'channel',
            type: {
              name: 'Composite',
              className: 'ChannelInfo'
            }
          },
        }
      }
    };
  }
}

ChannelDeletedEvent.eventType = TeamEventType.ChannelDeleted;

module.exports = ChannelDeletedEvent;
