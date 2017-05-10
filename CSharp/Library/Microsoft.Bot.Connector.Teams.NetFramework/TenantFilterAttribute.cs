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
    using System.Collections.Generic;
    using System.Configuration;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web.Http.Controllers;
    using System.Web.Http.Filters;
    using Models;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Filters request based on Tenant Id.
    /// </summary>
    /// <seealso cref="ActionFilterAttribute" />
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public class TenantFilterAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// The tenant filtering object with actual logic.
        /// </summary>
        private static TenantFiltering tenantFiltering;

        /// <summary>
        /// Initializes static members of the <see cref="TenantFilterAttribute"/> class.
        /// </summary>
        static TenantFilterAttribute()
        {
            string allowedTenantSetting = ConfigurationManager.AppSettings["AllowedTenants"];

            if (!string.IsNullOrEmpty(allowedTenantSetting))
            {
                tenantFiltering = new TenantFiltering(allowedTenantSetting.Split(new char[1] { ',' }, StringSplitOptions.RemoveEmptyEntries).ToList());
            }
        }

        /// <summary>
        /// Called when request is received.
        /// </summary>
        /// <param name="actionContext">The action context.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>Task tracking operation.</returns>
        public override async Task OnActionExecutingAsync(HttpActionContext actionContext, CancellationToken cancellationToken)
        {
            if (tenantFiltering != null)
            {
                await base.OnActionExecutingAsync(actionContext, cancellationToken);
                var activities = TenantFiltering.GetActivities(actionContext.ActionArguments);

                if (activities.Any())
                {
                    if (!tenantFiltering.IsFromAllowedTenant(activities.First()))
                    {
                        actionContext.Response = new HttpResponseMessage(HttpStatusCode.Forbidden);
                    }
                }
            }
        }
    }
}