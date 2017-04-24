'use strict';
var O365ConnectorCardImage = (function () {
    function O365ConnectorCardImage() {
    }
    O365ConnectorCardImage.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'O365ConnectorCardImage',
            type: {
                name: 'Composite',
                className: 'O365ConnectorCardImage',
                modelProperties: {
                    image: {
                        required: false,
                        serializedName: 'image',
                        type: {
                            name: 'String'
                        }
                    }
                }
            }
        };
    };
    return O365ConnectorCardImage;
}());
module.exports = O365ConnectorCardImage;
