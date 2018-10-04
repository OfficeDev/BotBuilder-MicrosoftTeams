// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
// Microsoft Teams: https://dev.office.com/microsoft-teams
//
// Bot Builder SDK GitHub:
// https://github.com/Microsoft/BotBuilder
//
// Bot Builder SDK Extensions for Teams
// https://github.com/OfficeDev/BotBuilder-MicrosoftTeams
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Microsoft.Bot.Connector.Teams.Models
{
    /// <summary>
    ///  Card extension methods.
    /// </summary>
    public static partial class CardExtensions
    {
        /// <summary>
        /// Creates a new attachment from <see cref="O365ConnectorCard"/>.
        /// </summary>
        /// <param name="card"> The instance of <see cref="O365ConnectorCard"/>.</param>
        /// <returns> The generated attachment.</returns>
        public static Attachment ToAttachment(this O365ConnectorCard card)
        {
            return new Attachment
            {
                Content = card,
                ContentType = O365ConnectorCard.ContentType
            };
        }

        /// <summary>
        /// Creates a new attachment from <see cref="FileInfoCard"/>.
        /// </summary>
        /// <param name="card"> The instance of <see cref="FileInfoCard"/>.</param>
        /// <returns> The generated attachment.</returns>
        public static Attachment ToAttachment(this FileInfoCard card)
        {
            return new Attachment
            {
                Content = card,
                ContentType = FileInfoCard.ContentType,
                Name = card.Name,
                ContentUrl = card.ContentUrl,
            };
        }

        /// <summary>
        /// Creates a new attachment from <see cref="FileConsentCard"/>.
        /// </summary>
        /// <param name="card"> The instance of <see cref="FileConsentCard"/>.</param>
        /// <returns> The generated attachment.</returns>
        public static Attachment ToAttachment(this FileConsentCard card)
        {
            return new Attachment
            {
                Content = card,
                ContentType = FileConsentCard.ContentType,
                Name = card.Name,
            };
        }

        /// <summary>
        /// Creates a new attachment from AdaptiveCard.
        /// </summary>
        /// <param name="card"> The instance of AdaptiveCard.</param>
        /// <returns> The generated attachment.</returns>
        public static Attachment ToAttachment(this AdaptiveCards.AdaptiveCard card)
        {
            return new Attachment
            {
                Content = card,
                ContentType = AdaptiveCards.AdaptiveCard.ContentType
            };
        }

        /// <summary>
        /// Creates a new attachment from AdaptiveCardParseResult.
        /// </summary>
        /// <param name="cardParsedResult"> The instance of AdaptiveCardParseResult that represents results parsed from JSON string.</param>
        /// <returns> The generated attachment.</returns>
        public static Attachment ToAttachment(this AdaptiveCards.AdaptiveCardParseResult cardParsedResult)
        {
            return cardParsedResult.Card.ToAttachment();
        }

        /// <summary>
        /// Wrap BotBuilder action into AdaptiveCard.
        /// </summary>
        /// <param name="action"> The instance of adaptive card.</param>
        /// <param name="targetAction"> Target action to be adapted.</param>
        public static void RepresentAsBotBuilderAction(this AdaptiveCards.AdaptiveSubmitAction action, CardAction targetAction)
        {
            var wrappedAction = new CardAction
            {
                Type = targetAction.Type,
                Value = targetAction.Value,
                Text = targetAction.Text,
                DisplayText = targetAction.DisplayText
            };

            JsonSerializerSettings serializerSettings = new JsonSerializerSettings();
            serializerSettings.NullValueHandling = NullValueHandling.Ignore;

            string jsonStr = action.DataJson == null ? "{}" : action.DataJson;
            JToken dataJson = JObject.Parse(jsonStr);
            dataJson["msteams"] = JObject.FromObject(wrappedAction, JsonSerializer.Create(serializerSettings));

            action.Title = targetAction.Title;
            action.DataJson = dataJson.ToString();
        }
    }
}
