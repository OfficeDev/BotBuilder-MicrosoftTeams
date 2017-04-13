namespace Microsoft.Bot.Connector.Teams.SampleBot.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using System.Diagnostics;
    using System.Linq;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Description;
    using Autofac;
    using Builder.Dialogs;
    using Builder.Dialogs.Internals;
    using Models;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Main messaging controller.
    /// </summary>
    /// <seealso cref="ApiController" />
    [BotAuthentication]
    [TenantFilter]
    public class MessagesController : ApiController
    {
        /// <summary>
        /// POST: api/Messages
        /// receive a message from a user and send replies
        /// </summary>
        /// <param name="activity">BF Activity.</param>
        /// <returns>HTTP response.</returns>
        [ResponseType(typeof(void))]
        public virtual async Task<HttpResponseMessage> Post([FromBody] Activity activity)
        {
            var client = new ConnectorClient(
                new Uri(activity.ServiceUrl),
                ConfigurationManager.AppSettings[MicrosoftAppCredentials.MicrosoftAppIdKey],
                ConfigurationManager.AppSettings[MicrosoftAppCredentials.MicrosoftAppPasswordKey]);

            switch (activity.GetActivityType())
            {
                case ActivityTypes.Message:
                    if (activity.Text.Contains("GetChannels"))
                    {
                        Activity replyActivity = activity.CreateReply();
                        replyActivity.AddMentionToText(activity.From, MentionTextLocation.PrependText);

                        ConversationList channels = client.GetTeamsConnectorClient().Teams.FetchChannelList(activity.GetChannelData<TeamsChannelData>().Team.Id);

                        // Adding to existing text to ensure @Mention text is not replaced.
                        replyActivity.Text = replyActivity.Text + " <p>" + string.Join("</p><p>", channels.Conversations.ToList().Select(info => info.Name + " --> " + info.Id));
                        await client.Conversations.ReplyToActivityAsync(replyActivity);
                    }
                    else if (activity.Text.Contains("GetTenantId"))
                    {
                        Activity replyActivity = activity.CreateReply();
                        replyActivity.AddMentionToText(activity.From, MentionTextLocation.PrependText);
                        replyActivity.Text += " Tenant ID - " + activity.GetTenantId();
                        await client.Conversations.ReplyToActivityAsync(replyActivity);
                    }
                    else if (activity.Text.Contains("Create1on1"))
                    {
                        var response = client.Conversations.CreateOrGetDirectConversation(activity.Recipient, activity.From, activity.GetTenantId());
                        Activity newActivity = new Activity()
                        {
                            Text = "Hello",
                            Type = ActivityTypes.Message,
                            Conversation = new ConversationAccount
                            {
                                Id = response.Id
                            },
                        };

                        await client.Conversations.SendToConversationAsync(newActivity, response.Id);
                    }
                    else
                    {
                        var accountList = client.Conversations.GetConversationMembers(activity.Conversation.Id);

                        Activity replyActivity = activity.CreateReply();
                        replyActivity.Text = "Help " +
                            "<p>Type GetChannels to get List of Channels. </p>" +
                            "<p>Type GetTenantId to get Tenant Id </p>" +
                            "<p>Type Create1on1 to create one on one conversation. </p>";
                        replyActivity.AddMentionToText(activity.From);
                        await client.Conversations.ReplyToActivityAsync(replyActivity);
                    }

                    break;

                case ActivityTypes.ConversationUpdate:

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

                                await client.Conversations.SendToConversationAsync(newActivity, channelCreatedEvent.Channel.Id);
                                break;
                            }

                        case TeamEventType.ChannelDeleted:
                            {
                                ChannelDeletedEvent channelDeletedEvent = eventData as ChannelDeletedEvent;

                                Activity newActivity = activity.CreateReplyToGeneralChannel(channelDeletedEvent.Channel.Name + " Channel deletion complete");

                                await client.Conversations.SendToConversationAsync(newActivity, activity.GetGeneralChannel().Id);
                                break;
                            }

                        case TeamEventType.MembersAdded:
                            {
                                MembersAddedEvent memberAddedEvent = eventData as MembersAddedEvent;

                                Activity newActivity = activity.CreateReplyToGeneralChannel("Members added to team.");

                                await client.Conversations.SendToConversationAsync(newActivity, activity.GetGeneralChannel().Id);
                                break;
                            }

                        case TeamEventType.MembersRemoved:
                            {
                                MembersRemovedEvent memberRemovedEvent = eventData as MembersRemovedEvent;

                                Activity newActivity = activity.CreateReplyToGeneralChannel("Members removed from the team.");

                                await client.Conversations.SendToConversationAsync(newActivity, activity.GetGeneralChannel().Id);
                                break;
                            }
                    }

                    break;
                case ActivityTypes.ContactRelationUpdate:
                case ActivityTypes.Typing:
                case ActivityTypes.DeleteUserData:
                case ActivityTypes.Ping:
                default:
                    break;
            }

            return new HttpResponseMessage(System.Net.HttpStatusCode.Accepted);
        }
    }
}
