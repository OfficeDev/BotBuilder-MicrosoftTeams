namespace Microsoft.Bot.Connector.Teams
{
    using System.Collections.Generic;
    using Models;

    /// <summary>
    /// Event arguments for members removed event.
    /// </summary>
    /// <seealso cref="TeamEventBase" />
    public class MembersRemovedEvent : TeamEventBase
    {
        /// <summary>
        /// Gets the event type.
        /// </summary>
        public override TeamEventType EventType
        {
            get
            {
                return TeamEventType.MembersRemoved;
            }
        }

        /// <summary>
        /// Gets the members added.
        /// </summary>
        public IList<ChannelAccount> MembersRemoved { get; internal set; }

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
