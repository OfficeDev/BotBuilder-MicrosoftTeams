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
var O365ConnectorCardViewAction = (function (_super) {
    __extends(O365ConnectorCardViewAction, _super);
    function O365ConnectorCardViewAction() {
        return _super.call(this) || this;
    }
    O365ConnectorCardViewAction.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'O365ConnectorCardViewAction',
            type: {
                name: 'Composite',
                className: 'O365ConnectorCardViewAction',
                modelProperties: {
                    type: {
                        required: false,
                        serializedName: '@type',
                        type: {
                            name: 'String'
                        }
                    },
                    name: {
                        required: false,
                        serializedName: 'name',
                        type: {
                            name: 'String'
                        }
                    },
                    target: {
                        required: false,
                        serializedName: 'target',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'StringElementType',
                                type: {
                                    name: 'String'
                                }
                            }
                        }
                    }
                }
            }
        };
    };
    return O365ConnectorCardViewAction;
}(models['O365ConnectorCardActionBase']));
module.exports = O365ConnectorCardViewAction;
