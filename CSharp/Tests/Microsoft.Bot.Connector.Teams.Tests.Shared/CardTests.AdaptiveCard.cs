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
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json;

    /// <summary>
    /// Adaptive card tests.
    /// </summary>
    public partial class CardTests
    {
        /// <summary>
        /// Test ToAttachment() extension method where adaptive card is created from JSON.
        /// </summary>
        [TestMethod]
        public void CardTests_AdaptiveCard_JsonToAttachment()
        {
            AdaptiveCards.AdaptiveCardParseResult card = AdaptiveCards.AdaptiveCard.FromJson(File.ReadAllText(@"Jsons\SampleAdaptiveCard.json"));
            Attachment attachment = card.ToAttachment();

            AdaptiveCards.AdaptiveCard expectedCard = new AdaptiveCards.AdaptiveCard();
            expectedCard.Body.Add(new AdaptiveCards.AdaptiveTextBlock("some text on card"));

            var action = new AdaptiveCards.AdaptiveOpenUrlAction();
            action.Url = new Uri("https://microsoft.com");
            expectedCard.Actions.Add(action);

            Assert.IsNotNull(attachment);
            Assert.IsNotNull(attachment.Content);
            Assert.IsNotNull(attachment.ContentType);
            Assert.AreEqual(attachment.ContentType, AdaptiveCards.AdaptiveCard.ContentType);
            Assert.IsTrue(JObject.DeepEquals(JObject.FromObject(expectedCard), JObject.FromObject(attachment.Content)));
        }

        /// <summary>
        /// Test ToAttachment() extension method where card is created from AdaptiveCard object.
        /// </summary>
        [TestMethod]
        public void CardTests_AdaptiveCard_CardToAttachment()
        {
            AdaptiveCards.AdaptiveCard card = new AdaptiveCards.AdaptiveCard();
            card.Body.Add(new AdaptiveCards.AdaptiveTextBlock("some text on card"));

            var action = new AdaptiveCards.AdaptiveOpenUrlAction();
            action.Url = new Uri("https://microsoft.com");
            card.Actions.Add(action);

            Attachment attachment = card.ToAttachment();

            Assert.IsNotNull(attachment);
            Assert.IsNotNull(attachment.Content);
            Assert.IsNotNull(attachment.ContentType);
            Assert.AreEqual(attachment.ContentType, AdaptiveCards.AdaptiveCard.ContentType);
            Assert.IsTrue(JObject.DeepEquals(JObject.FromObject(card), JObject.FromObject(attachment.Content)));
        }

        /// <summary>
        /// Test for adaptive card wrapping BotBuilder actions 
        /// where action is wrapped by AdaptiveSubmitAction extension method RepresentAsBotBuilderAction() 
        /// that can represent itself as a BotBuilder action.
        /// </summary>
        [TestMethod]
        public void CardTests_AdaptiveCard_BotBuilderAction_RepresentAsBotBuilderAction()
        {
            var wrapAction = new CardAction
            {
                Type = "imback",
                Value = "Text",
                Title = "button title"
            };

            var action = new AdaptiveCards.AdaptiveSubmitAction();
            action.DataJson = @"{""key"": ""value""}";
            action.RepresentAsBotBuilderAction(wrapAction);

            var expectedAction = JsonConvert.DeserializeObject(@"{
                ""type"": ""Action.Submit"",
                ""title"": ""button title"",
                ""data"": {
                    ""key"": ""value"",
                    ""msteams"": {
                        ""type"": ""imback"",
                        ""value"": ""Text""
                    }
                }
            }");

            Assert.IsTrue(JObject.DeepEquals(JObject.FromObject(expectedAction), JObject.FromObject(action)));

            var card = new AdaptiveCards.AdaptiveCard();
            card.Body.Add(new AdaptiveCards.AdaptiveTextBlock());
            card.Actions.Add(action);

            Attachment attachment = card.ToAttachment();
            this.TestCard(attachment);
        }

        /// <summary>
        /// Test for adaptive card wrapping BotBuilder actions
        /// where action is wrapped by adapter class AdaptiveBotBuilderAction
        /// that can seamlessly seal BotBuilder card action into an adaptive card action.
        /// </summary>
        [TestMethod]
        public void CardTests_AdaptiveCard_BotBuilderAction_AdaptiveBotBuilderAction()
        {
            var wrapAction = new CardAction
            {
                Type = "messageBack",
                Value = "some value to bots",
                Title = "button title",
                Text = "text posting back to bots",
                DisplayText = "display text injected in chat stream"
            };

            var action = new AdaptiveBotBuilderAction(wrapAction);

            var expectedAction = JsonConvert.DeserializeObject(@"{
                ""type"": ""Action.Submit"",
                ""title"": ""button title"",
                ""data"": {
                    ""msteams"": {
                        ""type"": ""messageBack"",
                        ""value"": ""some value to bots"",
                        ""text"": ""text posting back to bots"",
                        ""displayText"": ""display text injected in chat stream"",
                    }
                }
            }");

            Assert.IsTrue(JObject.DeepEquals(JObject.FromObject(expectedAction), JObject.FromObject(action)));

            var card = new AdaptiveCards.AdaptiveCard();
            card.Body.Add(new AdaptiveCards.AdaptiveTextBlock());
            card.Actions.Add(action);

            Attachment attachment = card.ToAttachment();
            this.TestCard(attachment);
        }
    }
}
