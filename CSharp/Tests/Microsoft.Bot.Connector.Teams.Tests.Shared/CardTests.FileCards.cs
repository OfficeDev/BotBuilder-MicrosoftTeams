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

namespace Microsoft.Bot.Connector.Teams.Tests
{
    using System;
    using System.IO;
    using Microsoft.Bot.Connector.Teams.Models;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// File card tests.
    /// </summary>
    public partial class CardTests
    {
        /// <summary>
        /// File info card test.
        /// </summary>
        [TestMethod]
        public void CardTests_FileInfoCard()
        {
            FileInfoCard fileInfoCard = new FileInfoCard
            {
                FileType = "txt",
                UniqueId = Guid.NewGuid().ToString(),
                Name = "filename.txt",
                ContentUrl = "https://content.url",
            };

            Attachment attachment = fileInfoCard.ToAttachment();
            Assert.AreEqual(FileInfoCard.ContentType, attachment.ContentType);
            Assert.AreEqual("filename.txt", attachment.Name);
            Assert.AreEqual("https://content.url", attachment.ContentUrl);
            this.TestCard(attachment);
        }

        /// <summary>
        /// Test creating a file info card from a file upload info object.
        /// </summary>
        [TestMethod]
        public void CardTests_FileInfoCard_CreateFromFileUploadInfo()
        {
            var fileUploadInfo = new FileUploadInfo
            {
                FileType = "txt",
                UniqueId = Guid.NewGuid().ToString(),
                Name = "filename.txt",
                ContentUrl = "https://content.url",
                UploadUrl = "https://upload.url",
            };

            var fileInfoCard = FileInfoCard.FromFileUploadInfo(fileUploadInfo);
            Assert.AreEqual(fileUploadInfo.Name, fileInfoCard.Name);
            Assert.AreEqual(fileUploadInfo.ContentUrl, fileInfoCard.ContentUrl);
            Assert.AreEqual(fileUploadInfo.UniqueId, fileInfoCard.UniqueId);
            Assert.AreEqual(fileUploadInfo.FileType, fileInfoCard.FileType);
        }

        /// <summary>
        /// File consent card test.
        /// </summary>
        [TestMethod]
        public void CardTests_FileConsentCard()
        {
            FileConsentCard fileConsentCard = new FileConsentCard
            {
                Description = "File consent",
                SizeInBytes = 1024,
                Name = "filename.txt",
            };

            Attachment attachment = fileConsentCard.ToAttachment();
            Assert.AreEqual(FileConsentCard.ContentType, attachment.ContentType);
            Assert.AreEqual("filename.txt", attachment.Name);
            this.TestCard(attachment);
        }

        /// <summary>
        /// File download info attachment.
        /// </summary>
        [TestMethod]
        public void CardTests_FileDownloadInfoAttachment()
        {
            FileDownloadInfo fileDownloadInfo = new FileDownloadInfo
            {
                DownloadUrl = "https://bing.com",
                UniqueId = "b83b9f77-7003-4d63-985c-9611c98303f3",
                FileType = "txt"
            };

            string contents = JsonConvert.SerializeObject(new Attachment
            {
                Content = fileDownloadInfo,
                ContentType = FileDownloadInfo.ContentType
            });
            Attachment attachment = JsonConvert.DeserializeObject<Attachment>(File.ReadAllText(@"Jsons\SampleFileDownloadInfoAttachment.json"));

            Assert.IsNotNull(attachment);
            Assert.IsNotNull(attachment.Content);
            Assert.IsTrue(JObject.DeepEquals(JObject.FromObject(fileDownloadInfo), JObject.FromObject(attachment.Content)));
            Assert.AreEqual(FileDownloadInfo.ContentType, attachment.ContentType);
        }

        /// <summary>
        /// File consent card response.
        /// </summary>
        [TestMethod]
        public void CardTests_FileConsentCardResponse()
        {
            var activity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleFileConsentCardResponseInvoke.json"));

            Assert.IsNotNull(activity);
            Assert.AreEqual(FileConsentCardResponse.InvokeName, activity.Name);

            var response = ((JObject)activity.Value).ToObject<FileConsentCardResponse>();
            Assert.IsNotNull(response.Context);

            // These are from SampleFileConsentCardResponseInvoke.json
            Assert.AreEqual(FileConsentCardResponse.AcceptAction, response.Action);
            Assert.AreEqual("https://contoso.sharepoint.com/personal/johnadams_contoso_com/Documents/Applications/file_example.txt", response.UploadInfo.ContentUrl);
            Assert.AreEqual("file_example.txt", response.UploadInfo.Name);
            Assert.AreEqual("https://upload.link", response.UploadInfo.UploadUrl);
            Assert.AreEqual("1150D938-8870-4044-9F2C-5BBDEBA70C8C", response.UploadInfo.UniqueId);
            Assert.AreEqual("txt", response.UploadInfo.FileType);
        }
    }
}
