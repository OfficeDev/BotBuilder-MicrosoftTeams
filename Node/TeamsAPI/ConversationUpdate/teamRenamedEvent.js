'use strict';

const models = require('../models');
const TeamEventBase = require('./teamEventBase');

/**
 * @class
 * Initializes a new instance of the TeamRenamedEvent class.
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
class TeamRenamedEvent extends TeamEventBase {
  constructor(team, tenant) {
    super(
      TeamEventBase.TeamEventType.TeamRenamed, 
      team, 
      tenant
    );
  }

  /**
   * Defines the metadata of TeamRenamedEvent
   *
   * @returns {object} metadata of TeamRenamedEvent
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'TeamRenamedEvent',
      type: {
      }
    };
  }
}

TeamRenamedEvent.eventType = TeamEventBase.TeamEventType.TeamRenamed;

module.exports = TeamRenamedEvent;
