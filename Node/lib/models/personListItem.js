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
var PersonListItem = (function (_super) {
    __extends(PersonListItem, _super);
    function PersonListItem() {
        return _super.call(this) || this;
    }
    PersonListItem.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'PersonListItem',
            type: {
                name: 'Composite',
                className: 'PersonListItem',
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
    return PersonListItem;
}(models['ListItemBase']));
module.exports = PersonListItem;
