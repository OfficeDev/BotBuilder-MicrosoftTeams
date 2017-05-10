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
    using System;

    /// <summary>
    /// Extends Connector client to introduce Teams only functionality.
    /// </summary>
    public class TeamsConnectorClient
    {
        /// <summary>
        /// Prevents a default instance of the <see cref="TeamsConnectorClient"/> class from being created.
        /// </summary>
        private TeamsConnectorClient()
        {
        }

        /// <summary>
        /// Gets the team operations.
        /// </summary>
        public ITeamsOperations Teams { get; private set; }

        /// <summary>
        /// Initializes client properties.
        /// </summary>
        /// <param name="connectorClient">The connector client.</param>
        /// <returns>Teams connector client.</returns>
        internal static TeamsConnectorClient Initialize(IConnectorClient connectorClient)
        {
            if (connectorClient as ConnectorClient == null)
            {
                throw new ArgumentException("Cast to ConnectorClient failed. Ensure the client is dervied from ConnectorClient");
            }

            return new TeamsConnectorClient
            {
                Teams = new TeamsOperations(connectorClient as ConnectorClient)
            };
        }
    }
}
