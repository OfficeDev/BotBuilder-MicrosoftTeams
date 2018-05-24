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

namespace Microsoft.Bot.Connector.Teams.Models
{
    /// <summary>
    /// File info card.
    /// </summary>
    public partial class FileInfoCard
    {
        /// <summary>
        /// Content type to be used in the type property.
        /// </summary>
        public const string ContentType = "application/vnd.microsoft.teams.card.file.info";

        /// <summary>
        /// Gets or sets the file name.
        /// </summary>
        [Newtonsoft.Json.JsonIgnore]
        public string Name
        {
            get; set;
        }

        /// <summary>
        /// Gets or sets the URL to the file.
        /// </summary>
        [Newtonsoft.Json.JsonIgnore]
        public string ContentUrl
        {
            get; set;
        }

        /// <summary>
        /// Creates a new <see cref="FileInfoCard"/> instance and initializes it from a <see cref="FileUploadInfo"/> object.
        /// </summary>
        /// <param name="fileUploadInfo">File upload info</param>
        /// <returns>A new instance of the <see cref="FileInfoCard"/> class</returns>
        public static FileInfoCard FromFileUploadInfo(FileUploadInfo fileUploadInfo)
        {
            return new FileInfoCard
            {
                Name = fileUploadInfo.Name,
                ContentUrl = fileUploadInfo.ContentUrl,
                FileType = fileUploadInfo.FileType,
                UniqueId = fileUploadInfo.UniqueId,
            };
        }
    }
}
