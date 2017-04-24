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
var MembersRemovedEvent = (function (_super) {
    __extends(MembersRemovedEvent, _super);
    function MembersRemovedEvent(membersRemoved, team, tenant) {
        var _this = _super.call(this, TeamEventBase.TeamEventType.MembersRemoved, team, tenant) || this;
        _this.membersRemoved = membersRemoved;
        return _this;
    }
    MembersRemovedEvent.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'MembersRemovedEvent',
            type: {
                name: 'Composite',
                className: 'MembersRemovedEvent',
                modelProperties: {
                    membersRemoved: {
                        required: false,
                        serializedName: 'membersRemoved',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'ChannelAccountType',
                                type: {
                                    name: 'Composite',
                                    className: 'ChannelAccount'
                                }
                            }
                        }
                    }
                }
            }
        };
    };
    return MembersRemovedEvent;
}(TeamEventBase));
MembersRemovedEvent.eventType = TeamEventBase.TeamEventType.MembersRemoved;
module.exports = MembersRemovedEvent;
