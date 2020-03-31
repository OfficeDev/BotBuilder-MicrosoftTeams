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
    using System.Net;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Polly;

    /// <summary>
    /// Retry helper tests.
    /// </summary>
    [TestClass]
    public class RetryHelperTests
    {
        /// <summary>
        /// Tests default retry helper.
        /// </summary>
        /// <returns>Task tracking operation</returns>
        [TestMethod]
        public async Task RetryHelpers_DefaultRetryHelper()
        {
            DateTime dateTime = DateTime.MinValue;
            int count = 0;
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                if (count < 3)
                {
                    dateTime = DateTime.Now;
                    count++;
                    var response = new HttpResponseMessage((HttpStatusCode)429);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    var httpException = new Rest.HttpOperationException
                    {
                        Response = new Rest.HttpResponseMessageWrapper(response, "Failed")
                    };
                    throw httpException;
                }
                else
                {
                    if (!(DateTime.Now - dateTime > TimeSpan.FromSeconds(2) && (DateTime.Now - dateTime < TimeSpan.FromSeconds(20))))
                    {
                        Assert.Fail("Invalid backoff time detected for default retry strategy" + (DateTime.Now - dateTime));
                    }

                    var response = new HttpResponseMessage((HttpStatusCode)200);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    return Task.FromResult(response);
                }
            });

            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityNoMentions.json"));
            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);
            await conClient.Conversations.SendToConversationWithRetriesAsync(sampleActivity);
        }

        /// <summary>
        /// Tests custom retry helper.
        /// </summary>
        /// <returns>Task tracking operation</returns>
        [TestMethod]
        public async Task RetryHelpers_CustomRetryHelper()
        {
            DateTime dateTime = DateTime.MinValue;
            int count = 0;
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                if (count < 3)
                {
                    dateTime = DateTime.Now;
                    count++;
                    var response = new HttpResponseMessage((HttpStatusCode)429);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    var httpException = new Rest.HttpOperationException
                    {
                        Response = new Rest.HttpResponseMessageWrapper(response, "Failed")
                    };
                    throw httpException;
                }
                else
                {
                    if (!(DateTime.Now - dateTime > TimeSpan.FromSeconds(5) && (DateTime.Now - dateTime < TimeSpan.FromSeconds(20))))
                    {
                        Assert.Fail("Invalid backoff time detected for default retry strategy" + (DateTime.Now - dateTime));
                    }

                    var response = new HttpResponseMessage((HttpStatusCode)200);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    return Task.FromResult(response);
                }
            });

            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityNoMentions.json"));
            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);
            conClient.SetRetryPolicy(RetryHelpers.DefaultPolicyBuilder.WaitAndRetryAsync(new[]
            {
                TimeSpan.FromSeconds(1),
                TimeSpan.FromSeconds(2),
                TimeSpan.FromSeconds(6),
                TimeSpan.FromSeconds(10),
                TimeSpan.FromSeconds(20)
            }));
            await conClient.Conversations.SendToConversationWithRetriesAsync(sampleActivity);
        }

        /// <summary>
        /// Test send activity without specifying conversationid.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task RetryHelpers_SendActivityWithRetries()
        {
            int count = 0;
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                if (count < 3)
                {
                    count++;
                    var response = new HttpResponseMessage((HttpStatusCode)429);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    var httpException = new Rest.HttpOperationException
                    {
                        Response = new Rest.HttpResponseMessageWrapper(response, "Failed")
                    };
                    throw httpException;
                }
                else
                {
                    var response = new HttpResponseMessage((HttpStatusCode)200);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    return Task.FromResult(response);
                }
            });

            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityNoMentions.json"));
            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);
            sampleActivity.ReplyToId = "RandomId";
            await conClient.Conversations.ReplyToActivityWithRetriesAsync(sampleActivity);
        }

        /// <summary>
        /// Test send activity with retries.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task RetryHelpers_SendActivityWithCustomConvIdWithRetries()
        {
            int count = 0;
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                if (count < 3)
                {
                    count++;
                    var response = new HttpResponseMessage((HttpStatusCode)429);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    var httpException = new Rest.HttpOperationException
                    {
                        Response = new Rest.HttpResponseMessageWrapper(response, "Failed")
                    };
                    throw httpException;
                }
                else
                {
                    var response = new HttpResponseMessage((HttpStatusCode)200);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    return Task.FromResult(response);
                }
            });

            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityNoMentions.json"));
            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);
            await conClient.Conversations.ReplyToActivityWithRetriesAsync(sampleActivity.Conversation.Id, sampleActivity.Id, sampleActivity);
        }

        /// <summary>
        /// Test send activity without specifying conversationid.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task RetryHelpers_SendToConversationWithRetries()
        {
            int count = 0;
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                if (count < 3)
                {
                    count++;
                    var response = new HttpResponseMessage((HttpStatusCode)429);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    var httpException = new Rest.HttpOperationException
                    {
                        Response = new Rest.HttpResponseMessageWrapper(response, "Failed")
                    };
                    throw httpException;
                }
                else
                {
                    var response = new HttpResponseMessage((HttpStatusCode)200);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    return Task.FromResult(response);
                }
            });

            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityNoMentions.json"));
            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);
            await conClient.Conversations.SendToConversationWithRetriesAsync(sampleActivity);
        }

        /// <summary>
        /// Test send activity with retries.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task RetryHelpers_SendToConversationWithCustomConvIdWithRetries()
        {
            int count = 0;
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                if (count < 3)
                {
                    count++;
                    var response = new HttpResponseMessage((HttpStatusCode)429);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    var httpException = new Rest.HttpOperationException
                    {
                        Response = new Rest.HttpResponseMessageWrapper(response, "Failed")
                    };
                    throw httpException;
                }
                else
                {
                    var response = new HttpResponseMessage((HttpStatusCode)200);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    return Task.FromResult(response);
                }
            });

            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityNoMentions.json"));
            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);
            await conClient.Conversations.SendToConversationWithRetriesAsync(sampleActivity, sampleActivity.Conversation.Id);
        }

        /// <summary>
        /// Test update activity without specifying conversationid.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task RetryHelpers_UpdateActivityWithRetries()
        {
            int count = 0;
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                if (count < 3)
                {
                    count++;
                    var response = new HttpResponseMessage((HttpStatusCode)429);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    var httpException = new Rest.HttpOperationException
                    {
                        Response = new Rest.HttpResponseMessageWrapper(response, "Failed")
                    };
                    throw httpException;
                }
                else
                {
                    var response = new HttpResponseMessage((HttpStatusCode)200);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    return Task.FromResult(response);
                }
            });

            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityNoMentions.json"));
            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);
            await conClient.Conversations.UpdateActivityWithRetriesAsync(sampleActivity);
        }

        /// <summary>
        /// Test update activity with retries.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task RetryHelpers_UpdateActivityWithCustomConvIdWithRetries()
        {
            int count = 0;
            TestDelegatingHandler testDelegatingHandler = new TestDelegatingHandler((request) =>
            {
                if (count < 3)
                {
                    count++;
                    var response = new HttpResponseMessage((HttpStatusCode)429);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    var httpException = new Rest.HttpOperationException
                    {
                        Response = new Rest.HttpResponseMessageWrapper(response, "Failed")
                    };
                    throw httpException;
                }
                else
                {
                    var response = new HttpResponseMessage((HttpStatusCode)200);
                    response.Content = new StringContent(JsonConvert.SerializeObject(new ResourceResponse("ID")));
                    return Task.FromResult(response);
                }
            });

            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityNoMentions.json"));
            ConnectorClient conClient = new ConnectorClient(new Uri("https://testservice.com"), "Test", "Test", testDelegatingHandler);
            await conClient.Conversations.UpdateActivityWithRetriesAsync(sampleActivity.Conversation.Id, sampleActivity.Id, sampleActivity);
        }
    }
}
