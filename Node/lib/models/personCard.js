'use strict';
var models = require('./index');
var PersonCard = (function () {
    function PersonCard() {
    }
    PersonCard.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'PersonCard',
            type: {
                name: 'Composite',
                className: 'PersonCard',
                modelProperties: {
                    upn: {
                        required: false,
                        serializedName: 'upn',
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
                    images: {
                        required: false,
                        serializedName: 'images',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'CardImageElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'CardImage'
                                }
                            }
                        }
                    },
                    buttons: {
                        required: false,
                        serializedName: 'buttons',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'CardActionElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'CardAction'
                                }
                            }
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
    return PersonCard;
}());
module.exports = PersonCard;
