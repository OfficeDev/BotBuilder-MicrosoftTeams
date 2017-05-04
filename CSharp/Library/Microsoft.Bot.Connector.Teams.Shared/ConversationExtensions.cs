namespace Microsoft.Bot.Connector.Teams
{
    using System;
    using System.Collections.Generic;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Rest;

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
        public static async Task<ChannelAccount[]> GetTeamsConversationMembersAsync(this IConversations conversations, string conversationId, string tenantId)
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
                return await memberList.HandleErrorAsync<ChannelAccount[]>().ConfigureAwait(false);
            }
        }
    }
}
