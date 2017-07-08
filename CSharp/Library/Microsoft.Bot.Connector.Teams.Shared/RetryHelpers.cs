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

namespace Microsoft.Bot.Connector
{
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Practices.EnterpriseLibrary.TransientFaultHandling;

    /// <summary>
    /// Helpers to allow retrying operation.
    /// </summary>
    public static class RetryHelpers
    {
        /// <summary>
        /// The retry strategy map
        /// </summary>
        private static Dictionary<IConversations, RetryPolicy> retryStrategyMap = new Dictionary<IConversations, RetryPolicy>();

        /// <summary>
        /// The default retry policy in case one is not chosen by developer.
        /// </summary>
        private static RetryPolicy defaultRetryPolicy = new RetryPolicy(
            new TransientExceptionDetectionStrategy(),
            new ExponentialBackoff(3, TimeSpan.FromSeconds(2), TimeSpan.FromSeconds(20), TimeSpan.FromSeconds(1)));

        /// <summary>
        /// Sets the retry policy for a connector client.
        /// </summary>
        /// <param name="connectorClient">The connector client.</param>
        /// <param name="retryStrategy">The retry strategy.</param>
        public static void SetRetryPolicy(this IConnectorClient connectorClient, RetryStrategy retryStrategy)
        {
            retryStrategyMap[connectorClient.Conversations] = new RetryPolicy(new TransientExceptionDetectionStrategy(), retryStrategy);
        }

        /// <summary>
        /// Replies to activity with retries asynchronously.
        /// </summary>
        /// <param name="conversation">The conversation client instance.</param>
        /// <param name="conversationId">The conversation identifier.</param>
        /// <param name="activityId">The activity identifier.</param>
        /// <param name="activity">The activity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>Resource response.</returns>
        public static async Task<ResourceResponse> ReplyToActivityWithRetriesAsync(
            this IConversations conversation,
            string conversationId,
            string activityId,
            Activity activity,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            return await ExecuteWithRetries(() => conversation.ReplyToActivityAsync(conversationId, activityId, activity, cancellationToken), conversation);
        }

        /// <summary>
        /// Replies to activity with retries asynchronously.
        /// </summary>
        /// <param name="conversation">The conversation client instance.</param>
        /// <param name="activity">The activity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>Resource response.</returns>
        public static async Task<ResourceResponse> ReplyToActivityWithRetriesAsync(
            this IConversations conversation,
            Activity activity,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            return await ExecuteWithRetries(() => conversation.ReplyToActivityAsync(activity, cancellationToken), conversation);
        }

        /// <summary>
        /// Sends to conversation with retries asynchronously.
        /// </summary>
        /// <param name="conversation">The conversation.</param>
        /// <param name="activity">The activity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>Resource response.</returns>
        public static async Task<ResourceResponse> SendToConversationWithRetriesAsync(
            this IConversations conversation,
            Activity activity,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            return await ExecuteWithRetries(() => conversation.SendToConversationAsync(activity, cancellationToken), conversation);
        }

        /// <summary>
        /// Sends to conversation with retries asynchronously.
        /// </summary>
        /// <param name="conversation">The conversation.</param>
        /// <param name="activity">The activity.</param>
        /// <param name="conversationId">The conversation identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>Resource response.</returns>
        public static async Task<ResourceResponse> SendToConversationWithRetriesAsync(
            this IConversations conversation,
            Activity activity,
            string conversationId,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            return await ExecuteWithRetries(() => conversation.SendToConversationAsync(activity, conversationId, cancellationToken), conversation);
        }

        /// <summary>
        /// Updates activity with retries asynchronously.
        /// </summary>
        /// <param name="conversation">The conversation client instance.</param>
        /// <param name="conversationId">The conversation identifier.</param>
        /// <param name="activityId">The activity identifier.</param>
        /// <param name="activity">The activity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>Resource response.</returns>
        public static async Task<ResourceResponse> UpdateActivityWithRetriesAsync(
            this IConversations conversation,
            string conversationId,
            string activityId,
            Activity activity,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            return await ExecuteWithRetries(() => conversation.UpdateActivityAsync(conversationId, activityId, activity, cancellationToken), conversation);
        }

        /// <summary>
        /// Updates activity with retries asynchronously.
        /// </summary>
        /// <param name="conversation">The conversation client instance.</param>
        /// <param name="activity">The activity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>Resource response.</returns>
        public static async Task<ResourceResponse> UpdateActivityWithRetriesAsync(
            this IConversations conversation,
            Activity activity,
            CancellationToken cancellationToken = default(CancellationToken))
        {
            return await ExecuteWithRetries(() => conversation.UpdateActivityAsync(activity, cancellationToken), conversation);
        }

        /// <summary>
        /// Executes the with retries.
        /// </summary>
        /// <typeparam name="T">Generic parameter for return type.</typeparam>
        /// <param name="func">The function.</param>
        /// <param name="conversation">The conversation.</param>
        /// <returns>Task operation result.</returns>
        private static async Task<T> ExecuteWithRetries<T>(Func<Task<T>> func, IConversations conversation)
        {
            if (retryStrategyMap.TryGetValue(conversation, out RetryPolicy retryPolicy))
            {
                return await retryPolicy.ExecuteAsync(func);
            }
            else
            {
                return await defaultRetryPolicy.ExecuteAsync(func);
            }
        }
    }
}
