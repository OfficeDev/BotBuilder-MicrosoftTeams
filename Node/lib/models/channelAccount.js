'use strict';
var ChannelAccount = (function () {
    function ChannelAccount(name, id) {
        this.name = name;
        this.id = id;
    }
    ChannelAccount.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ChannelAccount',
            type: {
                name: 'Composite',
                className: 'ChannelAccount',
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
    return ChannelAccount;
}());
module.exports = ChannelAccount;
