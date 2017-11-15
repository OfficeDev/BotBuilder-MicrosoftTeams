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
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Bot.Connector.Teams.Models;
    using Microsoft.Rest;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;

    /// <summary>
    /// Fetch team details tests.
    /// </summary>
    public partial class TeamsAPITests
    {
        /// <summary>
        /// Teams API test for fetching team details.
        /// </summary>
        [TestMethod]
        public void TeamsAPI_FetchTeamDetails()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            TeamDetails teamDetails = new TeamDetails
            {
                Id = "TeamId",
                AadGroupId = "GroupId",
                Name = "TeamName"
            };

            TestDelegatingHandler testHandler = new TestDelegatingHandler((request) =>
            {
                StringContent stringContent = new StringContent(JsonConvert.SerializeObject(teamDetails));
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = stringContent;
                return Task.FromResult(response);
            });

            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"],
                testHandler);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();

            TeamDetails teamDetailsResult = teamsConnectorClient.Teams.FetchTeamDetails("TestTeamId");

            Assert.IsNotNull(teamDetailsResult);
            Assert.IsNotNull(teamDetailsResult.Id);
            Assert.IsNotNull(teamDetailsResult.Name);
            Assert.IsNotNull(teamDetailsResult.AadGroupId);
            Assert.AreEqual(teamDetailsResult.Id, teamDetails.Id);
            Assert.AreEqual(teamDetailsResult.Name, teamDetails.Name);
            Assert.AreEqual(teamDetailsResult.AadGroupId, teamDetails.AadGroupId);
        }

        /// <summary>
        /// Teams API test for fetching team details async.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task TeamsAPI_FetchTeamDetailsAsyncTest()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            TeamDetails teamDetails = new TeamDetails("TeamId", "TeamName", "GroupId");

            TestDelegatingHandler testHandler = new TestDelegatingHandler((request) =>
            {
                StringContent stringContent = new StringContent(JsonConvert.SerializeObject(teamDetails));
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = stringContent;
                return Task.FromResult(response);
            });

            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"],
                testHandler);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();

            TeamDetails teamDetailsResult = await teamsConnectorClient.Teams.FetchTeamDetailsAsync("TestTeamId");

            Assert.IsNotNull(teamDetailsResult);
            Assert.IsNotNull(teamDetailsResult.Id);
            Assert.IsNotNull(teamDetailsResult.Name);
            Assert.IsNotNull(teamDetailsResult.AadGroupId);
            Assert.AreEqual(teamDetailsResult.Id, teamDetails.Id);
            Assert.AreEqual(teamDetailsResult.Name, teamDetails.Name);
            Assert.AreEqual(teamDetailsResult.AadGroupId, teamDetails.AadGroupId);
        }

        /// <summary>
        /// Teams API test for fetching team details with advanced options.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task TeamsAPI_FetchTeamDetailsAsyncWithHttpMessagesTest()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            TeamDetails teamDetails = new TeamDetails
            {
                Id = "TeamId",
                AadGroupId = "GroupId",
                Name = "TeamName"
            };

            TestDelegatingHandler testHandler = new TestDelegatingHandler((request) =>
            {
                StringContent stringContent = new StringContent(JsonConvert.SerializeObject(teamDetails));
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = stringContent;
                Assert.IsNotNull(request.Headers.GetValues("Authorization"));
                Assert.AreEqual(request.Headers.GetValues("Authorization").Count(), 1);
                Assert.AreEqual(request.Headers.GetValues("Authorization").ToList()[0], "CustomValue");
                return Task.FromResult(response);
            });

            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"],
                testHandler);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();

            TeamDetails teamDetailsResult = (await teamsConnectorClient.Teams.FetchTeamDetailsWithHttpMessagesAsync(
                    "TestTeamId",
                    new Dictionary<string, List<string>>() { { "Authorization", new List<string>() { "CustomValue" } } })).Body;

            Assert.IsNotNull(teamDetailsResult);
            Assert.IsNotNull(teamDetailsResult.Id);
            Assert.IsNotNull(teamDetailsResult.Name);
            Assert.IsNotNull(teamDetailsResult.AadGroupId);
            Assert.AreEqual(teamDetailsResult.Id, teamDetails.Id);
            Assert.AreEqual(teamDetailsResult.Name, teamDetails.Name);
            Assert.AreEqual(teamDetailsResult.AadGroupId, teamDetails.AadGroupId);
        }

        /// <summary>
        /// Teams API test for fetch team details with invalid http code in response.
        /// </summary>
        [ExpectedException(typeof(HttpOperationException))]
        [TestMethod]
        public void TeamsAPI_FetchTeamDetailsTestInvalidHttpCode()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            TestDelegatingHandler testHandler = new TestDelegatingHandler((request) =>
            {
                StringContent stringContent = new StringContent("RandomRandomRandom");
                var response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
                response.Content = stringContent;
                return Task.FromResult(response);
            });

            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"],
                testHandler);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();
            teamsConnectorClient.Teams.FetchTeamDetails("TestTeamId");
        }

        /// <summary>
        /// Teams API test for fetch team details with invalid http code and no response body.
        /// </summary>
        [ExpectedException(typeof(HttpOperationException))]
        [TestMethod]
        public void TeamsAPI_FetchTeamDetailsTestInvalidHttpCodeWithoutResponseContent()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            TestDelegatingHandler testHandler = new TestDelegatingHandler((request) =>
            {
                var response = new HttpResponseMessage(HttpStatusCode.NotFound);
                return Task.FromResult(response);
            });

            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"],
                testHandler);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();
            teamsConnectorClient.Teams.FetchTeamDetails("TestTeamId");
        }

        /// <summary>
        /// Teams API test for fetch team details with invalid http code in response and response body.
        /// </summary>
        [ExpectedException(typeof(SerializationException))]
        [TestMethod]
        public void TeamsAPI_FetchTeamDetailsTestInvalidResonse()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            TestDelegatingHandler testHandler = new TestDelegatingHandler((request) =>
            {
                StringContent stringContent = new StringContent("RandomRandomRandom");
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = stringContent;
                return Task.FromResult(response);
            });

            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"],
                testHandler);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();
            teamsConnectorClient.Teams.FetchTeamDetails("TestTeamId");
        }

        /// <summary>
        /// Teams API test for fetch team details with invalid team Id.
        /// </summary>
        [ExpectedException(typeof(ValidationException))]
        [TestMethod]
        public void TeamsAPI_FetchTeamDetailsTestInvalidTeamId()
        {
            Microsoft.Rest.ServiceClientTracing.IsEnabled = true;
            TestDelegatingHandler testHandler = new TestDelegatingHandler((request) =>
            {
                StringContent stringContent = new StringContent("RandomRandomRandom");
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = stringContent;
                return Task.FromResult(response);
            });

            ConnectorClient connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                ConfigurationManager.AppSettings["MicrosoftAppId"],
                ConfigurationManager.AppSettings["MicrosoftAppPassword"],
                testHandler);

            TeamsConnectorClient teamsConnectorClient = connectorClient.GetTeamsConnectorClient();
            teamsConnectorClient.Teams.FetchTeamDetails(null);
        }
    }
}
