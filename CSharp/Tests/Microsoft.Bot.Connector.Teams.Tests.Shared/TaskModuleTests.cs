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
            TaskModuleResponseEnvelope currentTaskModuleEnvelope = new TaskModuleResponseEnvelope
            {
                Task = new TaskModuleContinueResponse
                {
                    Type = "continue",
                    Value = new TaskModuleTaskInfo()
                    {
                        Title = "Custom Form",
                        Height = 510,
                        Width = 430,
                        Url = "https://contoso.com/teamsapp/customform",
                        FallbackUrl = "https://contoso.com/teamsapp/customform"
                    }

                }
            };

            var expectedTaskModuleEnvelope = JObject.Parse(File.ReadAllText(@"Jsons\SampleTaskModuleCustomFormPayload.json"));
            Assert.IsTrue(expectedTaskModuleEnvelope != null);
            var currentTaskJObject = JObject.FromObject(currentTaskModuleEnvelope, new JsonSerializer() { NullValueHandling = NullValueHandling.Ignore });
            Assert.IsTrue(JObject.DeepEquals(currentTaskJObject, expectedTaskModuleEnvelope));
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

            TaskModuleResponseEnvelope currentTaskModuleEnvelope = new TaskModuleResponseEnvelope
            {
                Task = new TaskModuleContinueResponse
                {
                    Value = new TaskModuleTaskInfo()
                    {
                        Title = "Adaptive Card: Inputs",
                        Card = currentAdaptiveCard.ToAttachment(),
                        Height = "small",
                        Width = "small",
                    },
                    Type = "continue",
                }
            };

            var inputJson = File.ReadAllText(@"Jsons\SampleTaskModuleAdaptiveCardPayload.json");
            var expectedTaskModuleEnvelope = JObject.Parse(inputJson);
            Assert.IsTrue(expectedTaskModuleEnvelope != null);
            Assert.IsTrue(expectedTaskModuleEnvelope["task"] != null);
            Assert.IsTrue(expectedTaskModuleEnvelope["task"]["type"].ToString() == currentTaskModuleEnvelope.Task.Type);
            
            var expected = JsonConvert.DeserializeObject<TaskModuleTaskInfo>(expectedTaskModuleEnvelope["task"]["value"].ToString());
            var current = (currentTaskModuleEnvelope.Task as TaskModuleContinueResponse).Value as TaskModuleTaskInfo;
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
            TaskModuleResponseEnvelope currentTaskModuleEnvelope = new TaskModuleResponseEnvelope
            {
                Task = new TaskModuleMessageResponse
                {
                    Type = "message",
                    Value = "This is a test message"
                }
            };

            var expectedTaskModuleEnvelope = JObject.Parse(File.ReadAllText(@"Jsons\SampleTaskModuleMessagePayload.json"));
            Assert.IsTrue(expectedTaskModuleEnvelope != null);
            Assert.IsTrue(JObject.DeepEquals(JObject.FromObject(currentTaskModuleEnvelope), expectedTaskModuleEnvelope));
        }
    }
}
