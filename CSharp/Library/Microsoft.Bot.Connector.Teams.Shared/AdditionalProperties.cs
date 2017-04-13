namespace Microsoft.Bot.Connector.Teams.Models
{
    using System.Diagnostics.CodeAnalysis;

    /// <summary>
    /// Content type for <see cref="FileListItem"/>
    /// </summary>
    public partial class FileListItem
    {
        /// <summary>
        /// Content type to be used in the type property.
        /// </summary>
        public const string ContentType = "file";
    }

    /// <summary>
    /// Content type for <see cref="O365ConnectorCard"/>
    /// </summary>
    [SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleClass", Justification = "Using one file for all additional properties.")]
    public partial class O365ConnectorCard
    {
        /// <summary>
        /// Content type to be used in the type property.
        /// </summary>
        public const string ContentType = "application/vnd.microsoft.teams.card.o365connector";
    }

    /// <summary>
    /// Content type for <see cref="O365ConnectorCardViewAction"/>
    /// </summary>
    [SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleClass", Justification = "Using one file for all additional properties.")]
    public partial class O365ConnectorCardViewAction
    {
        /// <summary>
        /// Content type to be used in the @type property.
        /// </summary>
        public const string ContentType = "viewAction";
    }

    /// <summary>
    /// Content type for <see cref="PersonCard"/>
    /// </summary>
    [SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleClass", Justification = "Using one file for all additional properties.")]
    public partial class PersonCard
    {
        /// <summary>
        /// Content type to be used in the type property.
        /// </summary>
        public const string ContentType = "application/vnd.microsoft.teams.card.profile";
    }

    /// <summary>
    /// Content type for <see cref="PersonListItem"/>
    /// </summary>
    [SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleClass", Justification = "Using one file for all additional properties.")]
    public partial class PersonListItem
    {
        /// <summary>
        /// Content type to be used in the type property.
        /// </summary>
        public const string ContentType = "person";
    }

    /// <summary>
    /// Content type for <see cref="SectionListItem"/>
    /// </summary>
    [SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleClass", Justification = "Using one file for all additional properties.")]
    public partial class SectionListItem
    {
        /// <summary>
        /// Content type to be used in the type property.
        /// </summary>
        public const string ContentType = "section";
    }

    /// <summary>
    /// Content type for <see cref="ListCard"/>
    /// </summary>
    [SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1402:FileMayOnlyContainASingleClass", Justification = "Using one file for all additional properties.")]
    public partial class ListCard
    {
        /// <summary>
        /// Content type of List Card
        /// </summary>
        public const string ContentType = "application/vnd.microsoft.teams.card.list";
    }
}
