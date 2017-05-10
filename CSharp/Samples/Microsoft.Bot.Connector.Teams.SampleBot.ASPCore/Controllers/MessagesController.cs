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

namespace Microsoft.Bot.Connector.Teams.SampleBot.ASPCore.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Bot.Connector.Teams.Models;
    using Microsoft.Bot.Connector.Teams.SampleBot.Shared;
    using Microsoft.Extensions.Configuration;

    /// <summary>
    /// Messaging controller.
    /// </summary>
    [Route("api/[controller]")]
    [TenantFilter]
    public class MessagesController : Controller
    {
        /// <summary>
        /// Configuration object to read configuration.
        /// </summary>
        private readonly IConfigurationRoot configuration;

        private ConnectorClient connectorClient;

        /// <summary>
        /// Initializes a new instance of the <see cref="MessagesController"/> class.
        /// </summary>
        /// <param name="configuration">Configuration for this instance.</param>
        public MessagesController(IConfigurationRoot configuration)
        {
            this.configuration = configuration;
            this.connectorClient = new ConnectorClient(
                new Uri("https://smba.trafficmanager.net/amer-client-ss.msg/"),
                this.configuration[MicrosoftAppCredentials.MicrosoftAppIdKey],
                this.configuration[MicrosoftAppCredentials.MicrosoftAppPasswordKey]);
        }

        /// <summary>
        /// Processes Botframework incoming activities.
        /// </summary>
        /// <param name="activity">Bot framework incoming request.</param>
        /// <returns>Ok result.</returns>
        [Authorize(Roles = "Bot")]
        [HttpPost]
        public virtual async Task<HttpResponseMessage> Post([FromBody]Activity activity)
        {
            return await MessageProcessor.HandleIncomingRequest(activity, this.connectorClient);
        }
    }
}
