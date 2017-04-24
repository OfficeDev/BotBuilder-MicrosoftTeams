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
var TeamRenamedEvent = (function (_super) {
    __extends(TeamRenamedEvent, _super);
    function TeamRenamedEvent(team, tenant) {
        return _super.call(this, TeamEventBase.TeamEventType.TeamRenamed, team, tenant) || this;
    }
    TeamRenamedEvent.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'TeamRenamedEvent',
            type: {}
        };
    };
    return TeamRenamedEvent;
}(TeamEventBase));
TeamRenamedEvent.eventType = TeamEventBase.TeamEventType.TeamRenamed;
module.exports = TeamRenamedEvent;
