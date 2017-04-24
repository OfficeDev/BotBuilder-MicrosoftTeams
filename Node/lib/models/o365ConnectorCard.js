'use strict';
var models = require('./index');
var O365ConnectorCard = (function () {
    function O365ConnectorCard() {
    }
    O365ConnectorCard.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'O365ConnectorCard',
            type: {
                name: 'Composite',
                className: 'O365ConnectorCard',
                modelProperties: {
                    title: {
                        required: false,
                        serializedName: 'title',
                        type: {
                            name: 'String'
                        }
                    },
                    text: {
                        required: false,
                        serializedName: 'text',
                        type: {
                            name: 'String'
                        }
                    },
                    summary: {
                        required: false,
                        serializedName: 'summary',
                        type: {
                            name: 'String'
                        }
                    },
                    themeColor: {
                        required: false,
                        serializedName: 'themeColor',
                        type: {
                            name: 'String'
                        }
                    },
                    sections: {
                        required: false,
                        serializedName: 'sections',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'O365ConnectorCardSectionElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'O365ConnectorCardSection'
                                }
                            }
                        }
                    }
                }
            }
        };
    };
    return O365ConnectorCard;
}());
module.exports = O365ConnectorCard;
