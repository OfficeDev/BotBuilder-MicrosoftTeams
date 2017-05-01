'use strict';
var models = require('./index');
var ComposeExtensionQuery = (function () {
    function ComposeExtensionQuery() {
    }
    ComposeExtensionQuery.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ComposeExtensionQuery',
            type: {
                name: 'Composite',
                className: 'ComposeExtensionQuery',
                modelProperties: {
                    commandId: {
                        required: false,
                        serializedName: 'commandId',
                        type: {
                            name: 'String'
                        }
                    },
                    parameters: {
                        required: false,
                        serializedName: 'parameters',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'ComposeExtensionParameterElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'ComposeExtensionParameter'
                                }
                            }
                        }
                    },
                    queryOptions: {
                        required: false,
                        serializedName: 'queryOptions',
                        type: {
                            name: 'Composite',
                            className: 'ComposeExtensionQueryOptions'
                        }
                    }
                }
            }
        };
    };
    return ComposeExtensionQuery;
}());
module.exports = ComposeExtensionQuery;
