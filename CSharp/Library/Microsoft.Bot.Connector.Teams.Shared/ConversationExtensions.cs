

// 
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
// 
// Microsoft Teams: https://dev.office.com/microsoft-teams
// 
// Bot Builder Microsoft Teams SDK GitHub
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
//

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
