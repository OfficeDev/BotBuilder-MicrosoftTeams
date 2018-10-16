var builder = require('botbuilder');
var assert = require('assert');
var ac = require('../lib/models/AdaptiveCard');

describe('AdaptiveCard', function () {
  describe('#actions', function (done) {
    it('can take bot-builder actions (together with original Adaptive Card actions)', () => {
      const card = new ac.AdaptiveCard()
        .actions([
          new builder.CardAction()
            .title('ImBack')
            .type('imback')
            .value('hello'),
          new builder.CardAction()
            .title('MessageBack')
            .type('messageBack')
            .value({ msgBak: true })
            .text('text to bots')
            .displayText('Clicked messageBack'),
          new builder.CardAction()
            .title('Invoke')
            .type('invoke')
            .value({ invokeVal: true }),
          new builder.CardAction()
            .title('SignIn')
            .type('signin')
            .value('https://chebyshev.azurewebsites.net/tabInitTaskModule'),
          { id: undefined, type: 'Action.OpenUrl', title: 'Action.OpenUrl', url: 'https://chebyshev.azurewebsites.net/tabInitTaskModule' },
          { id: undefined, type: 'Action.Submit', title: 'Action.Submit', data: { acSubmit: 3.1415926 }}
        ]);

      const expectedPayload = {
        'type': 'AdaptiveCard',
        'version': '1.0',
        'actions': [
          {
            'id': undefined,
            'type': 'Action.Submit',
            'title': 'ImBack',
            'data': {
              'msteams': {
                'type': 'imback',
                'value': 'hello'
              }
            }
          },
          {
            'id': undefined,
            'type': 'Action.Submit',
            'title': 'MessageBack',
            'data': {
              'msteams': {
                'type': 'messageBack',
                'value': {
                  'msgBak': true
                },
                'text': 'text to bots',
                'displayText': 'Clicked messageBack'
              }
            }
          },
          {
            'id': undefined,
            'type': 'Action.Submit',
            'title': 'Invoke',
            'data': {
              'msteams': {
                'type': 'invoke',
                'value': { 
                  'invokeVal': true 
                }
              }
            }
          },
          {
            'id': undefined,
            'type': 'Action.Submit',
            'title': 'SignIn',
            'data': {
              'msteams': {
                'type': 'signin',
                'value': 'https://chebyshev.azurewebsites.net/tabInitTaskModule'
              }
            }
          },
          { 
            id: undefined, 
            type: 'Action.OpenUrl', 
            title: 'Action.OpenUrl', 
            url: 'https://chebyshev.azurewebsites.net/tabInitTaskModule' 
          },
          { 
            id: undefined, 
            type: 'Action.Submit', 
            title: 'Action.Submit', 
            data: { acSubmit: 3.1415926 }
          }
        ]
      };

      const expectedAttachment = {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: expectedPayload
      };

      assert.deepStrictEqual(card.toAdaptiveCard(), expectedPayload);
      assert.deepStrictEqual(card.toAttachment(), expectedAttachment);
    });

    it('Action.ShowCard can nest another AdaptiveCard', () => {
      const card = new ac.AdaptiveCard()
        .actions([{ 
          id: undefined, 
          type: 'Action.ShowCard', 
          title: 'Action.ShowCard', 
          card: new ac.AdaptiveCard()
            .body([{
              'type': 'TextBlock',
              'text': 'Hello'
            }])
            .toAdaptiveCard() 
        }]);
      
      const expectedPayload = {
        'type': 'AdaptiveCard',
        'version': '1.0',
        'actions': [
          {
            'id': undefined,
            'type': 'Action.ShowCard',
            'title': 'Action.ShowCard',
            'card': {
              'type': 'AdaptiveCard',
              'version': '1.0',
              'body': [
                {
                  'type': 'TextBlock',
                  'text': 'Hello'
                }
              ]
            }
          }
        ]
      };

      const expectedAttachment = {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: expectedPayload
      };

      assert.deepStrictEqual(card.toAdaptiveCard(), expectedPayload);
      assert.deepStrictEqual(card.toAttachment(), expectedAttachment);
    });

    it('AdaptiveCardBotBuilderAction can be used to wrap / insert bot-builder actions into raw Adaptive Card payload', () => {
      const adaptorBtn = new builder.CardAction()
        .title('SignIn')
        .type('signin')
        .value('https://chebyshev.azurewebsites.net/tabInitTaskModule');
  
      // type of IAdaptiveCard
      const payload = {
        type: 'AdaptiveCard',
        version: '1.0',
        actions: [
          new ac.AdaptiveCardBotBuilderAction()
            .title('ImBack')
            .type('imback')
            .value('hello')
            .toAdaptiveCardAction(),
          new ac.AdaptiveCardBotBuilderAction(adaptorBtn)
            .toAdaptiveCardAction()
        ]
      };

      const expectedPayload = {
        'type': 'AdaptiveCard',
        'version': '1.0',
        'actions': [
          {
            'id': undefined,
            'type': 'Action.Submit',
            'title': 'ImBack',
            'data': {
              'msteams': {
                'type': 'imback',
                'value': 'hello'
              }
            }
          },
          {
            'id': undefined,
            'type': 'Action.Submit',
            'title': 'SignIn',
            'data': {
              'msteams': {
                'type': 'signin',
                'value': 'https://chebyshev.azurewebsites.net/tabInitTaskModule'
              }
            }
          }
        ]
      };

      assert.deepStrictEqual(payload, expectedPayload);
    });
  });
});
