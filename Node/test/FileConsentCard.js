var assert = require('assert');
var fcc = require('../lib/models/FileConsentCard');

describe('FileConsentCard', function () {
  describe('#toAttachment()', function (done) {
    it('should populate attachment correctly', function () {
      let card = new fcc.FileConsentCard()
        .name('filename.txt')
        .description('file description')
        .sizeInBytes(1000)
        .acceptContext({ data: 'accept' })
        .declineContext({ data: 'decline' });

      let attachment = card.toAttachment();
      assert(attachment.contentType === 'application/vnd.microsoft.teams.card.file.consent');
      assert(attachment.name === 'filename.txt');
      assert(attachment.content.description === 'file description');
      assert(attachment.content.sizeInBytes === 1000);
      assert(attachment.content.acceptContext.data === 'accept');
      assert(attachment.content.declineContext.data === 'decline');
    });
  });

  describe('#context()', function (done) {
    it('should set accept and decline context', function () {
      let card = new fcc.FileConsentCard()
        .name('filename.txt')
        .description('file description')
        .sizeInBytes(1000)
        .acceptContext({ data: 'neutral' })
        .declineContext({ data: 'neutral' });

      let attachment = card.toAttachment();
      assert(attachment.contentType === 'application/vnd.microsoft.teams.card.file.consent');
      assert(attachment.name === 'filename.txt');
      assert(attachment.content.description === 'file description');
      assert(attachment.content.sizeInBytes === 1000);
      assert(attachment.content.acceptContext.data === 'neutral');
      assert(attachment.content.declineContext.data === 'neutral');
    });
  });
});
