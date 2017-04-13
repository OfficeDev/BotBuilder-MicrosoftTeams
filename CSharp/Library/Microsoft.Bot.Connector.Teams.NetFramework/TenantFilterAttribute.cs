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