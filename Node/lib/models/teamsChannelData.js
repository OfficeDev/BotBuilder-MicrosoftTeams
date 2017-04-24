'use strict';
var models = require('./index');
var TeamsChannelData = (function () {
    function TeamsChannelData() {
    }
    TeamsChannelData.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'TeamsChannelData',
            type: {
                name: 'Composite',
                className: 'TeamsChannelData',
                modelProperties: {
                    channel: {
                        required: false,
                        serializedName: 'channel',
                        type: {
                            name: 'Composite',
                            className: 'ChannelInfo'
                        }
                    },
                    eventType: {
                        required: false,
                        serializedName: 'eventType',
                        type: {
                            name: 'String'
                        }
                    },
                    team: {
                        required: false,
                        serializedName: 'team',
                        type: {
                            name: 'Composite',
                            className: 'TeamInfo'
                        }
                    },
                    tenant: {
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
    return TeamsChannelData;
}());
module.exports = TeamsChannelData;
