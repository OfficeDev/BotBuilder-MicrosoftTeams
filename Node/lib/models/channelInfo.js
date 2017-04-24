'use strict';
var ChannelInfo = (function () {
    function ChannelInfo(name, id) {
        this.name = name;
        this.id = id;
    }
    ChannelInfo.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ChannelInfo',
            type: {
                name: 'Composite',
                className: 'ChannelInfo',
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
    return ChannelInfo;
}());
module.exports = ChannelInfo;
