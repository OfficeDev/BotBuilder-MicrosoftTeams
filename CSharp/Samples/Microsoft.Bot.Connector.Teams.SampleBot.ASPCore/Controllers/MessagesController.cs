namespace Microsoft.Bot.Connector.Teams.SampleBot.ASPCore.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Bot.Connector.Teams.Models;
    using Microsoft.Extensions.Configuration;

    /// <summary>
    /// Messaging controller.
    /// </summary>
    [Route("api/[controller]")]
    [TenantFilter]
    public class MessagesController : Controller
    {
        /// <summary>
        /// Configuration object to read configuration.
        /// </summary>
        private readonly IConfigurationRoot configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="MessagesController"/> class.
        /// </summary>
        /// <param name="configuration">Configuration for this instance.</param>
        public MessagesController(IConfigurationRoot configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        /// Processes Botframework activities.
        /// </summary>
        /// <param name="activity">Bot framework Activity.</param>
        /// <returns>Ok result.</returns>
        [Authorize(Roles = "Bot")]
        [HttpPost]
        public virtual async Task<HttpResponseMessage> Post([FromBody]Activity activity)
        {
            var client = new ConnectorClient(
                new Uri(activity.ServiceUrl),
                this.configuration[MicrosoftAppCredentials.MicrosoftAppIdKey],
                this.configuration[MicrosoftAppCredentials.MicrosoftAppPasswordKey]);

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
                    else if (activity.Text.Contains("GetMembers"))
                    {
                        var response = await client.Conversations.GetTeamsConversationMembersAsync(activity.Conversation.Id, activity.GetTenantId());
                        StringBuilder stringBuilder = new StringBuilder();
                        Activity replyActivity = activity.CreateReply();
                        replyActivity.Text = string.Join("</p><p>", response.ToList().Select(info => info.Name + " --> " + info.Id));
                        await client.Conversations.ReplyToActivityAsync(replyActivity);
                    }
                    else
                    {
                        var accountList = client.Conversations.GetConversationMembers(activity.Conversation.Id);

                        Activity replyActivity = activity.CreateReply();
                        replyActivity.Text = "Help " +
                            "<p>Type GetChannels to get List of Channels. </p>" +
                            "<p>Type GetTenantId to get Tenant Id </p>" +
                            "<p>Type Create1on1 to create one on one conversation. </p>" +
                            "<p>Type GetMembers to get list of members in a conversation (team or direct conversation). </p>";
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

                case ActivityTypes.Invoke:

                    // Check if the Activity if of type compose extension.
                    if (activity.IsComposeExtensionQuery())
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
                    }

                    break;
                case ActivityTypes.ContactRelationUpdate:
                case ActivityTypes.Typing:
                case ActivityTypes.DeleteUserData:
                case ActivityTypes.Ping:
                default:
                    break;
            }

            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
