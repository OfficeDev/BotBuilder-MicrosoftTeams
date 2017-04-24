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
var ChannelRenamedEvent = (function (_super) {
    __extends(ChannelRenamedEvent, _super);
    function ChannelRenamedEvent(channel, team, tenant) {
        var _this = _super.call(this, TeamEventBase.TeamEventType.ChannelRenamed, team, tenant) || this;
        _this.channel = channel;
        return _this;
    }
    ChannelRenamedEvent.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ChannelRenamedEvent',
            type: {
                name: 'Composite',
                className: 'ChannelRenamedEvent',
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
    return ChannelRenamedEvent;
}(TeamEventBase));
ChannelRenamedEvent.eventType = TeamEventBase.TeamEventType.ChannelRenamed;
module.exports = ChannelRenamedEvent;
