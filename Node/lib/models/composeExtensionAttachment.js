'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var builder = require("botbuilder");
var models = require('./index');
var ComposeExtensionAttachment = (function (_super) {
    __extends(ComposeExtensionAttachment, _super);
    function ComposeExtensionAttachment() {
        return _super.call(this) || this;
    }
    ComposeExtensionAttachment.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ComposeExtensionAttachment',
            type: {
                name: 'Composite',
                className: 'ComposeExtensionAttachment',
                modelProperties: {
                    contentType: {
                        required: false,
                        serializedName: 'contentType',
                        type: {
                            name: 'String'
                        }
                    },
                    contentUrl: {
                        required: false,
                        serializedName: 'contentUrl',
                        type: {
                            name: 'String'
                        }
                    },
                    content: {
                        required: false,
                        serializedName: 'content',
                        type: {
                            name: 'Object'
                        }
                    },
                    name: {
                        required: false,
                        serializedName: 'name',
                        type: {
                            name: 'String'
                        }
                    },
                    thumbnailUrl: {
                        required: false,
                        serializedName: 'thumbnailUrl',
                        type: {
                            name: 'String'
                        }
                    },
                    preview: {
                        required: false,
                        serializedName: 'preview',
                        type: {
                            name: 'Composite',
                            className: 'Attachment'
                        }
                    }
                }
            }
        };
    };
    return ComposeExtensionAttachment;
}(builder.IIsAttachment));
module.exports = ComposeExtensionAttachment;
