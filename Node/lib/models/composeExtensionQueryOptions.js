'use strict';
var ComposeExtensionQueryOptions = (function () {
    function ComposeExtensionQueryOptions() {
    }
    ComposeExtensionQueryOptions.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ComposeExtensionQueryOptions',
            type: {
                name: 'Composite',
                className: 'ComposeExtensionQueryOptions',
                modelProperties: {
                    skip: {
                        required: false,
                        serializedName: 'skip',
                        type: {
                            name: 'Number'
                        }
                    },
                    count: {
                        required: false,
                        serializedName: 'count',
                        type: {
                            name: 'Number'
                        }
                    }
                }
            }
        };
    };
    return ComposeExtensionQueryOptions;
}());
module.exports = ComposeExtensionQueryOptions;
