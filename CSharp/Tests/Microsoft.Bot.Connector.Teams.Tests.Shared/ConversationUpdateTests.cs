

// 
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
// 
// Microsoft Teams: https://dev.office.com/microsoft-teams
// 
// Bot Builder Microsoft Teams SDK GitHub
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
//

namespace Microsoft.Bot.Connector.Teams.Tests
{
    using System;
    using System.IO;
    using Models;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Conversation update tests.
    /// </summary>
    [TestClass]
    public class ConversationUpdateTests
    {
        /// <summary>
        /// Conversation update test for event channel created.
        /// </summary>
        [TestMethod]
        public void ConversationUpdate_ChannelCreated()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityChannelCreated.json"));
            TeamEventBase eventData = sampleActivity.GetConversationUpdateData();

            Assert.AreEqual(eventData.EventType, TeamEventType.ChannelCreated);
            Assert.IsNotNull(eventData as ChannelCreatedEvent);
            Assert.AreEqual((eventData as ChannelCreatedEvent).Channel.Id, "19:Channel@thread.skype");
            Assert.AreEqual((eventData as ChannelCreatedEvent).Channel.Name, "Channel2");
            Assert.AreEqual((eventData as ChannelCreatedEvent).Team.Id, "19:ThreadID@thread.skype");
            Assert.AreEqual((eventData as ChannelCreatedEvent).Tenant.Id, "3b9e9fbb-ed2f-415b-b776-cf788e573366");
        }

        /// <summary>
        /// Conversation update test for event channel deleted.
        /// </summary>
        [TestMethod]
        public void ConversationUpdate_ChannelDeleted()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityChannelDeleted.json"));
            TeamEventBase eventData = sampleActivity.GetConversationUpdateData();

            Assert.AreEqual(eventData.EventType, TeamEventType.ChannelDeleted);
            Assert.IsNotNull(eventData as ChannelDeletedEvent);
            Assert.AreEqual((eventData as ChannelDeletedEvent).Channel.Id, "19:Channel@thread.skype");
            Assert.AreEqual((eventData as ChannelDeletedEvent).Channel.Name, "Channel2");
            Assert.AreEqual((eventData as ChannelDeletedEvent).Team.Id, "19:ThreadID@thread.skype");
            Assert.AreEqual((eventData as ChannelDeletedEvent).Tenant.Id, "3b9e9fbb-ed2f-415b-b776-cf788e573366");
        }

        /// <summary>
        /// Conversation update test for event channel renamed.
        /// </summary>
        [TestMethod]
        public void ConversationUpdate_ChannelRenamed()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityChannelRenamed.json"));
            TeamEventBase eventData = sampleActivity.GetConversationUpdateData();

            Assert.AreEqual(eventData.EventType, TeamEventType.ChannelRenamed);
            Assert.IsNotNull(eventData as ChannelRenamedEvent);
            Assert.AreEqual((eventData as ChannelRenamedEvent).Channel.Id, "19:Channel2@thread.skype");
            Assert.AreEqual((eventData as ChannelRenamedEvent).Channel.Name, "Channel3");
            Assert.AreEqual((eventData as ChannelRenamedEvent).Team.Id, "19:ThreadID@thread.skype");
            Assert.AreEqual((eventData as ChannelRenamedEvent).Tenant.Id, "3b9e9fbb-ed2f-415b-b776-cf788e573366");
        }

        /// <summary>
        /// Conversation update test for event members added.
        /// </summary>
        [TestMethod]
        public void ConversationUpdate_MembersAdded()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityMembersAdded.json"));
            TeamEventBase eventData = sampleActivity.GetConversationUpdateData();

            Assert.AreEqual(eventData.EventType, TeamEventType.MembersAdded);
            Assert.IsNotNull(eventData as MembersAddedEvent);
            Assert.AreEqual((eventData as MembersAddedEvent).Team.Id, "19:ThreadID@thread.skype");
            Assert.AreEqual((eventData as MembersAddedEvent).Tenant.Id, "3b9e9fbb-ed2f-415b-b776-cf788e573366");
            Assert.AreEqual((eventData as MembersAddedEvent).MembersAdded.Count, 1);
            Assert.AreEqual((eventData as MembersAddedEvent).MembersAdded[0].Id, "29:UniqueID");
        }

        /// <summary>
        /// Conversation update test for event members removed.
        /// </summary>
        [TestMethod]
        public void ConversationUpdate_MembersRemoved()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityMembersRemoved.json"));
            TeamEventBase eventData = sampleActivity.GetConversationUpdateData();

            Assert.AreEqual(eventData.EventType, TeamEventType.MembersRemoved);
            Assert.IsNotNull(eventData as MembersRemovedEvent);
            Assert.AreEqual((eventData as MembersRemovedEvent).Team.Id, "19:ThreadID@thread.skype");
            Assert.AreEqual((eventData as MembersRemovedEvent).Tenant.Id, "3b9e9fbb-ed2f-415b-b776-cf788e573366");
            Assert.AreEqual((eventData as MembersRemovedEvent).MembersRemoved.Count, 1);
            Assert.AreEqual((eventData as MembersRemovedEvent).MembersRemoved[0].Id, "29:UniqueID");
        }

        /// <summary>
        /// Conversation update test for event team renamed.
        /// </summary>
        [TestMethod]
        public void ConversationUpdate_TeamRenamed()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityTeamRenamed.json"));
            TeamEventBase eventData = sampleActivity.GetConversationUpdateData();

            Assert.AreEqual(eventData.EventType, TeamEventType.TeamRenamed);
            Assert.IsNotNull(eventData as TeamRenamedEvent);
            Assert.AreEqual((eventData as TeamRenamedEvent).Team.Id, "19:ThreadID2@thread.skype");
            Assert.AreEqual((eventData as TeamRenamedEvent).Team.Name, "Test Team");
            Assert.AreEqual((eventData as TeamRenamedEvent).Tenant.Id, "3b9e9fbb-ed2f-415b-b776-cf788e573366");
        }

        /// <summary>
        /// Conversation update test for when activity is not an update.
        /// </summary>
        [ExpectedException(typeof(ArgumentException))]
        [TestMethod]
        public void ConversatioUpdate_NonUpdateActivity()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            TeamEventBase eventData = sampleActivity.GetConversationUpdateData();
        }

        /// <summary>
        /// Conversation update test for missing channel data.
        /// </summary>
        [ExpectedException(typeof(ArgumentNullException))]
        [TestMethod]
        public void ConversationUpdate_MissingChannelData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityTeamRenamed.json"));
            sampleActivity.ChannelData = null;
            TeamEventBase eventData = sampleActivity.GetConversationUpdateData();
        }

        /// <summary>
        /// Conversation update test for missing event type.
        /// </summary>
        [ExpectedException(typeof(ArgumentException))]
        [TestMethod]
        public void ConversationUpdate_MissingEventType()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityTeamRenamed.json"));
            var channelData = JsonConvert.DeserializeObject<TeamsChannelData>(sampleActivity.ChannelData.ToString());
            channelData.EventType = null;
            sampleActivity.ChannelData = JObject.FromObject(channelData);
            TeamEventBase eventData = sampleActivity.GetConversationUpdateData();
        }
    }
}
