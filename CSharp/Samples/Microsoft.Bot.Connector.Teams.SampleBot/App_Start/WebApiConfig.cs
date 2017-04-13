namespace Microsoft.Bot.Connector.Teams.SampleBot
{
    using System.Web.Http;

    /// <summary>
    /// Web API configuration.
    /// </summary>
    public static class WebApiConfig
    {
        /// <summary>
        /// Registers the API configuration.
        /// </summary>
        /// <param name="config">The configuration.</param>
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional });
        }
    }
}
