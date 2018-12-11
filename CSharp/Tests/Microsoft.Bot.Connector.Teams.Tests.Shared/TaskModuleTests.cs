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
    using Microsoft.Bot.Connector.Teams.Models;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.IO;

    [TestClass]
    public class TaskModuleTests
    {
        /// <summary>
        /// Test serialization of Task Module with custom form url .
        /// </summary>
        [TestMethod]
        public void TaskModuleTests_CustomForm()
        {
            TaskModuleEnvelope currentTaskModuleEnvelope = new TaskModuleEnvelope
            {
                Task = new TaskModule
                {
                    Type = "continue",
                    Value = new TaskModuleInfo()
                    {
                        Title = "Custom Form",
                        Height = 510,
                        Width = 430,
                        Url = "https://contoso.com/teamsapp/customform",
                        FallbackUrl = "https://contoso.com/teamsapp/customform"
                    }

                }
            };

            var expectedTaskModuleEnvelope = JsonConvert.DeserializeObject<TaskModuleEnvelope>(File.ReadAllText(@"Jsons\SampleTaskModuleCustomFormPayload.json"));
            Assert.IsTrue(expectedTaskModuleEnvelope != null);
            Assert.IsTrue(expectedTaskModuleEnvelope.Task != null);
            Assert.IsTrue(expectedTaskModuleEnvelope.Task.Type == currentTaskModuleEnvelope.Task.Type);
            var expected = JsonConvert.DeserializeObject<TaskModuleInfo>(expectedTaskModuleEnvelope.Task.Value.ToString());
            Assert.IsTrue(JObject.DeepEquals(JObject.FromObject(expected), JObject.FromObject(currentTaskModuleEnvelope.Task.Value)));
        }

        /// <summary>
        /// Test serialization of Task Module with Adaptive Card.
        /// </summary>
        [TestMethod]
        public void TaskModuleTests_AdaptiveCard()
        {
            AdaptiveCards.AdaptiveCard currentAdaptiveCard = new AdaptiveCards.AdaptiveCard();
            currentAdaptiveCard.Body.Add(new AdaptiveCards.AdaptiveTextBlock("some text on card"));

            var action = new AdaptiveCards.AdaptiveOpenUrlAction();
            action.Url = new Uri("https://microsoft.com");
            currentAdaptiveCard.Actions.Add(action);

            TaskModuleEnvelope currentTaskModuleEnvelope = new TaskModuleEnvelope
            {
                Task = new TaskModule
                {
                    Type = "continue",
                    Value = new TaskModuleInfo()
                    {
                        Title = "Adaptive Card: Inputs",
                        Card = currentAdaptiveCard.ToAttachment(),
                        Height = "small",
                        Width = "small",
                    }
                }
            };

            var expectedTaskModuleEnvelope = JsonConvert.DeserializeObject<TaskModuleEnvelope>(File.ReadAllText(@"Jsons\SampleTaskModuleAdaptiveCardPayload.json"));
            Assert.IsTrue(expectedTaskModuleEnvelope != null);
            Assert.IsTrue(expectedTaskModuleEnvelope.Task != null);
            Assert.IsTrue(expectedTaskModuleEnvelope.Task.Type == currentTaskModuleEnvelope.Task.Type);
            var expected = JsonConvert.DeserializeObject<TaskModuleInfo>(expectedTaskModuleEnvelope.Task.Value.ToString());
            var current = currentTaskModuleEnvelope.Task.Value as TaskModuleInfo;
            Assert.AreEqual(expected.Width, current.Width);
            Assert.AreEqual(expected.Title, current.Title);
            Assert.AreEqual(expected.Card.ContentType, current.Card.ContentType);
        }

        /// <summary>
        /// Test serialization of Task Module with message payload.
        /// </summary>
        [TestMethod]
        public void TaskModuleTests_Message()
        {
            TaskModuleEnvelope currentTaskModuleEnvelope = new TaskModuleEnvelope
            {
                Task = new TaskModule
                {
                    Type = "message",
                    Value = "This is a test message"
                }
            };

            var expectedTaskModuleEnvelope = JsonConvert.DeserializeObject<TaskModuleEnvelope>(File.ReadAllText(@"Jsons\SampleTaskModuleMessagePayload.json"));
            Assert.IsTrue(expectedTaskModuleEnvelope != null);
            Assert.IsTrue(expectedTaskModuleEnvelope.Task.Type == currentTaskModuleEnvelope.Task.Type);
            Assert.IsTrue(expectedTaskModuleEnvelope.Task.Value.ToString() == currentTaskModuleEnvelope.Task.Value.ToString());

        }
    }
}
