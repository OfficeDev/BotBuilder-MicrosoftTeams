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
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;

    /// <summary>
    /// @Mention tests.
    /// </summary>
    [TestClass]
    public class MentionTests
    {
        /// <summary>
        /// @Mention tests with no mention text.
        /// </summary>
        [TestMethod]
        public void AddMention_NoMentionText()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            Activity reply = sampleActivity.CreateReply().AddMentionToText(sampleActivity.From, MentionTextLocation.AppendText);

            Assert.IsTrue(reply.Entities.Count == 1);
            Assert.IsInstanceOfType(reply.Entities[0], typeof(Mention));
            Assert.IsTrue(reply.Text.Contains((reply.Entities[0] as Mention).Text));
            Assert.IsTrue((reply.Entities[0] as Mention).Text.Contains("<at>"));
            Assert.IsTrue((reply.Entities[0] as Mention).Text == "<at>" + (reply.Entities[0] as Mention).Mentioned.Name + "</at>");
            Assert.IsTrue((reply.Entities[0] as Mention).Text.EndsWith("</at>"));
        }

        /// <summary>
        /// @Mention tests with mention text.
        /// </summary>
        [TestMethod]
        public void AddMention_WithMentionText()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            Activity reply = sampleActivity.CreateReply().AddMentionToText(sampleActivity.From, MentionTextLocation.PrependText, "SampleName");

            Assert.IsTrue(reply.Entities.Count == 1);
            Assert.IsInstanceOfType(reply.Entities[0], typeof(Mention));
            Assert.IsTrue(reply.Text.Contains((reply.Entities[0] as Mention).Text));
            Assert.IsTrue((reply.Entities[0] as Mention).Text.Contains("SampleName"));
            Assert.IsTrue((reply.Entities[0] as Mention).Text == "<at>" + (reply.Entities[0] as Mention).Mentioned.Name + "</at>");
            Assert.IsTrue((reply.Entities[0] as Mention).Text.StartsWith("<at>"));
        }

        /// <summary>
        /// @Mention tests with no mention text and no username. Expects exception.
        /// </summary>
        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void AddMention_WithNoMentionTextAndNoChannelAccountName()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            Activity reply = sampleActivity.CreateReply().AddMentionToText(
                new ChannelAccount
                {
                    Id = sampleActivity.From.Id
                },
                MentionTextLocation.PrependText);
        }

        /// <summary>
        /// @Mention tests with entities instantiated to null (new Activity case).
        /// </summary>
        [TestMethod]
        public void AddMention_WithEntitiesAsNull()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            Activity reply = sampleActivity.CreateReply();
            reply.Entities = null;
            reply = reply.AddMentionToText(sampleActivity.From, MentionTextLocation.PrependText);
            Assert.IsTrue(reply.Entities.Count == 1);
            Assert.IsInstanceOfType(reply.Entities[0], typeof(Mention));
            Assert.IsTrue(reply.Text.Contains((reply.Entities[0] as Mention).Text));
            Assert.IsTrue((reply.Entities[0] as Mention).Text == "<at>" + (reply.Entities[0] as Mention).Mentioned.Name + "</at>");
        }

        /// <summary>
        /// Activity extensions tests for strip mentions with mentions in it.
        /// </summary>
        [TestMethod]
        public void RemoveMentions_StripMentionsWithMentionsInIt()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivity2AtMentions.json"));
            string noMentionText = sampleActivity.GetTextWithoutMentions();
            Assert.IsTrue(sampleActivity.Text.Contains(noMentionText));
            Assert.AreEqual("TestMessage", noMentionText);
        }

        /// <summary>
        /// Test to removes mentions from activity with no mentions.
        /// </summary>
        [TestMethod]
        public void RemoveMentions_StripMentionsWithNoMentions()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityNoMentions.json"));
            string noMentionText = sampleActivity.GetTextWithoutMentions();
            Assert.IsTrue(sampleActivity.Text.Contains(noMentionText));
            Assert.AreEqual(sampleActivity.Text, noMentionText);
        }
    }
}
