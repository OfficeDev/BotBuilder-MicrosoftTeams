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
    using System.Configuration;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Fakes;
    using System.Threading.Tasks;
    using Microsoft.QualityTools.Testing.Fakes;
    using Microsoft.Rest;
    using Models;
    using Newtonsoft.Json;
    using NUnit.Framework;

    /// <summary>
    /// Teams Fetch Channel list tests.
    /// </summary>
    [TestFixture]
    public partial class TeamsAPITests
    {
        /// <summary>
        /// Teams API test for fetching channel list.
        /// </summary>
        [Test]
        public void TeamsAPI_FetchChannelListTest()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            ConversationList conversationList = new ConversationList
            {
                Conversations = new List<ChannelInfo>
                {
                    new ChannelInfo
                    {
                        Id = "ChannelId",
                        Name = "ChannelName"
                    }
                }
            };

            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"]);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();

            using (ShimsContext.Create())
            {
                ShimHttpClient.AllInstances.SendAsyncHttpRequestMessageCancellationToken =
                    (client, request, token) =>
                {
                    StringContent stringContent = new StringContent(JsonConvert.SerializeObject(conversationList));
                    var response = new HttpResponseMessage(HttpStatusCode.OK);
                    response.Content = stringContent;
                    return Task.FromResult(response);
                };

                ConversationList conversationListResponse = teamsConnectorClient.Teams.FetchChannelList("TestTeamId");

                Assert.IsNotNull(conversationListResponse);
                Assert.IsNotNull(conversationListResponse.Conversations);
                Assert.AreEqual(conversationListResponse.Conversations.Count, 1);
                Assert.AreEqual(conversationListResponse.Conversations[0].Id, conversationList.Conversations[0].Id);
                Assert.AreEqual(conversationListResponse.Conversations[0].Name, conversationList.Conversations[0].Name);
            }
        }

        /// <summary>
        /// Teams API test for fetching channel list async.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [Test]
        public async Task TeamsAPI_FetchChannelListAsyncTest()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            ConversationList conversationList = new ConversationList
            {
                Conversations = new List<ChannelInfo>
                {
                    new ChannelInfo
                    {
                        Id = "ChannelId",
                        Name = "ChannelName"
                    }
                }
            };

            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"]);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();

            using (ShimsContext.Create())
            {
                ShimHttpClient.AllInstances.SendAsyncHttpRequestMessageCancellationToken =
                    (client, request, token) =>
                    {
                        StringContent stringContent = new StringContent(JsonConvert.SerializeObject(conversationList));
                        var response = new HttpResponseMessage(HttpStatusCode.OK);
                        response.Content = stringContent;
                        return Task.FromResult(response);
                    };

                ConversationList conversationListResponse = await teamsConnectorClient.Teams.FetchChannelListAsync("TestTeamId");

                Assert.IsNotNull(conversationListResponse);
                Assert.IsNotNull(conversationListResponse.Conversations);
                Assert.AreEqual(conversationListResponse.Conversations.Count, 1);
                Assert.AreEqual(conversationListResponse.Conversations[0].Id, conversationList.Conversations[0].Id);
                Assert.AreEqual(conversationListResponse.Conversations[0].Name, conversationList.Conversations[0].Name);
            }
        }

        /// <summary>
        /// Teams API test for fetching channel list async with advanced options.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [Test]
        public async Task TeamsAPI_FetchChannelListAsyncWithHttpMessagesTest()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            ConversationList conversationList = new ConversationList
            {
                Conversations = new List<ChannelInfo>
                {
                    new ChannelInfo
                    {
                        Id = "ChannelId",
                        Name = "ChannelName"
                    }
                }
            };

            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"]);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();

            using (ShimsContext.Create())
            {
                ShimHttpClient.AllInstances.SendAsyncHttpRequestMessageCancellationToken =
                    (client, request, token) =>
                    {
                        StringContent stringContent = new StringContent(JsonConvert.SerializeObject(conversationList));
                        var response = new HttpResponseMessage(HttpStatusCode.OK);
                        response.Content = stringContent;
                        Assert.IsNotNull(request.Headers.GetValues("Authorization"));
                        Assert.AreEqual(request.Headers.GetValues("Authorization").Count(), 1);
                        Assert.AreEqual(request.Headers.GetValues("Authorization").ToList()[0], "CustomValue");
                        return Task.FromResult(response);
                    };

                ConversationList conversationListResponse = (await teamsConnectorClient.Teams.FetchChannelListWithHttpMessagesAsync(
                    "TestTeamId",
                    new Dictionary<string, List<string>>() { { "Authorization", new List<string>() { "CustomValue" } } })).Body;

                Assert.IsNotNull(conversationListResponse);
                Assert.IsNotNull(conversationListResponse.Conversations);
                Assert.AreEqual(conversationListResponse.Conversations.Count, 1);
                Assert.AreEqual(conversationListResponse.Conversations[0].Id, conversationList.Conversations[0].Id);
                Assert.AreEqual(conversationListResponse.Conversations[0].Name, conversationList.Conversations[0].Name);
            }
        }

        /// <summary>
        /// Teams API test for fetch channel list with invalid http code in response.
        /// </summary>
        [ExpectedException(typeof(HttpOperationException))]
        [Test]
        public void TeamsAPI_FetchChannelListTestInvalidHttpCode()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"]);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();

            using (ShimsContext.Create())
            {
                ShimHttpClient.AllInstances.SendAsyncHttpRequestMessageCancellationToken =
                    (client, request, token) =>
                    {
                        StringContent stringContent = new StringContent("RandomRandomRandom");
                        var response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                        response.Content = stringContent;
                        return Task.FromResult(response);
                    };

                ConversationList conversationListResponse = teamsConnectorClient.Teams.FetchChannelList("TestTeamId");
            }
        }

        /// <summary>
        /// Teams API test for fetch channel list with invalid http code and no response body.
        /// </summary>
        [ExpectedException(typeof(HttpOperationException))]
        [Test]
        public void TeamsAPI_FetchChannelListTestInvalidHttpCodeWithoutResponseContent()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"]);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();

            using (ShimsContext.Create())
            {
                ShimHttpClient.AllInstances.SendAsyncHttpRequestMessageCancellationToken =
                    (client, request, token) =>
                    {
                        var response = new HttpResponseMessage(HttpStatusCode.NotFound);
                        return Task.FromResult(response);
                    };

                ConversationList conversationListResponse = teamsConnectorClient.Teams.FetchChannelList("TestTeamId");
            }
        }

        /// <summary>
        /// Teams API test for fetch channel list with invalid http code in response and response body.
        /// </summary>
        [ExpectedException(typeof(SerializationException))]
        [Test]
        public void TeamsAPI_FetchChannelListTestInvalidResonse()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"]);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();

            using (ShimsContext.Create())
            {
                ShimHttpClient.AllInstances.SendAsyncHttpRequestMessageCancellationToken =
                    (client, request, token) =>
                    {
                        StringContent stringContent = new StringContent("RandomRandomRandom");
                        var response = new HttpResponseMessage(HttpStatusCode.OK);
                        response.Content = stringContent;
                        return Task.FromResult(response);
                    };

                ConversationList conversationListResponse = teamsConnectorClient.Teams.FetchChannelList("TestTeamId");
            }
        }

        /// <summary>
        /// Teams API test for fetch channel list with invalid team Id.
        /// </summary>
        [ExpectedException(typeof(ValidationException))]
        [Test]
        public void TeamsAPI_FetchChannelListTestInvalidTeamId()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"]);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();

            using (ShimsContext.Create())
            {
                ShimHttpClient.AllInstances.SendAsyncHttpRequestMessageCancellationToken =
                    (client, request, token) =>
                    {
                        StringContent stringContent = new StringContent("RandomRandomRandom");
                        var response = new HttpResponseMessage(HttpStatusCode.OK);
                        response.Content = stringContent;
                        return Task.FromResult(response);
                    };

                ConversationList conversationListResponse = teamsConnectorClient.Teams.FetchChannelList(null);
            }
        }
    }
}
