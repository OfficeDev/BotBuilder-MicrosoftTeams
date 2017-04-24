'use strict';
var models = require('../models');
var TeamEventBase = (function () {
    function TeamEventBase(teamEventType, team, tenantInfo) {
        this.eventType = teamEventType;
        this.team = team;
        this.tenant = tenantInfo;
    }
    TeamEventBase.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'TeamEventBase',
            type: {
                name: 'Composite',
                className: 'eventType',
                modelProperties: {
                    eventType: {
                        required: false,
                        serializedName: 'eventType',
                        type: {
                            name: 'Number'
                        }
                    },
                    teamInfo: {
                        required: false,
                        serializedName: 'team',
                        type: {
                            name: 'Composite',
                            className: 'TeamInfo'
                        }
                    },
                    tenantInfo: {
                        required: false,
                        serializedName: 'tenant',
                        type: {
                            name: 'Composite',
                            className: 'TenantInfo'
                        }
                    }
                }
            }
        };
    };
    return TeamEventBase;
}());
TeamEventBase.TeamEventType = {
    MembersAdded: 0,
    MembersRemoved: 1,
    ChannelCreated: 2,
    ChannelDeleted: 3,
    ChannelRenamed: 4,
    TeamRenamed: 5
};
module.exports = TeamEventBase;
