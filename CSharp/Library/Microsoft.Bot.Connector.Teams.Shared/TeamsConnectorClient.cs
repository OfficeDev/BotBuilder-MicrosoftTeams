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
