namespace Microsoft.Bot.Connector.Teams
{
    using Microsoft.Bot.Connector.Teams.Models;

    /// <summary>
    /// Attachment extensions.
    /// </summary>
    public static class AttachmentExtensions
    {
        /// <summary>
        /// Converts normal attachment into the compose extension attachment.
        /// </summary>
        /// <param name="attachment">The attachment.</param>
        /// <param name="previewAttachment">The preview attachment.</param>
        /// <returns>Compose extension attachment</returns>
        public static ComposeExtensionAttachment ToComposeExtensionAttachment(this Attachment attachment, Attachment previewAttachment = null)
        {
            return new ComposeExtensionAttachment
            {
                Content = attachment.Content,
                ContentType = attachment.ContentType,
                ContentUrl = attachment.ContentUrl,
                Name = attachment.Name,
                ThumbnailUrl = attachment.ThumbnailUrl,
                Preview = previewAttachment == null ? attachment : previewAttachment
            };
        }
    }
}
