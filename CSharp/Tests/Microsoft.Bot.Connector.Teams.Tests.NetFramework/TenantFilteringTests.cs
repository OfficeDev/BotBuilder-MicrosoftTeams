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
