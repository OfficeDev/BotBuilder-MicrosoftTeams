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
    using System.Net.Http;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Bot.Connector.Teams.Models;
    using Microsoft.Rest;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Extension methods for existing IConversation operations.
    /// </summary>
    public static class ConversationExtensions
    {
        /// <summary>
        /// Gets teams conversation members asynchronously.
        /// </summary>
        /// <param name="conversations">Conversation instance.</param>
        /// <param name="conversationId">Conversation Id.</param>
        /// <param name="tenantId">Tenant Id for the conversation.</param>
        /// <returns>List of members who are part of conversation.</returns>
        [Obsolete("Use IConversations.GetConversationMembersAsync method instead. AsTeamsChannelAccount method can then be used to get extended properties.")]
        public static async Task<TeamsChannelAccount[]> GetTeamsConversationMembersAsync(this IConversations conversations, string conversationId, string tenantId = null)
        {
            using (var memberList = await conversations.GetConversationMembersWithHttpMessagesAsync(conversationId).ConfigureAwait(false))
            {
                var members = memberList.Body;
                return members.Select(member => member.AsTeamsChannelAccount()).ToArray();
            }
        }

        /// <summary>
        /// GET Paged teams conversation members asynchronously.
        /// </summary>
        /// <param name="conversations">Conversation instance.</param>
        /// <param name="conversationId">Conversation Id.</param>
        /// <param name="pageSize">Requested Page size</param>
        /// <param name="continuationToken">Continuation token to fetch more pages</param>
        /// <returns>Paged list of members who are part of conversation.</returns>
        public static async Task<TeamsPagedMembersResult> GetTeamsPagedConversationMembersAsync(this IConversations conversations, string conversationId, int? pageSize, string continuationToken = null)
        {
            var pagedMembersResult = await conversations.GetConversationPagedMembersAsync(conversationId, pageSize: pageSize, continuationToken: continuationToken).ConfigureAwait(false);
            var teamsPagedMembersResult = new TeamsPagedMembersResult
            {
                Members = pagedMembersResult.Members.Select(member => member.AsTeamsChannelAccount()).ToArray(),
                ContinuationToken = pagedMembersResult.ContinuationToken
            };
            return teamsPagedMembersResult;
        }

        /// <summary>
        /// GET Paged teams conversation members asynchronously.
        /// </summary>
        /// <param name="conversations">Conversation instance.</param>
        /// <param name="client">Connector Client</param>
        /// <param name='userId'> Conversation ID </param>
        /// <param name='conversationId'> Conversation ID </param>
        /// <param name='customHeaders'> Headers that will be added to request.</param>
        /// <param name='cancellationToken'> The cancellation token. </param>
        /// <returns>Returns the request member.</returns>
        public static async Task<TeamsChannelAccount> GetTeamsConversationMemberAsync(this IConversations conversations, ConnectorClient client, string userId, string conversationId, Dictionary<string, List<string>> customHeaders = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            using (var getMemberResponse = await GetConversationMemberWithHttpMessagesAsync(client, userId, conversationId, customHeaders: customHeaders, cancellationToken: cancellationToken).ConfigureAwait(false))
            {
                var member = getMemberResponse.Body;
                return member.AsTeamsChannelAccount();
            } 
        }

        /// <summary>
        /// GET single conversation member.
        /// </summary>
        /// <param name="Client">Bot framework connector client</param>
        /// <param name='userId'> Conversation ID</param>
        /// <param name='conversationId'> Conversation ID</param>
        /// <param name='customHeaders'> Headers that will be added to request. </param>
        /// <param name='cancellationToken'> The cancellation token. </param>
        /// <exception cref="ErrorResponseException"> Thrown when the operation returned an invalid status code </exception>
        /// <exception cref="SerializationException"> Thrown when unable to deserialize the response </exception>
        /// <exception cref="ValidationException"> Thrown when a required parameter is null </exception>
        /// <exception cref="System.ArgumentNullException"> Thrown when a required parameter is null </exception>
        /// <return> A response object containing the response body and response headers. </return>
        public static async Task<HttpOperationResponse<ChannelAccount>> GetConversationMemberWithHttpMessagesAsync(this ConnectorClient Client, string userId, string conversationId, Dictionary<string, List<string>> customHeaders = null, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (conversationId == null)
            {
                throw new ValidationException(ValidationRules.CannotBeNull, "conversationId");
            }
            if (userId == null)
            {
                throw new ValidationException(ValidationRules.CannotBeNull, "userId");
            }
            // Construct URL
            var _baseUrl = Client.BaseUri.AbsoluteUri;
            var _url = new System.Uri(new System.Uri(_baseUrl + (_baseUrl.EndsWith("/") ? "" : "/")), "v3/conversations/{conversationId}/members/{userId}").ToString();
            _url = _url.Replace("{conversationId}", System.Uri.EscapeDataString(conversationId));
            _url = _url.Replace("{userId}", System.Uri.EscapeDataString(userId));
            // Create HTTP transport objects
            var _httpRequest = new HttpRequestMessage();
            HttpResponseMessage _httpResponse = null;
            _httpRequest.Method = new HttpMethod("GET");
            _httpRequest.RequestUri = new System.Uri(_url);
            // Set Headers
            if (customHeaders != null)
            {
                foreach (var _header in customHeaders)
                {
                    if (_httpRequest.Headers.Contains(_header.Key))
                    {
                        _httpRequest.Headers.Remove(_header.Key);
                    }
                    _httpRequest.Headers.TryAddWithoutValidation(_header.Key, _header.Value);
                }
            }
            // Serialize Request
            string _requestContent = null;
            // Set Credentials
            if (Client.Credentials != null)
            {
                cancellationToken.ThrowIfCancellationRequested();
                await Client.Credentials.ProcessHttpRequestAsync(_httpRequest, cancellationToken).ConfigureAwait(false);
            }

            cancellationToken.ThrowIfCancellationRequested();
            _httpResponse = await Client.HttpClient.SendAsync(_httpRequest, cancellationToken).ConfigureAwait(false);

            HttpStatusCode _statusCode = _httpResponse.StatusCode;
            cancellationToken.ThrowIfCancellationRequested();
            string _responseContent = null;
            if ((int)_statusCode != 200)
            {
                var ex = new ErrorResponseException(string.Format("Operation returned an invalid status code '{0}'", _statusCode));
                try
                {
                    _responseContent = await _httpResponse.Content.ReadAsStringAsync().ConfigureAwait(false);
                    ErrorResponse _errorBody = Rest.Serialization.SafeJsonConvert.DeserializeObject<ErrorResponse>(_responseContent, Client.DeserializationSettings);
                    if (_errorBody != null)
                    {
                        ex.Body = _errorBody;
                    }
                }
                catch (JsonException)
                {
                    // Ignore the exception
                }
                ex.Request = new HttpRequestMessageWrapper(_httpRequest, _requestContent);
                ex.Response = new HttpResponseMessageWrapper(_httpResponse, _responseContent);

                _httpRequest.Dispose();
                if (_httpResponse != null)
                {
                    _httpResponse.Dispose();
                }
                throw ex;
            }
            // Create Result
            var _result = new HttpOperationResponse<ChannelAccount>();
            _result.Request = _httpRequest;
            _result.Response = _httpResponse;
            // Deserialize Response
            if ((int)_statusCode == 200)
            {
                _responseContent = await _httpResponse.Content.ReadAsStringAsync().ConfigureAwait(false);
                try
                {
                    _result.Body = Rest.Serialization.SafeJsonConvert.DeserializeObject<ChannelAccount>(_responseContent, Client.DeserializationSettings);
                }
                catch (JsonException ex)
                {
                    _httpRequest.Dispose();
                    if (_httpResponse != null)
                    {
                        _httpResponse.Dispose();
                    }
                    throw new SerializationException("Unable to deserialize the response.", _responseContent, ex);
                }
            }

            return _result;
        }


        /// <summary>
        /// Gets teams channel account data.
        /// </summary>
        /// <param name="channelAccount">Channel account instance.</param>
        /// <returns>Teams channel account data.</returns>
        public static TeamsChannelAccount AsTeamsChannelAccount(this ChannelAccount channelAccount)
        {
            return JObject.FromObject(channelAccount).ToObject<TeamsChannelAccount>();
        }

        /// <summary>
        /// Resolves channel account collection to extended teams channel account collection.
        /// </summary>
        /// <param name="channelAccountList">Collection of Channel account.</param>
        /// <returns>Teams channel account collection.</returns>
        public static IEnumerable<TeamsChannelAccount> AsTeamsChannelAccounts(this IEnumerable<ChannelAccount> channelAccountList)
        {
            foreach (ChannelAccount channelAccount in channelAccountList)
            {
                yield return JObject.FromObject(channelAccount).ToObject<TeamsChannelAccount>();
            }
        }
    }
}
