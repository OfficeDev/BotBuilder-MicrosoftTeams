'use strict';

const models = require('../models');
const TeamEventBase = require('./teamEventBase');

/**
 * @class
 * Initializes a new instance of the ChannelRenamedEvent class.
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
class ChannelRenamedEvent extends TeamEventBase {
  constructor(channel, team, tenant) {
    super(
      TeamEventBase.TeamEventType.ChannelRenamed, 
      team, 
      tenant
    );
    this.channel = channel;
  }

  /**
   * Defines the metadata of ChannelRenamedEvent
   *
   * @returns {object} metadata of ChannelRenamedEvent
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'ChannelRenamedEvent',
      type: {
        name: 'Composite',
        className: 'ChannelRenamedEvent',
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

ChannelRenamedEvent.eventType = TeamEventBase.TeamEventType.ChannelRenamed;

module.exports = ChannelRenamedEvent;
