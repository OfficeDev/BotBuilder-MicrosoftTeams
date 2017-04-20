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

const models = require('./index');

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
class TeamsChannelData {
  constructor() {
  }

  /**
   * Defines the metadata of TeamsChannelData
   *
   * @returns {object} metadata of TeamsChannelData
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'TeamsChannelData',
      type: {
        name: 'Composite',
        className: 'TeamsChannelData',
        modelProperties: {
          channel: {
            required: false,
            serializedName: 'channel',
            type: {
              name: 'Composite',
              className: 'ChannelInfo'
            }
          },
          eventType: {
            required: false,
            serializedName: 'eventType',
            type: {
              name: 'String'
            }
          },
          team: {
            required: false,
            serializedName: 'team',
            type: {
              name: 'Composite',
              className: 'TeamInfo'
            }
          },
          tenant: {
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

module.exports = TeamsChannelData;
