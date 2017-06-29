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
    using Models;
    using Newtonsoft.Json.Linq;

    /// <summary>
    /// Internal class with common logic for tenant filtering.
    /// </summary>
    internal class TenantFiltering
    {
        /// <summary>
        /// The allowed tenants dictionary. Keys and Values are same here. It is just to allow O(1) lookups to reduce processing time.
        /// Also the reason we are doing Guid comparison instead of string is to avoid taking care of case and extra spaces in tenant Id.
        /// </summary>
        private Dictionary<Guid, Guid> allowedTenants;

        /// <summary>
        /// Initializes a new instance of the <see cref="TenantFiltering"/> class.
        /// </summary>
        /// <param name="allowedTenants">The allowed tenants.</param>
        public TenantFiltering(List<string> allowedTenants)
        {
            this.allowedTenants = allowedTenants.ToDictionary(val => Guid.Parse(val), val => Guid.Parse(val));
        }

        /// <summary>
        /// Gets the activities.
        /// </summary>
        /// <param name="actionContextArgs">The action context arguments.</param>
        /// <returns>List of activities.</returns>
        public static IList<Activity> GetActivities(IDictionary<string, object> actionContextArgs)
        {
            var activties = actionContextArgs.Select(t => t.Value).OfType<Activity>().ToList();
            if (activties.Any())
            {
                return activties;
            }
            else
            {
                var objects =
                    actionContextArgs.Where(t => t.Value is JObject || t.Value is JArray)
                        .Select(t => t.Value).ToArray();
                if (objects.Any())
                {
                    activties = new List<Activity>();
                    foreach (var obj in objects)
                    {
                        activties.AddRange((obj is JObject) ? new Activity[] { ((JObject)obj).ToObject<Activity>() } : ((JArray)obj).ToObject<Activity[]>());
                    }
                }
            }

            return activties;
        }

        /// <summary>
        /// Determines whether request is from allowed tenant.
        /// </summary>
        /// <param name="activity">The list of activities.</param>
        /// <returns>true if request is from allowed tenant false otherwise.</returns>
        public bool IsFromAllowedTenant(IActivity activity)
        {
            // 1. Channel Data is missing - Block.
            // 2. Channel data is present
            //      a) Channel data complies to Teams format
            //              i) If tenant Id is in allowed list - allow block otherwise
            //      b) Channel data does not comply to Teams format - block.
            if (activity.ChannelData == null)
            {
                return false;
            }
            else
            {
                try
                {
                    var channelData = activity.GetChannelData<TeamsChannelData>();

                    if (channelData.Tenant == null || string.IsNullOrEmpty(channelData.Tenant.Id))
                    {
                        return false;
                    }
                    else
                    {
                        Guid tenantId;
                        if (Guid.TryParse(channelData.Tenant.Id, out tenantId))
                        {
                            if (!this.allowedTenants.ContainsKey(tenantId))
                            {
                                return false;
                            }
                        }
                    }
                }
                catch (Exception)
                {
                    return false;
                }
            }

            return true;
        }
    }
}
