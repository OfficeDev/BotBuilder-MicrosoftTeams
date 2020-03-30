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
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Bot.Connector.Teams.Models;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Connector extension tests.
    /// </summary>
    [TestClass]
    public class ConnectorExtensionTests
    {
        /// <summary>
        /// Connector extensions test for creating 1 on 1 conversation between bot and user.
        /// </summary>
        [TestMethod]
        public void ConnectorExtensions_Create1on1()
        {
            JsonSerializerSettings serializerSettings = new JsonSerializerSettings();
            serializerSettings.NullValueHandling = NullValueHandling.Ignore;

            var botAccount = new ChannelAccount
            {
                Id = "BotId",
                Name = "BotName"
            };

            var userAccount = new ChannelAccount
            {
                Id = "UserId",
                Name = "UserName"
            };

            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                string data = (request.Content as StringContent).ReadAsStringAsync().ConfigureAwait(false).GetAwaiter().GetResult();
                ConversationParameters receivedRequest = JsonConvert.DeserializeObject<ConversationParameters>(data, serializerSettings);

                Assert.AreEqual(receivedRequest.Bot.Id, botAccount.Id);
                Assert.IsNotNull(receivedRequest.Members);
                Assert.IsTrue(receivedRequest.Members.Count == 1);
                Assert.AreEqual(receivedRequest.Members[0].Id, userAccount.Id);

                TeamsChannelData channelData = JsonConvert.DeserializeObject<TeamsChannelData>(receivedRequest.ChannelData.ToString());

                Assert.IsNotNull(channelData);
                Assert.IsNotNull(channelData.Tenant);
                Assert.IsNotNull(channelData.Tenant.Id);
                Assert.AreEqual(channelData.Tenant.Id, "TestTenantId");

                ConversationResourceResponse resourceResponse = new ConversationResourceResponse()
                {
                    Id = "TestId"
                };
                StringContent responseContent = new StringContent(JsonConvert.SerializeObject(resourceResponse));
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = responseContent;
                return Task.FromResult(response);
            });

            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);
            Assert.IsTrue(conClient.Conversations.CreateOrGetDirectConversation(botAccount, userAccount, "TestTenantId").Id == "TestId");
        }

        /// <summary>
        /// Get paged teams conversation members test
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task ConnectorExtensions_GetTeamsPagedConversationMembersAsync()
        {
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                Assert.IsFalse(request.Headers.Contains("X-MsTeamsTenantId"));

                StringContent stringContent = new StringContent(File.ReadAllText(@"Jsons\SampleResponseGetTeamsPaginatedConversationMembers.json"));
                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = stringContent
                };
                return Task.FromResult(response);
            });

            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);

            var memberPagedResult = await conClient.Conversations.GetTeamsPagedConversationMembersAsync("TestConversationId", 2);
            var members = memberPagedResult.Members;

            Assert.IsTrue(members.Count() == 2);
            Assert.IsFalse(string.IsNullOrEmpty(memberPagedResult.ContinuationToken));
            Assert.IsFalse(members.Any(member => string.IsNullOrEmpty(member.ObjectId)));
            Assert.IsFalse(members.Any(member => string.IsNullOrEmpty(member.Id)));
            Assert.IsFalse(members.Any(member => string.IsNullOrEmpty(member.Name)));
        }

        /// <summary>
        /// Get teams conversation members async test.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task ConnectorExtensions_GetTeamsConversationMembersAsync()
        {
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                Assert.IsFalse(request.Headers.Contains("X-MsTeamsTenantId"));

                StringContent stringContent = new StringContent(File.ReadAllText(@"Jsons\SampleResponseGetTeamsConversationMembers.json"));
                var response = new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = stringContent
                };
                return Task.FromResult(response);
            });

            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);

#pragma warning disable CS0618 // Type or member is obsolete
            var memberList = await conClient.Conversations.GetTeamsConversationMembersAsync("TestConversationId", Guid.Empty.ToString());
#pragma warning restore CS0618 // Type or member is obsolete

            Assert.IsTrue(memberList.Count() == 2);
            Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.ObjectId)));
            Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.UserPrincipalName)));
            Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.Id)));
            Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.Email)));
            Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.Name)));
        }

        /// <summary>
        /// Tests resolution of ChannelAccount to TeamsChannelAccount.
        /// </summary>
        [TestMethod]
        public void ConnectorExtensions_ResolveAsTeamsChannelAccount()
        {
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                Assert.IsFalse(request.Headers.Contains("X-MsTeamsTenantId"));

                StringContent stringContent = new StringContent(File.ReadAllText(@"Jsons\SampleResponseGetTeamsConversationMembers.json"));
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = stringContent;
                return Task.FromResult(response);
            });

            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);

            var memberList = conClient.Conversations.GetConversationMembers("TestConversationId").AsTeamsChannelAccounts();

            Assert.IsTrue(memberList.Count() == 2);
            Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.ObjectId)));
            Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.Name)));
            Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.UserPrincipalName)));
            Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.Id)));
            Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.Email)));
        }
    }
}
