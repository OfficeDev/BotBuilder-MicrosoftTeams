namespace Microsoft.Bot.Connector.Teams
{
    using Models;

    /// <summary>
    /// Type of team event.
    /// </summary>
    public enum TeamEventType
    {
        /// <summary>
        /// Members added.
        /// </summary>
        MembersAdded,

        /// <summary>
        /// Members removed.
        /// </summary>
        MembersRemoved,

        /// <summary>
        /// New channel created in a team.
        /// </summary>
        ChannelCreated,

        /// <summary>
        /// Channel deleted from a team.
        /// </summary>
        ChannelDeleted,

        /// <summary>
        /// Channel was renamed.
        /// </summary>
        ChannelRenamed,

        /// <summary>
        /// Team was renamed.
        /// </summary>
        TeamRenamed
    }

    /// <summary>
    /// Base class for events generated for teams.
    /// </summary>
    public abstract class TeamEventBase
    {
        /// <summary>
        /// Gets the event type.
        /// </summary>
        public abstract TeamEventType EventType { get; }

        /// <summary>
        /// Gets the team for the event.
        /// </summary>
        public abstract TeamInfo Team { get; internal set; }

        /// <summary>
        /// Gets the tenant for the team.
        /// </summary>
        public abstract TenantInfo Tenant { get; internal set; }
    }
}
