/*
 * Code generated by Microsoft (R) AutoRest Code Generator 1.0.1.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

const models = require('./index');

/**
 * @class
 * Initializes a new instance of the ListCard class.
 * @constructor
 * A list card
 *
 * @member {string} [title] Title of the card
 *
 * @member {array} [items] Array of items
 *
 * @member {array} [buttons] Set of actions applicable to the current card
 *
 */
class ListCard {
  constructor() {
  }

  /**
   * Defines the metadata of ListCard
   *
   * @returns {object} metadata of ListCard
   *
   */
  mapper() {
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
  }
}

module.exports = ListCard;