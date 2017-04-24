'use strict';
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
var models = require('../models');
var TeamEventBase = require('./teamEventBase');
var ChannelCreatedEvent = (function (_super) {
    __extends(ChannelCreatedEvent, _super);
    function ChannelCreatedEvent(channel, team, tenant) {
        var _this = _super.call(this, TeamEventBase.TeamEventType.ChannelCreated, team, tenant) || this;
        _this.channel = channel;
        return _this;
    }
    ChannelCreatedEvent.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ChannelCreatedEvent',
            type: {
                name: 'Composite',
                className: 'ChannelCreatedEvent',
                modelProperties: {
                    channel: {
                        required: false,
                        serializedName: 'channel',
                        type: {
                            name: 'Composite',
                            className: 'ChannelInfo'
                        }
                    },
                }
            }
        };
    };
    return ChannelCreatedEvent;
}(TeamEventBase));
ChannelCreatedEvent.eventType = TeamEventBase.TeamEventType.ChannelCreated;
module.exports = ChannelCreatedEvent;
