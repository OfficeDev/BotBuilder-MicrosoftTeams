'use strict';
var O365ConnectorCardActionBase = (function () {
    function O365ConnectorCardActionBase() {
    }
    O365ConnectorCardActionBase.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'O365ConnectorCardActionBase',
            type: {
                name: 'Composite',
                className: 'O365ConnectorCardActionBase',
                modelProperties: {
                    type: {
                        required: false,
                        serializedName: '@type',
                        type: {
                            name: 'String'
                        }
                    }
                }
            }
        };
    };
    return O365ConnectorCardActionBase;
}());
module.exports = O365ConnectorCardActionBase;
