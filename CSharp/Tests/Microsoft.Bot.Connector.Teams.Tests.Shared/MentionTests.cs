namespace Microsoft.Bot.Connector.Teams.Tests
{
    using System;
    using System.IO;
    using Microsoft.VisualStudio.TestTools.UnitTesting;
    using Newtonsoft.Json;
    using Rest;

    /// <summary>
    /// @Mention tests.
    /// </summary>
    [TestClass]
    public class MentionTests
    {
        /// <summary>
        /// @Mention tests with no mention text.
        /// </summary>
        [TestMethod]
        public void AddMention_NoMentionText()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            Activity reply = sampleActivity.CreateReply().AddMentionToText(sampleActivity.From, MentionTextLocation.AppendText);

            Assert.IsTrue(reply.Entities.Count == 1);
            Assert.IsInstanceOfType(reply.Entities[0], typeof(Mention));
            Assert.IsTrue(reply.Text.Contains((reply.Entities[0] as Mention).Text));
            Assert.IsTrue((reply.Entities[0] as Mention).Text.Contains("<at>"));
            Assert.IsTrue((reply.Entities[0] as Mention).Text.EndsWith("</at>"));
        }

        /// <summary>
        /// @Mention tests with mention text.
        /// </summary>
        [TestMethod]
        public void AddMention_WithMentionText()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            Activity reply = sampleActivity.CreateReply().AddMentionToText(sampleActivity.From, MentionTextLocation.PrependText, "SampleName");

            Assert.IsTrue(reply.Entities.Count == 1);
            Assert.IsInstanceOfType(reply.Entities[0], typeof(Mention));
            Assert.IsTrue(reply.Text.Contains((reply.Entities[0] as Mention).Text));
            Assert.IsTrue((reply.Entities[0] as Mention).Text.Contains("SampleName"));
            Assert.IsTrue((reply.Entities[0] as Mention).Text.StartsWith("<at>"));
        }

        /// <summary>
        /// @Mention tests with no mention text and no username. Expects exception.
        /// </summary>
        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void AddMention_WithNoMentionTextAndNoChannelAccountName()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            Activity reply = sampleActivity.CreateReply().AddMentionToText(
                new ChannelAccount
                {
                    Id = sampleActivity.From.Id
                },
                MentionTextLocation.PrependText);
        }

        /// <summary>
        /// @Mention tests with entities instantiated to null (new Activity case).
        /// </summary>
        [TestMethod]
        public void AddMention_WithEntitiesAsNull()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityAtMention.json"));
            Activity reply = sampleActivity.CreateReply();
            reply.Entities = null;
            reply = reply.AddMentionToText(sampleActivity.From, MentionTextLocation.PrependText);
            Assert.IsTrue(reply.Entities.Count == 1);
            Assert.IsInstanceOfType(reply.Entities[0], typeof(Mention));
            Assert.IsTrue(reply.Text.Contains((reply.Entities[0] as Mention).Text));
        }

        /// <summary>
        /// Activity extensions tests for strip mentions with mentions in it.
        /// </summary>
        [TestMethod]
        public void RemoveMentions_StripMentionsWithMentionsInIt()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivity2AtMentions.json"));
            string noMentionText = sampleActivity.GetTextWithoutMentions();
            Assert.IsTrue(sampleActivity.Text.Contains(noMentionText));
            Assert.AreEqual("TestMessage", noMentionText);
        }

        /// <summary>
        /// Test to removes mentions from activity with no mentions.
        /// </summary>
        [TestMethod]
        public void RemoveMentions_StripMentionsWithNoMentions()
        {
            Activity sampleActivity = JsonConvert.DeserializeObject<Activity>(File.ReadAllText(@"Jsons\SampleActivityNoMentions.json"));
            string noMentionText = sampleActivity.GetTextWithoutMentions();
            Assert.IsTrue(sampleActivity.Text.Contains(noMentionText));
            Assert.AreEqual(sampleActivity.Text, noMentionText);
        }
    }
}
