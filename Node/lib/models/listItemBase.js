'use strict';
var models = require('./index');
var ListItemBase = (function () {
    function ListItemBase() {
    }
    ListItemBase.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ListItemBase',
            type: {
                name: 'Composite',
                className: 'ListItemBase',
                modelProperties: {
                    type: {
                        required: false,
                        serializedName: 'type',
                        type: {
                            name: 'String'
                        }
                    },
                    id: {
                        required: false,
                        serializedName: 'id',
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
                    subtitle: {
                        required: false,
                        serializedName: 'subtitle',
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
    return ListItemBase;
}());
module.exports = ListItemBase;
