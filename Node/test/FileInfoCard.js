var assert = require('assert');
var fic = require('../lib/models/FileInfoCard');

describe('FileInfoCard', function () {
  describe('#toAttachment()', function (done) {
    it('should populate attachment correctly', function () {
      let card = new fic.FileInfoCard()
        .name('filename.txt')
        .contentUrl('https://content.url')
        .uniqueId('unique_id')
        .fileType('txt');

      let attachment = card.toAttachment();
      assert(attachment.contentType === 'application/vnd.microsoft.teams.card.file.info');
      assert(attachment.name === 'filename.txt');
      assert(attachment.contentUrl === 'https://content.url');
      assert(attachment.content.uniqueId === 'unique_id');
      assert(attachment.content.fileType === 'txt');
    });
  });

  describe('#fromFileUploadInfo()', function (done) {
    it('should populate attachment correctly', function () {
      let uploadInfo = {
        name: 'filename.txt',
        contentUrl: 'https://content.url',
        uploadUrl: 'https://upload.url',
        uniqueId: 'unique_id',
        fileType: 'txt'
      };
      let card = fic.FileInfoCard.fromFileUploadInfo(uploadInfo);

      let attachment = card.toAttachment();
      assert(attachment.contentType === 'application/vnd.microsoft.teams.card.file.info');
      assert(attachment.name === 'filename.txt');
      assert(attachment.contentUrl === 'https://content.url');
      assert(attachment.content.uniqueId === 'unique_id');
      assert(attachment.content.fileType === 'txt');
    });
  });
});
