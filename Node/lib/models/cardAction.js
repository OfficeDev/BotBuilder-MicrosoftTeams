'use strict';
var CardAction = (function () {
    function CardAction() {
    }
    CardAction.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'CardAction',
            type: {
                name: 'Composite',
                className: 'CardAction',
                modelProperties: {
                    type: {
                        required: false,
                        serializedName: 'type',
                        type: {
                            name: 'String'
                        }
                    },
                    title: {
                        required: false,
                        serializedName: 'title',
                        type: {
                            name: 'String'
                        }
                    },
                    image: {
                        required: false,
                        serializedName: 'image',
                        type: {
                            name: 'String'
                        }
                    },
                    value: {
                        required: false,
                        serializedName: 'value',
                        type: {
                            name: 'Object'
                        }
                    }
                }
            }
        };
    };
    return CardAction;
}());
module.exports = CardAction;
