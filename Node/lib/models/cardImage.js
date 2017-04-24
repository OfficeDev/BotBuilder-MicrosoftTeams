'use strict';
var models = require('./index');
var CardImage = (function () {
    function CardImage() {
    }
    CardImage.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'CardImage',
            type: {
                name: 'Composite',
                className: 'CardImage',
                modelProperties: {
                    url: {
                        required: false,
                        serializedName: 'url',
                        type: {
                            name: 'String'
                        }
                    },
                    alt: {
                        required: false,
                        serializedName: 'alt',
                        type: {
                            name: 'String'
                        }
                    },
                    tap: {
                        required: false,
                        serializedName: 'tap',
                        type: {
                            name: 'Composite',
                            className: 'CardAction'
                        }
                    }
                }
            }
        };
    };
    return CardImage;
}());
module.exports = CardImage;
