'use strict';

const models = require('../models');
const TeamEventBase = require('./teamEventBase');

/**
 * @class
 * Initializes a new instance of the MembersAddedEvent class.
 * @constructor
 * Member added to channel
 *
 * @member {string} [url] URL Thumbnail image for major content property.
 *
 * @member {string} [alt] Image description intended for screen readers
 *
 * @member {object} [tap] Action assigned to specific Attachment.E.g.navigate
 * to specific URL or play/open media content
 *
 * @member {string} [tap.type] Defines the type of action implemented by this
 * button.
 *
 * @member {string} [tap.title] Text description which appear on the button.
 *
 * @member {string} [tap.image] URL Picture which will appear on the button,
 * next to text label.
 *
 * @member {object} [tap.value] Supplementary parameter for action. Content of
 * this property depends on the ActionType
 *
 */
class MembersAddedEvent extends TeamEventBase {
  constructor(membersAdded, team, tenant) {
    super(
      TeamEventBase.TeamEventType.MembersAdded, 
      team, 
      tenant
    );
    this.membersAdded = membersAdded;
  }

  /**
   * Defines the metadata of MembersAddedEvent
   *
   * @returns {object} metadata of MembersAddedEvent
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'MembersAddedEvent',
      type: {
        name: 'Composite',
        className: 'MembersAddedEvent',
        modelProperties: {
          membersAdded: {
            required: false,
            serializedName: 'membersAdded',
            type: {
              name: 'Sequence',
              element: {
                required: false,
                serializedName: 'ChannelAccountType',
                type: {
                  name: 'Composite',
                  className: 'ChannelAccount'
                }
              }
            }
          }
        }
      }
    };
  }
}

MembersAddedEvent.eventType = TeamEventBase.TeamEventType.MembersAdded;

module.exports = MembersAddedEvent;
