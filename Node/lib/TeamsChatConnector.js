"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var builder = require("botbuilder");
var msRest = require("ms-rest");
var RemoteQuery = require("./RemoteQuery/teams");
var RestClient = require("./RemoteQuery/RestClient");
var WebResource = msRest.WebResource;
var TeamsChatConnector = (function (_super) {
    __extends(TeamsChatConnector, _super);
    function TeamsChatConnector(settings) {
        if (settings === void 0) { settings = {}; }
        var _this = _super.call(this, settings) || this;
        _this.allowedTenants = null;
        return _this;
    }
    TeamsChatConnector.prototype.fetchChannelList = function (teamId, callback, serverUrl) {
        var options = { customHeaders: {}, jar: false };
        var restClient = new RestClient(serverUrl, null);
        var remoteQuery = new RemoteQuery(restClient);
        this.getAccessToken(function (err, token) {
            if (!err && token) {
                options.customHeaders = {
                    'Authorization': 'Bearer ' + token
                };
                remoteQuery.fetchChannelList(teamId, options, callback);
            }
            else {
                callback(new Error('Failed to authorize request'), null);
            }
        });
    };
    TeamsChatConnector.prototype.setAllowedTenants = function (tenants) {
        if (tenants != null) {
            this.allowedTenants = tenants;
        }
    };
    TeamsChatConnector.prototype.resetAllowedTenants = function () {
        this.allowedTenants = null;
    };
    TeamsChatConnector.prototype.onDispatchEvents = function (events, callback) {
        if (this.allowedTenants) {
            var filteredEvents = [];
            for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
                var event = events_1[_i];
                if (event.sourceEvent.tenant && this.allowedTenants.indexOf(event.sourceEvent.tenant.id) > -1) {
                    filteredEvents.push(event);
                }
            }
            _super.prototype.onDispatchEvents.call(this, filteredEvents, callback);
        }
        else {
            _super.prototype.onDispatchEvents.call(this, events, callback);
        }
    };
    return TeamsChatConnector;
}(builder.ChatConnector));
exports.TeamsChatConnector = TeamsChatConnector;
