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
var ChannelDeletedEvent = (function (_super) {
    __extends(ChannelDeletedEvent, _super);
    function ChannelDeletedEvent(channel, team, tenant) {
        var _this = _super.call(this, TeamEventBase.TeamEventType.ChannelDeleted, team, tenant) || this;
        _this.channel = channel;
        return _this;
    }
    ChannelDeletedEvent.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ChannelDeletedEvent',
            type: {
                name: 'Composite',
                className: 'ChannelDeletedEvent',
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
    return ChannelDeletedEvent;
}(TeamEventBase));
ChannelDeletedEvent.eventType = TeamEventBase.TeamEventType.ChannelDeleted;
module.exports = ChannelDeletedEvent;
