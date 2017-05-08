namespace Microsoft.Bot.Connector.Teams
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Bot.Connector.Teams.Models;
    using Microsoft.Rest;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Extension methods for existing IConversation operations.
    /// </summary>
    public static class ConversationExtensions
    {
        /// <summary>
        /// Gets teams conversation members asynchronously.
        /// </summary>
        /// <param name="conversations">Conversation instance.</param>
        /// <param name="conversationId">Conversation Id.</param>
        /// <param name="tenantId">Tenant Id for the conversation.</param>
        /// <returns>List of members who are part of conversation.</returns>
        public static async Task<TeamsChannelAccount[]> GetTeamsConversationMembersAsync(this IConversations conversations, string conversationId, string tenantId)
        {
            Guid throwawayGuid;
            if (!Guid.TryParse(tenantId, out throwawayGuid))
            {
                throw new ArgumentException("TenantId should be parseable as a Guid", nameof(tenantId));
            }

            Dictionary<string, List<string>> customHeaders = new Dictionary<string, List<string>>();
            customHeaders.Add("X-MsTeamsTenantId", new List<string>() { tenantId });
            using (var memberList = await conversations.GetConversationMembersWithHttpMessagesAsync(conversationId, customHeaders).ConfigureAwait(false))
            {
                var members = await memberList.HandleErrorAsync<ChannelAccount[]>().ConfigureAwait(false);
                return members.Select(member => member.AsTeamsChannelAccount()).ToArray();
            }
        }

        /// <summary>
        /// Gets teams channel account data.
        /// </summary>
        /// <param name="channelAccount">Channel account instance.</param>
        /// <returns>Teams channel account data.</returns>
        public static TeamsChannelAccount AsTeamsChannelAccount(this ChannelAccount channelAccount)
        {
            return JObject.FromObject(channelAccount).ToObject<TeamsChannelAccount>();
        }
    }
}
