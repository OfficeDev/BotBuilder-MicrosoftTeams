﻿// Copyright (c) Microsoft. All rights reserved.
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

namespace Microsoft.Bot.Connector.Teams.Tests.Shared
{
    using System.IO;
    using Microsoft.Bot.Connector.Teams.Models;
    using Newtonsoft.Json;
    using NUnit.Framework;

    /// <summary>
    /// Compose extension tests.
    /// </summary>
    [TestFixture]
    public class ComposeExtensionTests
    {
        /// <summary>
        /// Tests IsComposeExtension logic by providing a valid compose extension file.
        /// </summary>
        [Test]
        public void ComposeExtension_IsComposeExtensionValidComposeExtension()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityComposeExtension.json"));
            Assert.IsTrue(sampleActivity.IsComposeExtensionQuery());
        }

        /// <summary>
        /// Tests IsComposeExtension logic by providing an invalid compose extension file.
        /// </summary>
        [Test]
        public void ComposeExtension_IsComposeExtensionInvalidComposeExtension()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityInvoke.json"));
            Assert.IsFalse(sampleActivity.IsComposeExtensionQuery());
        }

        /// <summary>
        /// Tests get compose extension data logic.
        /// </summary>
        [Test]
        public void ComposeExtension_GetComposeExtensionData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityComposeExtension.json"));
            ComposeExtensionQuery query = sampleActivity.GetComposeExtensionQueryData();
            Assert.AreEqual("testQuery", query.CommandId);
            Assert.IsTrue(query.Parameters != null && query.Parameters.Count == 1);
            Assert.AreEqual("selectedQueryJson", query.Parameters[0].Name);
            Assert.AreEqual("Value", query.Parameters[0].Value.ToString());
        }
    }
}
