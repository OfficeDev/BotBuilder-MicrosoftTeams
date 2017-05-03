namespace Microsoft.Bot.Connector.Teams.Tests
{
    using System;
    using System.Collections.Generic;
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
    }
}
