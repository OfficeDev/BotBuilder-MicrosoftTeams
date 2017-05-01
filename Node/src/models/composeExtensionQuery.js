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
 */
class ComposeExtensionQuery {
  constructor() {
  }

  /**
   * Defines the metadata of ComposeExtensionQuery
   *
   * @returns {object} metadata of ComposeExtensionQuery
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ComposeExtensionQuery',
      type: {
        name: 'Composite',
        className: 'ComposeExtensionQuery',
        modelProperties: {
          commandId: {
            required: false,
            serializedName: 'commandId',
            type: {
              name: 'String'
            }
          },
          parameters: {
            required: false,
            serializedName: 'parameters',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'ComposeExtensionParameterElementType',
                  type: {
                    name: 'Composite',
                    className: 'ComposeExtensionParameter'
                  }
              }
            }
          },
          queryOptions: {
            required: false,
            serializedName: 'queryOptions',
            type: {
              name: 'Composite',
              className: 'ComposeExtensionQueryOptions'
            }
          }
        }
      }
    };
  }
}

module.exports = ComposeExtensionQuery;
