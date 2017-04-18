'use strict';

const models = require('../models');
const TeamEventBase = require('./teamEventBase');

/**
 * @class
 * Initializes a new instance of the ChannelDeletedEvent class.
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
class ChannelDeletedEvent extends TeamEventBase {
  constructor(channel, team, tenant) {
    super(
      TeamEventBase.TeamEventType.ChannelDeleted, 
      team, 
      tenant
    );
    this.channel = channel;
  }

  /**
   * Defines the metadata of ChannelDeletedEvent
   *
   * @returns {object} metadata of ChannelDeletedEvent
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ChannelDeletedEvent',
      type: {
        name: 'Composite',
        className: 'ChannelDeletedEvent',
        modelProperties: {
          channel: {
            required: false,
            serializedName: 'channel',
            type: {
              name: 'Composite',
              className: 'ChannelInfo'
            }
          },
        }
      }
    };
  }
}

ChannelDeletedEvent.eventType = TeamEventBase.TeamEventType.ChannelDeleted;

module.exports = ChannelDeletedEvent;
