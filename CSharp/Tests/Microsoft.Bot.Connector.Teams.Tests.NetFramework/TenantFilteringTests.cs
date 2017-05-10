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
    using System.IO;
    using System.Threading.Tasks;
    using System.Web.Http.Controllers;
    using Models;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Teams;
    using VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Tenant filtering tests.
    /// </summary>
    [TestClass]
    public class TenantFilteringTests
    {
        /// <summary>
        /// Tenant filtering test with non-allowed tenant Id.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task NetFramework_TenantFiltering_WrongTenantId()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));

            HttpActionContext actionContext = new HttpActionContext();
            actionContext.ActionArguments.Add("Activity", sampleActivity);

            TenantFilterAttribute attribute = new TenantFilterAttribute();

            await attribute.OnActionExecutingAsync(actionContext, new System.Threading.CancellationToken());

            Assert.IsNotNull(actionContext.Response);
            Assert.AreEqual(actionContext.Response.StatusCode, System.Net.HttpStatusCode.Forbidden);
        }

        /// <summary>
        /// Tenant filtering test with no channel data.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task NetFramework_TenantFiltering_NoChannelData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            sampleActivity.ChannelData = null;
            HttpActionContext actionContext = new HttpActionContext();
            actionContext.ActionArguments.Add("Activity", sampleActivity);

            TenantFilterAttribute attribute = new TenantFilterAttribute();

            await attribute.OnActionExecutingAsync(actionContext, new System.Threading.CancellationToken());

            Assert.IsNotNull(actionContext.Response);
            Assert.AreEqual(actionContext.Response.StatusCode, System.Net.HttpStatusCode.Forbidden);
        }

        /// <summary>
        /// Tenant filtering test with invalid channel data.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task NetFramework_TenantFiltering_InvalidChannelData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            sampleActivity.ChannelData = "{ \"Sample\" : \"test\" }";
            HttpActionContext actionContext = new HttpActionContext();
            actionContext.ActionArguments.Add("Activity", sampleActivity);

            TenantFilterAttribute attribute = new TenantFilterAttribute();

            await attribute.OnActionExecutingAsync(actionContext, new System.Threading.CancellationToken());

            Assert.IsNotNull(actionContext.Response);
            Assert.AreEqual(actionContext.Response.StatusCode, System.Net.HttpStatusCode.Forbidden);
        }

        /// <summary>
        /// Tenant filtering test with missing tenant data.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task NetFramework_TenantFiltering_MissingTenantData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            var channelData = JsonConvert.DeserializeObject<TeamsChannelData>(sampleActivity.ChannelData.ToString());
            channelData.Tenant = null;
            sampleActivity.ChannelData = JObject.FromObject(channelData);
            HttpActionContext actionContext = new HttpActionContext();
            actionContext.ActionArguments.Add("Activity", JObject.FromObject(sampleActivity));

            TenantFilterAttribute attribute = new TenantFilterAttribute();

            await attribute.OnActionExecutingAsync(actionContext, new System.Threading.CancellationToken());

            Assert.IsNotNull(actionContext.Response);
            Assert.AreEqual(actionContext.Response.StatusCode, System.Net.HttpStatusCode.Forbidden);
        }

        /// <summary>
        /// Tenant filtering test with allowed tenant Id.
        /// </summary>
        /// <returns>Task tracking operation.</returns>
        [TestMethod]
        public async Task NetFramework_TenantFiltering_AllowedTenantData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            var channelData = JsonConvert.DeserializeObject<TeamsChannelData>(sampleActivity.ChannelData.ToString());
            channelData.Tenant.Id = "a4183ce3-c577-4941-98f4-0787475fc266";
            sampleActivity.ChannelData = JObject.FromObject(channelData);
            HttpActionContext actionContext = new HttpActionContext();
            actionContext.ActionArguments.Add("Activity", sampleActivity);

            TenantFilterAttribute attribute = new TenantFilterAttribute();

            await attribute.OnActionExecutingAsync(actionContext, new System.Threading.CancellationToken());

            Assert.IsNull(actionContext.Response);
        }
    }
}
