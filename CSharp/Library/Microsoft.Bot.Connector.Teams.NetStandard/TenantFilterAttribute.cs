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
