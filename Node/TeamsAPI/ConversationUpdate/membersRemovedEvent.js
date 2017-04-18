'use strict';

const models = require('../models');
const TeamEventBase = require('./teamEventBase');

/**
 * @class
 * Initializes a new instance of the MembersRemovedEvent class.
 * @constructor
 * Member Removed to channel
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
class MembersRemovedEvent extends TeamEventBase {
  constructor(membersRemoved, team, tenant) {
    super(
      TeamEventBase.TeamEventType.MembersRemoved, 
      team, 
      tenant
    );
    this.membersRemoved = membersRemoved;
  }

  /**
   * Defines the metadata of MembersRemovedEvent
   *
   * @returns {object} metadata of MembersRemovedEvent
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'MembersRemovedEvent',
      type: {
        name: 'Composite',
        className: 'MembersRemovedEvent',
        modelProperties: {
          membersRemoved: {
            required: false,
            serializedName: 'membersRemoved',
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

MembersRemovedEvent.eventType = TeamEventBase.TeamEventType.MembersRemoved;

module.exports = MembersRemovedEvent;
