/*
 * Code generated by Microsoft (R) AutoRest Code Generator 1.0.1.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

/**
 * @class
 * Initializes a new instance of the ChannelAccount class.
 * @constructor
 * An action on a card
 *
 * @member {string} [name] Defines the user name
 * button.
 *
 * @member {string} [id] Defines the user id
 *
 */
class ChannelAccount {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }

  /**
   * Defines the metadata of ChannelAccount
   *
   * @returns {object} metadata of ChannelAccount
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ChannelAccount',
      type: {
        name: 'Composite',
        className: 'ChannelAccount',
        modelProperties: {
          id: {
            required: false,
            serializedName: 'id',
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
          }
        }
      }
    };
  }
}

module.exports = ChannelAccount;