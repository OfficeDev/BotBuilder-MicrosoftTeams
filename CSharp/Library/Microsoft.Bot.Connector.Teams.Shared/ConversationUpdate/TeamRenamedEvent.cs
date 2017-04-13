namespace Microsoft.Bot.Connector.Teams
{
    using Models;

    /// <summary>
    /// Team renamed event.
    /// </summary>
    /// <seealso cref="TeamEventBase" />
    public class TeamRenamedEvent : TeamEventBase
    {
        /// <summary>
        /// Gets the event type.
        /// </summary>
        public override TeamEventType EventType
        {
            get
            {
                return TeamEventType.TeamRenamed;
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
    }
}
