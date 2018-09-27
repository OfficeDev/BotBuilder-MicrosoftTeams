var builder = require('botbuilder');
var assert = require('assert');
var tmAction = require('../lib/models/TaskModuleAction');
var tmResponse = require('../lib/models/TaskModuleResponse');
var ac = require('../lib/models/AdaptiveCard');

describe('TaskModule', function () {
  describe('#TaskModuleAction', function (done) {
    it('can be used in bot-builder cards (as an invoke action)', () => {
      const card = new builder.HeroCard()
        .title('Task Module')
        .buttons([
          new tmAction.TaskModuleCardAction()
            .title('Launch task module')
            .value({'key': 'value'})
        ]);
      
      const expectedAttachment = {
        "contentType": "application/vnd.microsoft.card.hero",
        "content": {
          "title": "Task Module",
          "buttons": [
            {
              "type": "invoke",
              "title": "Launch task module",
              "value": "{\"key\":\"value\",\"type\":\"task/fetch\"}"
            }
          ]
        }
      };

      assert.deepStrictEqual(card.toAttachment(), expectedAttachment);
    });

    it('can be used in adaptive card (as an Action.Submit action)', () => {
      const card = new ac.AdaptiveCard()
        .actions([
          new tmAction.TaskModuleCardAction()
            .title('Task Module')
            .value({'key': 'value'})
        ]);
      
      const expectedAttachment = {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": {
          "type": "AdaptiveCard",
          "version": "1.0",
          "actions": [
            {
              "id": undefined,
              "type": "Action.Submit",
              "title": "Task Module",
              "data": {
                "msteams": {
                  "type": "invoke",
                  "value": "{\"key\":\"value\",\"type\":\"task/fetch\"}"
                }
              }
            }
          ]
        }
      };

      assert.deepStrictEqual(card.toAttachment(), expectedAttachment);
    });

    it('can be used in adaptive card raw payload', () => {
      // type of IAdaptiveCard
      const payload = {
        type: 'AdaptiveCard',
        version: '1.0',
        actions: [
          new tmAction.TaskModuleCardAction()
            .title('Task Module')
            .value({'key': 'value'})
            .toAdaptiveCardAction()
        ]
      };

      const expectedPayload = {
        "type": "AdaptiveCard",
        "version": "1.0",
        "actions": [
          {
            "id": undefined,
            "type": "Action.Submit",
            "title": "Task Module",
            "data": {
              "msteams": {
                "type": "invoke",
                "value": "{\"key\":\"value\",\"type\":\"task/fetch\"}"
              }
            }
          }
        ]
      };

      assert.deepStrictEqual(payload, expectedPayload);
    });
  });

  describe('#TaskModuleResponse', function (done) {
    it('create response for task module fetch', () => {
      // type of ITaskModuleResponseOfFetch
      const res = tmResponse.TaskModuleResponse
        .createResponseOfFetch()
        .card(new ac.AdaptiveCard()
          .body([
            { 'type': 'TextBlock', 'text': 'HEEEELO!' }
          ])
          .actions([
            { type: 'Action.Submit', id: undefined }
          ]))
        .width('large')
        .height(200)
        .title('First page')
        .toResponseOfFetch();
      
      const expectedResponse = {
        "task": {
          "type": "continue",
          "value": {
            "card": {
              "contentType": "application/vnd.microsoft.card.adaptive",
              "content": {
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                  {
                    "type": "TextBlock",
                    "text": "HEEEELO!"
                  }
                ],
                "actions": [
                  {
                    "id": undefined,
                    "type": "Action.Submit"
                  }
                ]
              }
            },
            "width": "large",
            "height": 200,
            "title": "First page"
          }
        }
      };

      assert.deepStrictEqual(res, expectedResponse);
      assert.throws(() => res.url('https://www.abc.com'), 'should throw exception given both card and url');
    });

    it('create response for task module submit ("message" type)', () => {
      // type of ITaskModuleResponseOfSubmit
      const res = tmResponse.TaskModuleResponse
        .createResponseOfSubmit()
        .message()
        .text('Thanks')
        .toResponseOfSubmit();

      const expectedResponse = {
        "task": {
          "type": "message",
          "value": "Thanks"
        }
      };

      assert.deepStrictEqual(res, expectedResponse);
    });

    it('create response for task module submit ("cardResult" type)', () => {
      // type of ITaskModuleResponseOfSubmit
      const res = tmResponse.TaskModuleResponse
        .createResponseOfSubmit()
        .cardResult()
        .card(new ac.AdaptiveCard()
          .body([
            { 'type': 'TextBlock', 'text': 'HEEEELO!' }
          ]))
        .toResponseOfSubmit();

      const expectedResponse = {
        "task": {
          "type": "cardResult",
          "attachments": [
            {
              "contentType": "application/vnd.microsoft.card.adaptive",
              "content": {
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                  {
                    "type": "TextBlock",
                    "text": "HEEEELO!"
                  }
                ]
              }
            }
          ]
        }
      };

      assert.deepStrictEqual(res, expectedResponse);
    });
  });
});
