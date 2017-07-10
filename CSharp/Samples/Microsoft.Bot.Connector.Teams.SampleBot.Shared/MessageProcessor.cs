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

namespace Microsoft.Bot.Connector.Teams.SampleBot.Shared
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Bot.Connector.Teams.Models;
    using Newtonsoft.Json;

    /// <summary>
    /// Common code for handling Bot Framework messages.
    /// </summary>
    public class MessageProcessor
    {
        /// <summary>
        /// Handles incoming Bot Framework messages.
        /// </summary>
        /// <param name="activity">Incoming request from Bot Framework.</param>
        /// <param name="connectorClient">Connector client instance for posting to Bot Framework.</param>
        /// <returns>HTTP response message.</returns>
        public static async Task<HttpResponseMessage> HandleIncomingRequest(Activity activity, ConnectorClient connectorClient)
        {
            switch (activity.GetActivityType())
            {
                case ActivityTypes.Message:
                    await HandleTextMessages(activity, connectorClient);
                    break;

                case ActivityTypes.ConversationUpdate:
                    await HandleConversationUpdates(activity, connectorClient);
                    break;

                case ActivityTypes.Invoke:
                    return await HandleInvoke(activity, connectorClient);

                case ActivityTypes.ContactRelationUpdate:
                case ActivityTypes.Typing:
                case ActivityTypes.DeleteUserData:
                case ActivityTypes.Ping:
                default:
                    break;
            }

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        /// <summary>
        /// Handles text message input sent by user.
        /// </summary>
        /// <param name="activity">Incoming request from Bot Framework.</param>
        /// <param name="connectorClient">Connector client instance for posting to Bot Framework.</param>
        /// <returns>Task tracking operation.</returns>
        private static async Task HandleTextMessages(Activity activity, ConnectorClient connectorClient)
        {
            if (activity.Text.Contains("GetChannels"))
            {
                Activity replyActivity = activity.CreateReply();
                replyActivity.AddMentionToText(activity.From, MentionTextLocation.PrependText);

                ConversationList channels = connectorClient.GetTeamsConnectorClient().Teams.FetchChannelList(activity.GetChannelData<TeamsChannelData>().Team.Id);

                // Adding to existing text to ensure @Mention text is not replaced.
                replyActivity.Text = replyActivity.Text + " <p>" + string.Join("</p><p>", channels.Conversations.ToList().Select(info => info.Name + " --> " + info.Id));
                await connectorClient.Conversations.ReplyToActivityWithRetriesAsync(replyActivity);
            }
            else if (activity.Text.Contains("GetTenantId"))
            {
                Activity replyActivity = activity.CreateReply();
                replyActivity = replyActivity.AddMentionToText(activity.From, MentionTextLocation.PrependText);

                if (!activity.Conversation.IsGroup.GetValueOrDefault())
                {
                    replyActivity = replyActivity.NotifyUser();
                }

                replyActivity.Text += " Tenant ID - " + activity.GetTenantId();
                await connectorClient.Conversations.ReplyToActivityWithRetriesAsync(replyActivity);
            }
            else if (activity.Text.Contains("Create1on1"))
            {
                var response = connectorClient.Conversations.CreateOrGetDirectConversation(activity.Recipient, activity.From, activity.GetTenantId());
                Activity newActivity = new Activity()
                {
                    Text = "Hello",
                    Type = ActivityTypes.Message,
                    Conversation = new ConversationAccount
                    {
                        Id = response.Id
                    },
                };

                await connectorClient.Conversations.SendToConversationAsync(newActivity, response.Id);
            }
            else if (activity.Text.Contains("GetMembers"))
            {
                var response = (await connectorClient.Conversations.GetConversationMembersAsync(activity.Conversation.Id)).AsTeamsChannelAccounts();
                StringBuilder stringBuilder = new StringBuilder();
                Activity replyActivity = activity.CreateReply();
                replyActivity.Text = string.Join("</p><p>", response.ToList().Select(info => info.GivenName + " " + info.Surname + " --> " + info.ObjectId));
                await connectorClient.Conversations.ReplyToActivityWithRetriesAsync(replyActivity);
            }
            else if (activity.Text.Contains("TestRetry"))
            {
                for (int i = 0; i < 15; i++)
                {
                    Activity replyActivity = activity.CreateReply();
                    replyActivity.Text = "Message Count " + i;
                    await connectorClient.Conversations.ReplyToActivityWithRetriesAsync(replyActivity);
                }
            }
            else
            {
                var accountList = connectorClient.Conversations.GetConversationMembers(activity.Conversation.Id);

                Activity replyActivity = activity.CreateReply();
                replyActivity.Text = "Help " +
                    "<p>Type GetChannels to get List of Channels. </p>" +
                    "<p>Type GetTenantId to get Tenant Id </p>" +
                    "<p>Type Create1on1 to create one on one conversation. </p>" +
                    "<p>Type GetMembers to get list of members in a conversation (team or direct conversation). </p>" +
                    "<p>Type TestRetry to get multiple messages from Bot in throttled and retried mechanism. </p>";
                replyActivity = replyActivity.AddMentionToText(activity.From);
                await connectorClient.Conversations.ReplyToActivityWithRetriesAsync(replyActivity);
            }
        }

        /// <summary>
        /// Handles conversational updates.
        /// </summary>
        /// <param name="activity">Incoming request from Bot Framework.</param>
        /// <param name="connectorClient">Connector client instance for posting to Bot Framework.</param>
        /// <returns>Task tracking operation.</returns>
        private static async Task HandleConversationUpdates(Activity activity, ConnectorClient connectorClient)
        {
            TeamEventBase eventData = activity.GetConversationUpdateData();

            switch (eventData.EventType)
            {
                case TeamEventType.ChannelCreated:
                    {
                        ChannelCreatedEvent channelCreatedEvent = eventData as ChannelCreatedEvent;

                        Activity newActivity = new Activity
                        {
                            Type = ActivityTypes.Message,
                            ChannelId = "msteams",
                            ServiceUrl = activity.ServiceUrl,
                            From = activity.Recipient,
                            Text = channelCreatedEvent.Channel.Name + " Channel creation complete",
                            ChannelData = new TeamsChannelData
                            {
                                Channel = channelCreatedEvent.Channel,
                                Team = channelCreatedEvent.Team,
                                Tenant = channelCreatedEvent.Tenant
                            },
                        };

                        await connectorClient.Conversations.SendToConversationWithRetriesAsync(newActivity, channelCreatedEvent.Channel.Id);
                        break;
                    }

                case TeamEventType.ChannelDeleted:
                    {
                        ChannelDeletedEvent channelDeletedEvent = eventData as ChannelDeletedEvent;

                        Activity newActivity = activity.CreateReplyToGeneralChannel(channelDeletedEvent.Channel.Name + " Channel deletion complete");

                        await connectorClient.Conversations.SendToConversationWithRetriesAsync(newActivity, activity.GetGeneralChannel().Id);
                        break;
                    }

                case TeamEventType.MembersAdded:
                    {
                        MembersAddedEvent memberAddedEvent = eventData as MembersAddedEvent;

                        Activity newActivity = activity.CreateReplyToGeneralChannel("Members added to team.");

                        await connectorClient.Conversations.SendToConversationWithRetriesAsync(newActivity, activity.GetGeneralChannel().Id);
                        break;
                    }

                case TeamEventType.MembersRemoved:
                    {
                        MembersRemovedEvent memberRemovedEvent = eventData as MembersRemovedEvent;

                        Activity newActivity = activity.CreateReplyToGeneralChannel("Members removed from the team.");

                        await connectorClient.Conversations.SendToConversationWithRetriesAsync(newActivity, activity.GetGeneralChannel().Id);
                        break;
                    }
            }
        }

        /// <summary>
        /// Handles invoke messages.
        /// </summary>
        /// <param name="activity">Incoming request from Bot Framework.</param>
        /// <param name="connectorClient">Connector client instance for posting to Bot Framework.</param>
        /// <returns>Task tracking operation.</returns>
        private static async Task<HttpResponseMessage> HandleInvoke(Activity activity, ConnectorClient connectorClient)
        {
            // Check if the Activity if of type compose extension.
            if (activity.IsComposeExtensionQuery())
            {
                return await HandleComposeExtensionQuery(activity, connectorClient);
            }
            else
            {
                return new HttpResponseMessage(HttpStatusCode.OK);
            }
        }

        /// <summary>
        /// Handles compose extension queries.
        /// </summary>
        /// <param name="activity">Incoming request from Bot Framework.</param>
        /// <param name="connectorClient">Connector client instance for posting to Bot Framework.</param>
        /// <returns>Task tracking operation.</returns>
        private static async Task<HttpResponseMessage> HandleComposeExtensionQuery(Activity activity, ConnectorClient connectorClient)
        {
            // Get Compose extension query data.
            ComposeExtensionQuery composeExtensionQuery = activity.GetComposeExtensionQueryData();

            // Process data and return the response.
            ComposeExtensionResponse response = new ComposeExtensionResponse
            {
                ComposeExtension = new ComposeExtensionResult
                {
                    Attachments = new List<ComposeExtensionAttachment>
                    {
                        new HeroCard
                        {
                            Buttons = new List<CardAction>
                            {
                                new CardAction
                                {
                                        Image = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Bing_logo_%282016%29.svg/160px-Bing_logo_%282016%29.svg.png",
                                        Type = ActionTypes.OpenUrl,
                                        Title = "Bing",
                                        Value = "https://www.bing.com"
                                },
                            },
                            Title = "SampleHeroCard",
                            Subtitle = "BingHeroCard",
                            Text = "Bing.com"
                        }.ToAttachment().ToComposeExtensionAttachment()
                    },
                    Type = "result",
                    AttachmentLayout = "list"
                }
            };

            StringContent stringContent = new StringContent(JsonConvert.SerializeObject(response));
            HttpResponseMessage httpResponseMessage = new HttpResponseMessage(HttpStatusCode.OK);
            httpResponseMessage.Content = stringContent;
            return httpResponseMessage;
        }
    }
}
