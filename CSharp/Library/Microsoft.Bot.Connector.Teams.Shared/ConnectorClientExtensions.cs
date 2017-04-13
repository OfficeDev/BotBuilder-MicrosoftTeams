namespace Microsoft.Bot.Connector
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Teams;
    using Teams.Models;

    /// <summary>
    /// Connector client extensions.
    /// </summary>
    public static class ConnectorClientExtensions
    {
        /// <summary>
        /// Gets the teams connector client.
        /// </summary>
        /// <param name="connectorClient">The connector client.</param>
        /// <returns>Teams connector client.</returns>
        public static TeamsConnectorClient GetTeamsConnectorClient(this IConnectorClient connectorClient)
        {
            return TeamsConnectorClient.Initialize(connectorClient);
        }

        /// <summary>
        /// Creates or gets direct conversation between a bot and user.
        /// </summary>
        /// <param name="conversationClient">Conversation client instance.</param>
        /// <param name="bot">Bot account.</param>
        /// <param name="user">User to create conversation with.</param>
        /// <param name="tenantId">TenantId of the user.</param>
        /// <returns>Conversation creation or get response.</returns>
        public static ConversationResourceResponse CreateOrGetDirectConversation(
            this IConversations conversationClient,
            ChannelAccount bot,
            ChannelAccount user,
            string tenantId)
        {
            return conversationClient.CreateConversation(new ConversationParameters()
            {
                Bot = bot,
                ChannelData = JObject.FromObject(
                    new TeamsChannelData
                    {
                        Tenant = new TenantInfo
                        {
                            Id = tenantId
                        }
                    },
                    JsonSerializer.Create(new JsonSerializerSettings()
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    })),
                Members = new List<ChannelAccount>() { user }
            });
        }
    }
}
