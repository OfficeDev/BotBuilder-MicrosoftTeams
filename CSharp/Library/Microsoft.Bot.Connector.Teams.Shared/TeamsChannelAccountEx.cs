namespace Microsoft.Bot.Connector.Teams.Models
{
    /// <summary>
    /// Teams channel account detailing user Azure Active Directory details.
    /// </summary>
    public partial class TeamsChannelAccount
    {
        /// <summary>
        /// Sets the Azure Active Directory object Id from the other JSON field it can appear in.
        /// </summary>
        [Newtonsoft.Json.JsonProperty(PropertyName = "aadObjectId")]
        private string AADObjectId { set { ObjectId = value; } }
    }
}
