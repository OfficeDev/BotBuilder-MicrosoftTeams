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
    using System.IO;

    [TestClass]
    public class TaskModuleTests
    {
        /// <summary>
        /// Test ToAttachment() extension method where adaptive card is created from JSON.
        /// </summary>
        [TestMethod]
        public void CardTests_AdaptiveCard_JsonToAttachment()
        {
            TaskModuleEnvelope taskModuleEnvelope = new TaskModuleEnvelope
            {
                Task = new TaskModule
                {
                    Type = "continue",
                    Value = new TaskModuleInfo()
                    {
                        Title = "Custom Form",
                        Height = 510,
                        Width = 430,
                        FallbackUrl = "https://contoso.com/teamsapp/customform",
                        Url = "https://contoso.com/teamsapp/customform"
                    }

                }
            };
            var taskModuleFromFile = JsonConvert.DeserializeObject<TaskModuleEnvelope>(File.ReadAllText(@"Jsons\SampleTaskModuleCustomForm.json"));
            Assert.IsTrue(JObject.DeepEquals(JObject.FromObject(taskModuleFromFile), JObject.FromObject(taskModuleEnvelope)));
        }
    }
}
