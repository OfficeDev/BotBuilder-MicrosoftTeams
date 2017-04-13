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
    using VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Teams Fetch Channel list tests.
    /// </summary>
    [TestClass]
    public partial class TeamsAPITests
    {
        /// <summary>
        /// Teams API test for fetching channel list.
        /// </summary>
        [TestMethod]
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

            BotServiceProvider.Instance.GetHashCode();
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
        [TestMethod]
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

            BotServiceProvider.Instance.GetHashCode();
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
        [TestMethod]
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

            BotServiceProvider.Instance.GetHashCode();
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
        [TestMethod]
        public void TeamsAPI_FetchChannelListTestInvalidHttpCode()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            BotServiceProvider.Instance.GetHashCode();
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
        [TestMethod]
        public void TeamsAPI_FetchChannelListTestInvalidHttpCodeWithoutResponseContent()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            BotServiceProvider.Instance.GetHashCode();
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
        [TestMethod]
        public void TeamsAPI_FetchChannelListTestInvalidResonse()
        {
            BotServiceProvider.Instance.GetHashCode();
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
        [TestMethod]
        public void TeamsAPI_FetchChannelListTestInvalidTeamId()
        {
            BotServiceProvider.Instance.GetHashCode();
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
