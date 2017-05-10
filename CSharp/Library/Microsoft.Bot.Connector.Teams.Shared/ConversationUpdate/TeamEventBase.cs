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
