'use strict';
var models = require('./index');
var ListCard = (function () {
    function ListCard() {
    }
    ListCard.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'ListCard',
            type: {
                name: 'Composite',
                className: 'ListCard',
                modelProperties: {
                    title: {
                        required: false,
                        serializedName: 'title',
                        type: {
                            name: 'String'
                        }
                    },
                    items: {
                        required: false,
                        serializedName: 'items',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'ListItemBaseElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'ListItemBase'
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
                    }
                }
            }
        };
    };
    return ListCard;
}());
module.exports = ListCard;
