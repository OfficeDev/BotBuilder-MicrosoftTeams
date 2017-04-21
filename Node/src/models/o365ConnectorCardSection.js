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
 * Initializes a new instance of the O365ConnectorCardSection class.
 * @constructor
 * O365 connector card section
 *
 * @member {string} [title] Title of the section
 *
 * @member {string} [text] Text for the section
 *
 * @member {string} [activityTitle] Activity title
 *
 * @member {string} [activitySubtitle] Activity subtitle
 *
 * @member {string} [activityText] Activity text
 *
 * @member {string} [activityImage] Activity image
 *
 * @member {array} [facts] Set of sections for the current card
 *
 * @member {array} [images] Set of sections for the current card
 *
 * @member {array} [potentialAction] Set of sections for the current card
 *
 */
class O365ConnectorCardSection {
  constructor() {
  }

  /**
   * Defines the metadata of O365ConnectorCardSection
   *
   * @returns {object} metadata of O365ConnectorCardSection
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'O365ConnectorCardSection',
      type: {
        name: 'Composite',
        className: 'O365ConnectorCardSection',
        modelProperties: {
          title: {
            required: false,
            serializedName: 'title',
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
          activityTitle: {
            required: false,
            serializedName: 'activityTitle',
            type: {
              name: 'String'
            }
          },
          activitySubtitle: {
            required: false,
            serializedName: 'activitySubtitle',
            type: {
              name: 'String'
            }
          },
          activityText: {
            required: false,
            serializedName: 'activityText',
            type: {
              name: 'String'
            }
          },
          activityImage: {
            required: false,
            serializedName: 'activityImage',
            type: {
              name: 'String'
            }
          },
          facts: {
            required: false,
            serializedName: 'facts',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'O365ConnectorCardFactElementType',
                  type: {
                    name: 'Composite',
                    className: 'O365ConnectorCardFact'
                  }
              }
            }
          },
          images: {
            required: false,
            serializedName: 'images',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'O365ConnectorCardImageElementType',
                  type: {
                    name: 'Composite',
                    className: 'O365ConnectorCardImage'
                  }
              }
            }
          },
          potentialAction: {
            required: false,
            serializedName: 'potentialAction',
            type: {
              name: 'Sequence',
              element: {
                  required: false,
                  serializedName: 'O365ConnectorCardActionBaseElementType',
                  type: {
                    name: 'Composite',
                    className: 'O365ConnectorCardActionBase'
                  }
              }
            }
          }
        }
      }
    };
  }
}

module.exports = O365ConnectorCardSection;
