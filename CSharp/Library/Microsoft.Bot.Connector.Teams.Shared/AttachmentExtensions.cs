// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
// Microsoft Teams: https://dev.office.com/microsoft-teams
//
// Bot Builder SDK GitHub:
// https://github.com/Microsoft/BotBuilder
//
// Bot Builder SDK Extensions for Teams
// https://github.com/OfficeDev/BotBuilder-MicrosoftTeams
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

namespace Microsoft.Bot.Connector.Teams
{
    using Microsoft.Bot.Connector.Teams.Models;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Attachment extensions.
    /// </summary>
    public static class AttachmentExtensions
    {
        /// <summary>
        /// Converts normal attachment into the compose extension attachment.
        /// </summary>
        /// <param name="attachment">The attachment.</param>
        /// <param name="previewAttachment">The preview attachment.</param>
        /// <returns>Compose extension attachment</returns>
        public static ComposeExtensionAttachment ToComposeExtensionAttachment(this Attachment attachment, Attachment previewAttachment = null)
        {
            // We are recreating the attachment so that JsonSerializerSettings with ReferenceLoopHandling set to Error does not generate error
            // while serializing. Refer to issue - https://github.com/OfficeDev/BotBuilder-MicrosoftTeams/issues/52.
            return new ComposeExtensionAttachment
            {
                Content = attachment.Content,
                ContentType = attachment.ContentType,
                ContentUrl = attachment.ContentUrl,
                Name = attachment.Name,
                ThumbnailUrl = attachment.ThumbnailUrl,
                Preview = previewAttachment == null ?
                    JObject.FromObject(attachment).ToObject<Attachment>() :
                    previewAttachment
            };
        }
    }
}
