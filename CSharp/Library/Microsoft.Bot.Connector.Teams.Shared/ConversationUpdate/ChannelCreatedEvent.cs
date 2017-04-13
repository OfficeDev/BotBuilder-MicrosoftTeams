namespace Microsoft.Bot.Connector.Teams
{
    using Models;

    /// <summary>
    /// Channel created event arguments.
    /// </summary>
    /// <seealso cref="TeamEventBase" />
    public class ChannelCreatedEvent : TeamEventBase
    {
        /// <summary>
        /// Gets the event type.
        /// </summary>
        public override TeamEventType EventType
        {
            get
            {
                return TeamEventType.ChannelCreated;
            }
        }

        /// <summary>
        /// Gets the channel created.
        /// </summary>
        public ChannelInfo Channel { get; internal set; }

        /// <summary>
        /// Gets the team for the event.
        /// </summary>
        public override TeamInfo Team { get; internal set; }

        /// <summary>
        /// Gets the tenant for the team.
        /// </summary>
        public override TenantInfo Tenant { get; internal set; }
    }
}
