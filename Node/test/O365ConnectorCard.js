var builder = require('botbuilder');
var assert = require('assert');
var models = require('../lib/models');
var O365ConnectorCardSection = models.O365ConnectorCardSection;
var O365ConnectorCardActivityImageTypes = models.O365ConnectorCardActivityImageTypes;

describe('O365ConnectorCard', function () {
  describe('#O365ConnectorCardSection.activityImageType', function (done) {
    it('should throw error if pass in invalid image type', function () {
      section = new O365ConnectorCardSection();
      section.activityImageType("Invalid imageType");
      assert.equal(null, section.data.activityImageType);
    });

    it('should work with valid image types', function () {
      section = new O365ConnectorCardSection();
      section.activityImageType(O365ConnectorCardActivityImageTypes.Article);
      assert.equal('article', section.data.activityImageType);
      section.activityImageType(O365ConnectorCardActivityImageTypes.Avatar);
      assert.equal('avatar', section.data.activityImageType);
    });
  });
});