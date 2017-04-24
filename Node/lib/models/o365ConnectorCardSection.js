'use strict';
var models = require('./index');
var O365ConnectorCardSection = (function () {
    function O365ConnectorCardSection() {
    }
    O365ConnectorCardSection.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'O365ConnectorCardSection',
            type: {
                name: 'Composite',
                className: 'O365ConnectorCardSection',
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
                    activityTitle: {
                        required: false,
                        serializedName: 'activityTitle',
                        type: {
                            name: 'String'
                        }
                    },
                    activitySubtitle: {
                        required: false,
                        serializedName: 'activitySubtitle',
                        type: {
                            name: 'String'
                        }
                    },
                    activityText: {
                        required: false,
                        serializedName: 'activityText',
                        type: {
                            name: 'String'
                        }
                    },
                    activityImage: {
                        required: false,
                        serializedName: 'activityImage',
                        type: {
                            name: 'String'
                        }
                    },
                    facts: {
                        required: false,
                        serializedName: 'facts',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'O365ConnectorCardFactElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'O365ConnectorCardFact'
                                }
                            }
                        }
                    },
                    images: {
                        required: false,
                        serializedName: 'images',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'O365ConnectorCardImageElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'O365ConnectorCardImage'
                                }
                            }
                        }
                    },
                    potentialAction: {
                        required: false,
                        serializedName: 'potentialAction',
                        type: {
                            name: 'Sequence',
                            element: {
                                required: false,
                                serializedName: 'O365ConnectorCardActionBaseElementType',
                                type: {
                                    name: 'Composite',
                                    className: 'O365ConnectorCardActionBase'
                                }
                            }
                        }
                    }
                }
            }
        };
    };
    return O365ConnectorCardSection;
}());
module.exports = O365ConnectorCardSection;
