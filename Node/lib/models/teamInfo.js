'use strict';
var TeamInfo = (function () {
    function TeamInfo(name, id) {
        this.id = id;
        this.name = name;
    }
    TeamInfo.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'TeamInfo',
            type: {
                name: 'Composite',
                className: 'TeamInfo',
                modelProperties: {
                    id: {
                        required: false,
                        serializedName: 'id',
                        type: {
                            name: 'String'
                        }
                    },
                    name: {
                        required: false,
                        serializedName: 'name',
                        type: {
                            name: 'String'
                        }
                    }
                }
            }
        };
    };
    return TeamInfo;
}());
module.exports = TeamInfo;
