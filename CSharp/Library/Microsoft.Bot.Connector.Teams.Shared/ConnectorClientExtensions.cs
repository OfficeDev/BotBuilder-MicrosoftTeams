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
