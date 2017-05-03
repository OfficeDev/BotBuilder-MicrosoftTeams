namespace Microsoft.Bot.Connector.Teams.Tests.Shared
{
    using System.IO;
    using Microsoft.Bot.Connector.Teams.Models;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;

    /// <summary>
    /// Compose extension tests.
    /// </summary>
    [TestClass]
    public class ComposeExtensionTests
    {
        /// <summary>
        /// Tests IsComposeExtension logic by providing a valid compose extension file.
        /// </summary>
        [TestMethod]
        public void ComposeExtension_IsComposeExtensionValidComposeExtension()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityComposeExtension.json"));
            Assert.IsTrue(sampleActivity.IsComposeExtensionQuery());
        }

        /// <summary>
        /// Tests IsComposeExtension logic by providing an invalid compose extension file.
        /// </summary>
        [TestMethod]
        public void ComposeExtension_IsComposeExtensionInvalidComposeExtension()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityInvoke.json"));
            Assert.IsFalse(sampleActivity.IsComposeExtensionQuery());
        }

        /// <summary>
        /// Tests get compose extension data logic.
        /// </summary>
        [TestMethod]
        public void ComposeExtension_GetComposeExtensionData()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityComposeExtension.json"));
            ComposeExtensionQuery query = sampleActivity.GetComposeExtensionQueryData();
            Assert.AreEqual("testQuery", query.CommandId);
            Assert.IsTrue(query.Parameters != null && query.Parameters.Count == 1);
            Assert.AreEqual("selectedQueryJson", query.Parameters[0].Name);
            Assert.AreEqual("Value", query.Parameters[0].Value.ToString());
        }
    }
}
