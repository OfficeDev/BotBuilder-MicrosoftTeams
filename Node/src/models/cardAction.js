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
 * Initializes a new instance of the CardAction class.
 * @constructor
 * An action on a card
 *
 * @member {string} [type] Defines the type of action implemented by this
 * button.
 *
 * @member {string} [title] Text description which appear on the button.
 *
 * @member {string} [image] URL Picture which will appear on the button, next
 * to text label.
 *
 * @member {object} [value] Supplementary parameter for action. Content of this
 * property depends on the ActionType
 *
 */
class CardAction {
  constructor() {
  }

  /**
   * Defines the metadata of CardAction
   *
   * @returns {object} metadata of CardAction
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'CardAction',
      type: {
        name: 'Composite',
        className: 'CardAction',
        modelProperties: {
          type: {
            required: false,
            serializedName: 'type',
            type: {
              name: 'String'
            }
          },
          title: {
            required: false,
            serializedName: 'title',
            type: {
              name: 'String'
            }
          },
          image: {
            required: false,
            serializedName: 'image',
            type: {
              name: 'String'
            }
          },
          value: {
            required: false,
            serializedName: 'value',
            type: {
              name: 'Object'
            }
          }
        }
      }
    };
  }
}

module.exports = CardAction;
