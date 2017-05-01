'use strict';
var models = require('./index');
var ComposeExtensionResponse = (function () {
    function ComposeExtensionResponse() {
    }
    ComposeExtensionResponse.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ComposeExtensionResponse',
            type: {
                name: 'Composite',
                className: 'ComposeExtensionResponse',
                modelProperties: {
                    composeExtension: {
                        required: false,
                        serializedName: 'composeExtension',
                        type: {
                            name: 'Composite',
                            className: 'ComposeExtensionResult'
                        }
                    }
                }
            }
        };
    };
    return ComposeExtensionResponse;
}());
module.exports = ComposeExtensionResponse;
