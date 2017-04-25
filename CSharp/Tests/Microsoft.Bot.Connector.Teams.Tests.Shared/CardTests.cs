namespace Microsoft.Bot.Connector.Teams.Tests
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Fakes;
    using System.Threading.Tasks;
    using Microsoft.QualityTools.Testing.Fakes;
    using Models;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Custom card tests.
    /// </summary>
    [TestClass]
    public class CardTests
    {
        /// <summary>
        /// O365 connector card.
        /// </summary>
        [TestMethod]
        public void CardTests_O365ConnectorCard()
        {
            var section = new O365ConnectorCardSection(
                "This is the **section's title** property",
                "This is the section's text property. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                "This is the section's activityTitle property",
                "This is the section's activitySubtitle property",
                "This is the section's activityText property.",
                "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg",
                new List<O365ConnectorCardFact>()
                {
                    new O365ConnectorCardFact("This is a fact name", "This is a fact value"),
                    new O365ConnectorCardFact("This is a fact name", "This is a fact value"),
                    new O365ConnectorCardFact("This is a fact name", "This is a fact value")
                },
                new List<O365ConnectorCardImage>()
                {
                    new O365ConnectorCardImage("http://connectorsdemo.azurewebsites.net/images/MicrosoftSurface_024_Cafe_OH-06315_VS_R1c.jpg"),
                    new O365ConnectorCardImage("http://connectorsdemo.azurewebsites.net/images/WIN12_Scene_01.jpg"),
                    new O365ConnectorCardImage("http://connectorsdemo.azurewebsites.net/images/WIN12_Anthony_02.jpg")
                },
                new List<O365ConnectorCardActionBase>()
                {
                    new O365ConnectorCardViewAction()
                    {
                        Type = O365ConnectorCardViewAction.ContentType,
                        Name = "View",
                        Target = new List<string>() { "http://microsoft.com" }
                    },
                    new O365ConnectorCardViewAction()
                    {
                        Type = O365ConnectorCardViewAction.ContentType,
                        Name = "View",
                        Target = new List<string>() { "http://microsoft.com" }
                    }
                });

            var card = new O365ConnectorCard(
                "This is the card title property",
                "This is the card's text property. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                "This is the summary property",
                "E81123",
                new List<O365ConnectorCardSection>() { section });

            this.TestCard(new Attachment
            {
                Content = card,
                ContentType = O365ConnectorCard.ContentType
            });
        }

        /////// <summary>
        /////// Person card test.
        /////// </summary>
        ////[TestMethod]
        ////public void CardTests_PersonCard()
        ////{
        ////    string upn = "testperson@test.com";
        ////    var attachment = new Attachment
        ////    {
        ////        ContentType = PersonCard.ContentType,
        ////        Content = new PersonCard
        ////        {
        ////            Upn = upn,
        ////            Text = "TestText",
        ////            Buttons = new List<CardAction>()
        ////                {
        ////                    new CardAction() { Title = "Availability", Type = ActionTypes.ImBack, Value = "availability " + upn },
        ////                    new CardAction() { Title = "Reports To", Type = ActionTypes.ImBack, Value = "reportsto " + upn },
        ////                    new CardAction() { Title = "Recent Files", Type = ActionTypes.ImBack, Value = "recentfiles " + upn },
        ////                    new CardAction() { Title = "Works With", Type = ActionTypes.ImBack, Value = "workswith " + upn },
        ////                },
        ////        }
        ////    };

        ////    this.TestCard(attachment);
        ////}

        /////// <summary>
        /////// File list card test.
        /////// </summary>
        ////[TestMethod]
        ////public void CardTests_FileList()
        ////{
        ////    string[] urls =
        ////    {
        ////        "https://test.sharepoint.com/personal/test_test_com/next/test.pptx",
        ////        "https://test.sharepoint.com/personal/test_test_com/next/test1.pptx",
        ////        "https://test.sharepoint.com/personal/test_test_com/next/test2.pptx",
        ////        "https://test.sharepoint.com/personal/test_test_com/next/test3.pptx",
        ////    };

        ////    var attachment = new Attachment()
        ////    {
        ////        ContentType = ListCard.ContentType,
        ////        Content = new ListCard
        ////        {
        ////            Title = "Larry Jin Recent Files",
        ////            Items = new List<ListItemBase>()
        ////                {
        ////                    new FileListItem() { Type = FileListItem.ContentType, Id = urls[0], Title = "Framework", Subtitle = "teams > Framework", Tap = new CardAction() { Type = ActionTypes.OpenUrl, Value = urls[0] } },
        ////                    new FileListItem() { Type = FileListItem.ContentType, Id = urls[1], Title = "Bots", Subtitle = "teams > Bots", Tap = new CardAction() { Type = ActionTypes.OpenUrl, Value = urls[1] } },
        ////                    new FileListItem() { Type = FileListItem.ContentType, Id = urls[2], Title = "Actions", Subtitle = "teams > Actions", Tap = new CardAction() { Type = ActionTypes.OpenUrl, Value = urls[2] } },
        ////                    new FileListItem() { Type = FileListItem.ContentType, Id = urls[3], Title = "Responses", Subtitle = "teams > Responses", Tap = new CardAction() { Type = ActionTypes.OpenUrl, Value = urls[3] } }
        ////                },
        ////            Buttons = new List<CardAction>()
        ////                {
        ////                    new CardAction() { Title = "Open Online", Type = ActionTypes.ImBack, Value = "editOnline" },
        ////                    new CardAction() { Title = "Open in Office", Type = ActionTypes.ImBack, Value = "editInOffice" }
        ////                },
        ////        }
        ////    };

        ////    this.TestCard(attachment);
        ////}

        /////// <summary>
        /////// Person list card.
        /////// </summary>
        ////[TestMethod]
        ////public void CardTests_PersonList()
        ////{
        ////    var attachment = new Attachment()
        ////    {
        ////        ContentType = ListCard.ContentType,
        ////        Content = new ListCard
        ////        {
        ////            Title = "Test Team",
        ////            Items = new List<ListItemBase>()
        ////                {
        ////                    new SectionListItem() { Title = "Manager", Type = SectionListItem.ContentType },
        ////                    new PersonListItem() { Type = PersonListItem.ContentType, Id = "Test1@test.com", Title = "Test 1", Subtitle = "PPP", Tap = new CardAction() { Type = ActionTypes.ImBack, Value = "whois Test1@test.com" } },
        ////                    new SectionListItem() { Title = "Direct Reports", Type = SectionListItem.ContentType },
        ////                    new PersonListItem() { Type = PersonListItem.ContentType, Id = "Test2@test.com", Title = "Test 2", Subtitle = "SSS", Tap = new CardAction() { Type = ActionTypes.ImBack, Value = "whois Test2@test.com" } },
        ////                    new PersonListItem() { Type = PersonListItem.ContentType, Id = "Test3@test.com", Title = "Test 3", Subtitle = "TTT", Tap = new CardAction() { Type = ActionTypes.ImBack, Value = "whois Test3@test.com" } },
        ////                    new PersonListItem() { Type = PersonListItem.ContentType, Id = "Test4@test.com", Title = "Test 4", Subtitle = "RRR", Tap = new CardAction() { Type = ActionTypes.ImBack, Value = "whois Test4@test.com" } },
        ////                    new PersonListItem() { Type = PersonListItem.ContentType, Id = "Test5@test.com", Title = "Test 5", Subtitle = "UUU", Tap = new CardAction() { Type = ActionTypes.ImBack, Value = "whois Test5@test.com" } }
        ////                },
        ////            Buttons = new List<CardAction>()
        ////                {
        ////                    new CardAction() { Title = "Select", Type = ActionTypes.ImBack, Value = "whois" }
        ////                },
        ////        }
        ////    };

        ////    this.TestCard(attachment);
        ////}

        /// <summary>
        /// Tests card attachment before and after sending match.
        /// </summary>
        /// <param name="attachment">Attachment to verify.</param>
        private void TestCard(Attachment attachment)
        {
            JsonSerializerSettings serializerSettings = new JsonSerializerSettings();
            serializerSettings.NullValueHandling = NullValueHandling.Ignore;

            Activity activity = new Activity()
            {
                Text = "Test",
                ServiceUrl = "https://testservice.com",
                Attachments = new List<Attachment>() { attachment },
            };

            BotServiceProvider.Instance.GetHashCode();
            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test");

            using (ShimsContext.Create())
            {
                ShimHttpClient.AllInstances.SendAsyncHttpRequestMessageCancellationToken =
                    (client, request, token) =>
                    {
                        string data = (request.Content as StringContent).ReadAsStringAsync().ConfigureAwait(false).GetAwaiter().GetResult();
                        Activity receivedActivity = JsonConvert.DeserializeObject<Activity>(data, serializerSettings);

                        Assert.AreEqual(receivedActivity.Attachments.Count, activity.Attachments.Count);
                        Assert.IsTrue(JObject.DeepEquals(JObject.FromObject(activity.Attachments[0].Content, JsonSerializer.Create(serializerSettings)), JObject.FromObject(receivedActivity.Attachments[0].Content)));

                        ResourceResponse resourceResponse = new ResourceResponse("TestId");
                        StringContent responseContent = new StringContent(JsonConvert.SerializeObject(resourceResponse));
                        var response = new HttpResponseMessage(HttpStatusCode.OK);
                        response.Content = responseContent;
                        return Task.FromResult(response);
                    };

                Assert.IsTrue(conClient.Conversations.SendToConversation(activity, "Test").Id == "TestId");
            }
        }
    }
}
