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
var models = require('./index');
var FileListItem = (function (_super) {
    __extends(FileListItem, _super);
    function FileListItem() {
        return _super.call(this) || this;
    }
    FileListItem.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'FileListItem',
            type: {
                name: 'Composite',
                className: 'FileListItem',
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
    return FileListItem;
}(models['ListItemBase']));
module.exports = FileListItem;
