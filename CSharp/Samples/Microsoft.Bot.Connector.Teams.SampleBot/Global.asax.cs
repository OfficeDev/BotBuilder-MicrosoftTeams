namespace Microsoft.Bot.Connector.Teams.SampleBot
{
    using System.Web.Http;

    /// <summary>
    /// Web application lifecycle management.
    /// </summary>
    /// <seealso cref="System.Web.HttpApplication" />
    public class WebApiApplication : System.Web.HttpApplication
    {
        /// <summary>
        /// Executed on IIS app start.
        /// </summary>
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
