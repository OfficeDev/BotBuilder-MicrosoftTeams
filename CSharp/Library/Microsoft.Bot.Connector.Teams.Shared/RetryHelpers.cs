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
    using Microsoft.Rest;
    using Polly;
    using Polly.Retry;

    /// <summary>
    /// Helpers to allow retrying operation.
    /// </summary>
    public static class RetryHelpers
    {
        /// <summary>
        /// The power factor for the exponential backoff.
        /// </summary>
        private const double PowerFactorBackoff = 1.44;

        /// <summary>
        /// The retry strategy map
        /// </summary>
        private static Dictionary<IConversations, RetryPolicy> retryStrategyMap = new Dictionary<IConversations, RetryPolicy>();

        /// <summary>
        /// The random number generator.
        /// </summary>
        private static Random rng = new Random();

        /// <summary>
        /// The default retry policy in case one is not chosen by developer.
        /// </summary>
        private static RetryPolicy defaultRetryPolicy = DefaultPolicyBuilder.WaitAndRetryAsync(
            5,
            (retrycount) =>
            {
                double jitter = rng.NextDouble() % 2;

                double basenumber = 2.0;

                // 2 -> 2.71320865489534 -> 4.20935737535225 -> 7.92265510992013 -> 19.6958115752911
                for (int i = 0; i < retrycount; i++)
                {
                    basenumber = Math.Pow(basenumber, PowerFactorBackoff);
                }

                return TimeSpan.FromSeconds(basenumber + jitter);
            });

        /// <summary>
        /// Gets the default policy builder. This policy builder handles 429 and can be used to create custom backoff policies.
        /// </summary>
        public static PolicyBuilder DefaultPolicyBuilder
        {
            get
            {
                return Policy.Handle<HttpOperationException>(ex =>
                {
                    if (ex as HttpOperationException != null && (ex as HttpOperationException).Response != null)
                    {
                        if ((int)(ex as HttpOperationException).Response.StatusCode == 429)
                        {
                            return true;
                        }
                    }

                    return false;
                });
            }
        }

        /// <summary>
        /// Sets the retry policy for a connector client.
        /// </summary>
        /// <param name="connectorClient">The connector client.</param>
        /// <param name="retryPolicy">The retry policy.</param>
        public static void SetRetryPolicy(this IConnectorClient connectorClient, RetryPolicy retryPolicy)
        {
            retryStrategyMap[connectorClient.Conversations] = retryPolicy;
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
            return await ExecuteWithRetries(() => conversation.SendToConversationAsync(conversationId, activity, cancellationToken), conversation);
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
            RetryPolicy retryPolicy;
            if (retryStrategyMap.TryGetValue(conversation, out retryPolicy))
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
