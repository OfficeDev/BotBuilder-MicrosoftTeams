namespace Microsoft.Bot.Connector.Teams.Models
{
    /// <summary>
    /// Teams channel account detailing user Azure Active Directory details.
    /// </summary>
    public partial class TeamsChannelAccount
    {
        /// <summary>
        /// Gets or sets unique user principal name
        /// </summary>
        [Newtonsoft.Json.JsonProperty(PropertyName = "aadObjectId")]
        private string AADObjectId { set { ObjectId = value; } }
    }
}
