namespace Microsoft.Bot.Connector.Teams
{
    using Models;

    /// <summary>
    /// Channel renamed event.
    /// </summary>
    /// <seealso cref="TeamEventBase" />
    public class ChannelRenamedEvent : TeamEventBase
    {
        /// <summary>
        /// Gets the event type.
        /// </summary>
        public override TeamEventType EventType
        {
            get
            {
                return TeamEventType.ChannelRenamed;
            }
        }

        /// <summary>
        /// Gets the team for the event.
        /// </summary>
        public override TeamInfo Team { get; internal set; }

        /// <summary>
        /// Gets the tenant for the team.
        /// </summary>
        public override TenantInfo Tenant { get; internal set; }

        /// <summary>
        /// Gets the details of the channel renamed.
        /// </summary>
        public ChannelInfo Channel { get; internal set; }
    }
}
