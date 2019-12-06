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

namespace Microsoft.Bot.Connector.Teams.SampleBot.Shared
{
    using System;
    using System.Configuration;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    using System.Web.Http;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Simple auth controller.
    /// </summary>
    [RoutePrefix("auth")]
    public class SimpleFBAuthController : ApiController
    {
        /// <summary>
        /// A user agent endpoint where OAuth flow starts from here.
        /// </summary>
        /// <param name="userId">User id.</param>
        /// <returns>Redirect to FB OAuth URL.</returns>
        [Route("start/{userId}")]
        public virtual HttpResponseMessage GetAuthStart(string userId)
        {
            var fbAppId = ConfigurationManager.AppSettings["SigninFbClientId"];
            var fbAppScope = ConfigurationManager.AppSettings["SigninFbScope"];
            var fbOAuthRedirectUrl = ConfigurationManager.AppSettings["SigninBaseUrl"] + "/auth/callback";
            var fbOAuthUrl = $"https://www.facebook.com/v2.10/dialog/oauth?client_id={fbAppId}&redirect_uri={fbOAuthRedirectUrl}&scope={fbAppScope}&state={userId}";
            var response = Request.CreateResponse(HttpStatusCode.Moved);
            response.Headers.Location = new Uri(fbOAuthUrl);
            return response;
        }

        /// <summary>
        /// Handle OAuth callback.
        /// </summary>
        /// <returns>Client page to notify Teams by using tab SDK where state content is passed into client and will be sent back by Teams with another invoke call.</returns>
        [Route("callback")]
        public virtual async Task<HttpResponseMessage> GetAuthCallback()
        {
            var code = Request.GetQueryNameValuePairs().Where(nv => nv.Key == "code").Select(nv => nv.Value).FirstOrDefault();
            var userId = Request.GetQueryNameValuePairs().Where(nv => nv.Key == "state").Select(nv => nv.Value).FirstOrDefault();

            var stateObj = new JObject();
            stateObj.Add("accessCode", code);
            stateObj.Add("userId", userId);
            var botSecret = ConfigurationManager.AppSettings[MicrosoftAppCredentials.MicrosoftAppPasswordKey];
            var state = CipherHelper.Encrypt(stateObj.ToString(Newtonsoft.Json.Formatting.None), botSecret);

            var html = $@"
                <html>
                    <head>
                        <script src='https://statics.teams.cdn.office.net/sdk/v1.5.2/js/MicrosoftTeams.min.js'></script>
                    </head>
                    <body>
                        <script>
                            microsoftTeams.initialize();
                            microsoftTeams.authentication.notifySuccess('{state}');
                        </script>
                    </body>
                </html>
            ";

            var response = new HttpResponseMessage();
            response.Content = new StringContent(html);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            return await Task.FromResult(response);
        }
    }
}
