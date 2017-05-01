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

import * as builder from 'botbuilder';

const models = require('./index');

/**
 * @class
 * Initializes a new instance of the ComposeExtensionAttachment class.
 * @constructor
 * Compose extension attachment.
 *
 *
 * @member {string} [contentType] mimetype/Contenttype for the file
 *
 * @member {string} [contentUrl] Content Url
 *
 * @member {object} [content] Embedded content
 *
 * @member {string} [name] (OPTIONAL) The name of the attachment
 *
 * @member {string} [thumbnailUrl] (OPTIONAL) Thumbnail associated with
 * attachment
 *
 */
class ComposeExtensionAttachment extends builder.IIsAttachment {
  constructor() {
    super();
  }

  /**
   * Defines the metadata of ComposeExtensionAttachment
   *
   * @returns {object} metadata of ComposeExtensionAttachment
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ComposeExtensionAttachment',
      type: {
        name: 'Composite',
        className: 'ComposeExtensionAttachment',
        modelProperties: {
          contentType: {
            required: false,
            serializedName: 'contentType',
            type: {
              name: 'String'
            }
          },
          contentUrl: {
            required: false,
            serializedName: 'contentUrl',
            type: {
              name: 'String'
            }
          },
          content: {
            required: false,
            serializedName: 'content',
            type: {
              name: 'Object'
            }
          },
          name: {
            required: false,
            serializedName: 'name',
            type: {
              name: 'String'
            }
          },
          thumbnailUrl: {
            required: false,
            serializedName: 'thumbnailUrl',
            type: {
              name: 'String'
            }
          },
          preview: {
            required: false,
            serializedName: 'preview',
            type: {
              name: 'Composite',
              className: 'Attachment'
            }
          }
        }
      }
    };
  }
}

module.exports = ComposeExtensionAttachment;
