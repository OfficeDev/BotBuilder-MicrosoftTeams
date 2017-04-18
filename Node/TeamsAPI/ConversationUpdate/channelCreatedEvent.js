'use strict';

const models = require('../models');
const TeamEventBase = require('./teamEventBase');

/**
 * @class
 * Initializes a new instance of the ChannelCreatedEvent class.
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
class ChannelCreatedEvent extends TeamEventBase {
  constructor(channel, team, tenant) {
    super(
      TeamEventBase.TeamEventType.ChannelCreated, 
      team, 
      tenant
    );
    this.channel = channel;
  }

  /**
   * Defines the metadata of ChannelCreatedEvent
   *
   * @returns {object} metadata of ChannelCreatedEvent
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ChannelCreatedEvent',
      type: {
        name: 'Composite',
        className: 'ChannelCreatedEvent',
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

ChannelCreatedEvent.eventType = TeamEventBase.TeamEventType.ChannelCreated;

module.exports = ChannelCreatedEvent;
