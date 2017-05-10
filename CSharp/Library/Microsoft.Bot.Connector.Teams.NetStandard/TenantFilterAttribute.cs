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
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Filters;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Filters request based on Tenant Id.
    /// </summary>
    /// <seealso cref="ActionFilterAttribute" />
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public class TenantFilterAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// The tenant filtering instance.
        /// </summary>
        private static TenantFiltering tenantFiltering;

        /// <summary>
        /// Initializes static members of the <see cref="TenantFilterAttribute"/> class.
        /// </summary>
        /// <exception cref="System.Exception">
        /// Service provider registration is missing please use app.UseBotConnector in Startup.cs to register service
        /// or
        /// Failed to get list of allowed tenants. Ensure that configuration has AllowedTenants element with the comma separated list of tenant Ids. Tenant Ids must be Guid.
        /// </exception>
        static TenantFilterAttribute()
        {
            if (!ServiceProvider.IsRegistered)
            {
                throw new Exception("Service provider registration is missing please use app.UseBotConnector in Startup.cs to register service");
            }

            try
            {
                tenantFiltering = new TenantFiltering(ServiceProvider.Instance.ConfigurationRoot["AllowedTenants"].Split(',').ToList());
            }
            catch (Exception ex)
            {
                throw new Exception(
                    "Failed to get list of allowed tenants. Ensure that configuration has AllowedTenants element with the comma separated list of tenant Ids. Tenant Ids must be Guid.",
                    ex);
            }
        }

        /// <summary>
        /// Called when request is received.
        /// </summary>
        /// <param name="context">The action context.</param>
        /// <param name="next">The next delegate.</param>
        /// <returns>Task tracking async operation.</returns>
        public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var activities = TenantFiltering.GetActivities(context.ActionArguments);

            if (activities.Any(activity => !tenantFiltering.IsFromAllowedTenant(activity)))
            {
                context.Result = new StatusCodeResult((int)HttpStatusCode.Forbidden);
            }
            else
            {
                await next();
            }
        }
    }
}
