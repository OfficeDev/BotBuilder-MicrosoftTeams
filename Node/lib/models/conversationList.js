'use strict';
var models = require('./index');
var ConversationList = (function () {
    function ConversationList() {
    }
    ConversationList.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ConversationList',
            type: {
                name: 'Composite',
                className: 'ConversationList',
                modelProperties: {
                    conversations: {
                        required: false,
                        serializedName: 'conversations',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'ChannelInfoElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'ChannelInfo'
                                }
                            }
                        }
                    }
                }
            }
        };
    };
    return ConversationList;
}());
module.exports = ConversationList;
