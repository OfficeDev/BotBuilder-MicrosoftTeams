'use strict';
var O365ConnectorCardFact = (function () {
    function O365ConnectorCardFact() {
    }
    O365ConnectorCardFact.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'O365ConnectorCardFact',
            type: {
                name: 'Composite',
                className: 'O365ConnectorCardFact',
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
                            name: 'String'
                        }
                    }
                }
            }
        };
    };
    return O365ConnectorCardFact;
}());
module.exports = O365ConnectorCardFact;
