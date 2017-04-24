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
 * Initializes a new instance of the PersonCard class.
 * @constructor
 * Card representing a person.
 *
 * @member {string} [upn] UPN of the user
 *
 * @member {string} [text] Text for the card
 *
 * @member {array} [images] Array of images
 *
 * @member {array} [buttons] Set of actions applicable to the current card
 *
 * @member {object} [tap]
 *
 * @member {string} [tap.type] Defines the type of action implemented by this
 * button.
 *
 * @member {string} [tap.title] Text description which appear on the button.
 *
 * @member {string} [tap.image] URL Picture which will appear on the button,
 * next to text label.
 *
 * @member {object} [tap.value] Supplementary parameter for action. Content of
 * this property depends on the ActionType
 *
 */
class PersonCard {
  constructor() {
  }

  /**
   * Defines the metadata of PersonCard
   *
   * @returns {object} metadata of PersonCard
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'PersonCard',
      type: {
        name: 'Composite',
        className: 'PersonCard',
        modelProperties: {
          upn: {
            required: false,
            serializedName: 'upn',
            type: {
              name: 'String'
            }
          },
          text: {
            required: false,
            serializedName: 'text',
            type: {
              name: 'String'
            }
          },
          images: {
            required: false,
            serializedName: 'images',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'CardImageElementType',
                  type: {
                    name: 'Composite',
                    className: 'CardImage'
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
          },
          tap: {
            required: false,
            serializedName: 'tap',
            type: {
              name: 'Composite',
              className: 'CardAction'
            }
          }
        }
      }
    };
  }
}

module.exports = PersonCard;
