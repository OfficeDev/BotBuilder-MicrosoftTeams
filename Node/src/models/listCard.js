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
 * Initializes a new instance of the ListCard class.
 * @constructor
 * A list card
 *
 * @member {string} [title] Title of the card
 *
 * @member {array} [items] Array of items
 *
 * @member {array} [buttons] Set of actions applicable to the current card
 *
 */
class ListCard {
  constructor() {
  }

  /**
   * Defines the metadata of ListCard
   *
   * @returns {object} metadata of ListCard
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ListCard',
      type: {
        name: 'Composite',
        className: 'ListCard',
        modelProperties: {
          title: {
            required: false,
            serializedName: 'title',
            type: {
              name: 'String'
            }
          },
          items: {
            required: false,
            serializedName: 'items',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'ListItemBaseElementType',
                  type: {
                    name: 'Composite',
                    className: 'ListItemBase'
                  }
              }
            }
          },
          buttons: {
            required: false,
            serializedName: 'buttons',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'CardActionElementType',
                  type: {
                    name: 'Composite',
                    className: 'CardAction'
                  }
              }
            }
          }
        }
      }
    };
  }
}

module.exports = ListCard;
