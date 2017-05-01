'use strict';
var models = require('./index');
var ComposeExtensionResult = (function () {
    function ComposeExtensionResult() {
    }
    ComposeExtensionResult.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ComposeExtensionResult',
            type: {
                name: 'Composite',
                className: 'ComposeExtensionResult',
                modelProperties: {
                    attachmentLayout: {
                        required: false,
                        serializedName: 'attachmentLayout',
                        type: {
                            name: 'String'
                        }
                    },
                    type: {
                        required: false,
                        serializedName: 'type',
                        type: {
                            name: 'String'
                        }
                    },
                    attachments: {
                        required: false,
                        serializedName: 'attachments',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'ComposeExtensionAttachmentElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'ComposeExtensionAttachment'
                                }
                            }
                        }
                    }
                }
            }
        };
    };
    return ComposeExtensionResult;
}());
module.exports = ComposeExtensionResult;
