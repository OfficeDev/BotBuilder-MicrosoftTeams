namespace Microsoft.Bot.Connector.Teams.Tests
{
    using System;
    using System.IO;
    using Models;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using VisualStudio.TestTools.UnitTesting;

    /// <summary>
    /// Teams channel data tests.
    /// </summary>
    [TestClass]
    public class ChannelDataTests
    {
        /// <summary>
        /// Channel data test to get general channel.
        /// </summary>
        [TestMethod]
        public void ChannelData_GetGeneralChannel()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            ChannelInfo generalChannel = sampleActivity.GetGeneralChannel();

            TeamsChannelData channelData = sampleActivity.GetChannelData<TeamsChannelData>();

            Assert.IsNotNull(generalChannel);
            Assert.IsNotNull(generalChannel.Id);
            Assert.IsTrue(generalChannel.Id == channelData.Team.Id);
        }

        /// <summary>
        /// Channel data test to get general channel while channel data is missing.
        /// </summary>
        [ExpectedException(typeof(ArgumentException))]
        [TestMethod]
        public void ChannelData_GetGeneralChannelNoChannelData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            sampleActivity.ChannelData = null;
            sampleActivity.GetGeneralChannel();
        }

        /// <summary>
        /// Channel data test to get general channel with invalid channel data.
        /// </summary>
        [ExpectedException(typeof(ArgumentException))]
        [TestMethod]
        public void ChannelData_GetGeneralChannelInvalidChannelData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            var channelData = JsonConvert.DeserializeObject<TeamsChannelData>(sampleActivity.ChannelData.ToString());
            channelData.Team = null;
            sampleActivity.ChannelData = JObject.FromObject(channelData);
            sampleActivity.GetGeneralChannel();
        }

        /// <summary>
        /// Channel data test to check properties.
        /// </summary>
        [TestMethod]
        public void ChannelData_PropertyCheck()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            var channelData = JsonConvert.DeserializeObject<TeamsChannelData>(sampleActivity.ChannelData.ToString());
            Assert.IsNotNull(channelData);
            Assert.IsNotNull(channelData.Channel);
            Assert.IsNotNull(channelData.Channel.Id);
            Assert.IsNotNull(channelData.Team);
            Assert.IsNotNull(channelData.Team.Id);
            Assert.IsNotNull(channelData.Tenant);
            Assert.IsNotNull(channelData.Tenant.Id);
        }

        /// <summary>
        /// Channel data test to get tenant Id.
        /// </summary>
        [TestMethod]
        public void ChannelData_GetTenantId()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));

            Assert.IsNotNull(sampleActivity.GetTenantId());
            Assert.AreEqual(sampleActivity.GetTenantId(), "3b9e9fbb-ed2f-415b-b776-cf788e573366");
        }

        /// <summary>
        /// Channel data test to get tenant Id with missing channel data.
        /// </summary>
        [ExpectedException(typeof(ArgumentNullException))]
        [TestMethod]
        public void ChannelData_GetTenantIdMissingChannelData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            sampleActivity.ChannelData = null;
            sampleActivity.GetTenantId();
        }

        /// <summary>
        /// Channel data test to get tenant Id with missing tenant Id.
        /// </summary>
        [ExpectedException(typeof(ArgumentException))]
        [TestMethod]
        public void ChannelData_GetTenantIdMissingTenantData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            var channelData = JsonConvert.DeserializeObject<TeamsChannelData>(sampleActivity.ChannelData.ToString());
            channelData.Tenant = null;
            sampleActivity.ChannelData = JObject.FromObject(channelData);
            sampleActivity.GetTenantId();
        }
    }
}
