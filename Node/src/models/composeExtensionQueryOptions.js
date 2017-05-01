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

/**
 * @class
 * Initializes a new instance of the ComposeExtensionQueryOptions class.
 * @constructor
 * Compose extensions query options
 *
 * @member {number} [skip] Number of entities to skip
 *
 * @member {number} [count] Number of entities to fetch
 *
 */
class ComposeExtensionQueryOptions {
  constructor() {
  }

  /**
   * Defines the metadata of ComposeExtensionQueryOptions
   *
   * @returns {object} metadata of ComposeExtensionQueryOptions
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ComposeExtensionQueryOptions',
      type: {
        name: 'Composite',
        className: 'ComposeExtensionQueryOptions',
        modelProperties: {
          skip: {
            required: false,
            serializedName: 'skip',
            type: {
              name: 'Number'
            }
          },
          count: {
            required: false,
            serializedName: 'count',
            type: {
              name: 'Number'
            }
          }
        }
      }
    };
  }
}

module.exports = ComposeExtensionQueryOptions;
