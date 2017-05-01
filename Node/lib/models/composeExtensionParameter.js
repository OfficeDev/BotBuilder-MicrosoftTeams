'use strict';
var ComposeExtensionParameter = (function () {
    function ComposeExtensionParameter() {
    }
    ComposeExtensionParameter.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ComposeExtensionParameter',
            type: {
                name: 'Composite',
                className: 'ComposeExtensionParameter',
                modelProperties: {
                    name: {
                        required: false,
                        serializedName: 'name',
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
    return ComposeExtensionParameter;
}());
module.exports = ComposeExtensionParameter;
