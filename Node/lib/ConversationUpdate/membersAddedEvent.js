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
var MembersAddedEvent = (function (_super) {
    __extends(MembersAddedEvent, _super);
    function MembersAddedEvent(membersAdded, team, tenant) {
        var _this = _super.call(this, TeamEventBase.TeamEventType.MembersAdded, team, tenant) || this;
        _this.membersAdded = membersAdded;
        return _this;
    }
    MembersAddedEvent.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'MembersAddedEvent',
            type: {
                name: 'Composite',
                className: 'MembersAddedEvent',
                modelProperties: {
                    membersAdded: {
                        required: false,
                        serializedName: 'membersAdded',
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
    return MembersAddedEvent;
}(TeamEventBase));
MembersAddedEvent.eventType = TeamEventBase.TeamEventType.MembersAdded;
module.exports = MembersAddedEvent;
