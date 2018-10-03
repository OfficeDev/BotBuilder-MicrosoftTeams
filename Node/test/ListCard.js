var assert = require('assert');
var builder = require('botbuilder');
var lc = require('../lib/models/ListCard');

describe('ListCard', function () {
  describe('#toAttachment()', function (done) {
    it('should populate attachment correctly', function () {
      let card = new lc.ListCard()
        .title('list card title')
        .items([])
        .buttons([]);

      let attachment = card.toAttachment();
      assert.equal(attachment.contentType, 'application/vnd.microsoft.teams.card.list');
      assert.equal(attachment.content.title, 'list card title');
      assert.equal(attachment.content.items.length, 0);
      assert.equal(attachment.content.buttons.length, 0);
    });
  });

  describe('#title()', function (done) {
    it('should set plain title', function () {
      let card = new lc.ListCard()
        .title('list card title');

      let attachment = card.toAttachment();
      assert.equal(attachment.content.title, 'list card title');
    });

    it('should select random title if array is provided', function () {
      let titles = [ 'title1', 'title2' ]
      let card = new lc.ListCard()
        .title(titles);

      let attachment = card.toAttachment();
      assert(titles.indexOf(attachment.content.title) >= 0);
    });

    it('should treat text as format string if arguments are provided', function () {
      let card = new lc.ListCard()
        .title('title %d %d', 1, 2);

      let attachment = card.toAttachment();
      assert.equal(attachment.content.title, 'title 1 2');
    });

    it('should attempt to localize the string if a session is provided', function () {
      let session = {
        gettext: (fmt) => `localized ${fmt}`
      }
      let card = new lc.ListCard(session)
        .title('format string %d %d', 1, 2);

      let attachment = card.toAttachment();
      assert.equal(attachment.content.title, 'localized format string 1 2');
    });

    it('should remove the title when empty string is provided', function () {
      let card = new lc.ListCard()
        .title('title')
        .title('');

      let attachment = card.toAttachment();
      assert(!attachment.content.title);
    });
  });

  describe('#buttons()', function (done) {
    it('should set buttons', function () {
      let card = new lc.ListCard()
        .buttons([
          builder.CardAction.openUrl(null, 'https://example.com/1'),
          builder.CardAction.openUrl(null, 'https://example.com/2'),
        ]);

      let attachment = card.toAttachment();
      assert.equal(attachment.content.buttons.length, 2);
    });
  });

  describe('#items()', function (done) {
    it('should set items', function () {
      let card = new lc.ListCard()
        .items([
          new lc.ListCardItem().title('item 1'),
          new lc.ListCardItem().title('item 2'),
          {
            type: 'separator'
          }
        ]);

      let attachment = card.toAttachment();
      assert.equal(attachment.content.items.length, 3);
      assert.equal(attachment.content.items[0].type, 'resultItem');
      assert.equal(attachment.content.items[1].type, 'resultItem');
      assert.equal(attachment.content.items[2].type, 'separator');
    });
  });

  describe('#addItem()', function (done) {
    it('should add item to an empty list', function () {
      let card = new lc.ListCard()
        .addItem(new lc.ListCardItem().title('item 1'));

      let attachment = card.toAttachment();
      assert.equal(attachment.content.items.length, 1);
    });

    it('should add item to an existing list', function () {
      let card = new lc.ListCard()
        .addItem(new lc.ListCardItem().title('item 1'))
        .addItem(new lc.ListCardItem().title('item 2'));

      let attachment = card.toAttachment();
      assert.equal(attachment.content.items.length, 2);
    });
  });
});

describe('ListCardItem', function () {
  describe('#toItem()', function (done) {
    it('should populate list card item correctly', function () {
      let item = new lc.ListCardItem()
        .title('list item title')
        .subtitle('list item subtitle')
        .icon('https://example.com/icon')
        .tap(builder.CardAction.openUrl(null, 'https://example.com'));

      let data = item.toItem();
      assert.equal(data.type, 'resultItem');
      assert.equal(data.title, 'list item title');
      assert.equal(data.subtitle, 'list item subtitle');
      assert.equal(data.icon, 'https://example.com/icon');
      assert.equal(data.tap.type, 'openUrl');
    });
  });

  describe('#type()', function (done) {
    it('should set the type', function () {
      let item = new lc.ListCardItem()
        .type(lc.ListCardItemType.separator);

      let data = item.toItem();
      assert.equal(data.type, 'separator');
    });

    it('should default to resultItem', function () {
      let item = new lc.ListCardItem();

      let data = item.toItem();
      assert.equal(data.type, 'resultItem');
    });
  });
});