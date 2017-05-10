

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
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Fakes;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Bot.Connector.Teams.Models;
    using Microsoft.QualityTools.Testing.Fakes;
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

            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test");

            using (ShimsContext.Create())
            {
                ShimHttpClient.AllInstances.SendAsyncHttpRequestMessageCancellationToken =
                    (client, request, token) =>
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
                    };

                Assert.IsTrue(conClient.Conversations.CreateOrGetDirectConversation(botAccount, userAccount, "TestTenantId").Id == "TestId");
            }
        }

        /// <summary>
        /// Get teams conversation members async test.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task ConnectorExtensions_GetTeamsConversationMembersAsync()
        {
            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test");

            using (ShimsContext.Create())
            {
                ShimHttpClient.AllInstances.SendAsyncHttpRequestMessageCancellationToken =
                (client, request, token) =>
                {
                    Assert.IsTrue(request.Headers.Contains("X-MsTeamsTenantId"));
                    Guid wasteGuid;
                    Assert.IsTrue(Guid.TryParse(request.Headers.GetValues("X-MsTeamsTenantId").Single(), out wasteGuid));
                    Assert.AreEqual(Guid.Empty, Guid.Parse(request.Headers.GetValues("X-MsTeamsTenantId").Single()));

                    StringContent stringContent = new StringContent(File.ReadAllText(@"Jsons\SampleResponseGetTeamsConversationMembers.json"));
                    var response = new HttpResponseMessage(HttpStatusCode.OK);
                    response.Content = stringContent;
                    return Task.FromResult(response);
                };

                var memberList = await conClient.Conversations.GetTeamsConversationMembersAsync("TestConversationId", Guid.Empty.ToString());

                Assert.IsTrue(memberList.Count() == 2);
                Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.ObjectId)));
                Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.UserPrincipalName)));
                Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.Id)));
                Assert.IsFalse(memberList.Any(member => string.IsNullOrEmpty(member.Email)));
            }
        }
    }
}
