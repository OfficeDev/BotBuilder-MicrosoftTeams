let builder = require('botbuilder');
let assert = require('assert');
let lib = require('../lib/TeamsChatConnector');

describe('TeamsChatConnector', function () {

  describe('#onQuery()', function () {
    it('should receive compose extension query events', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onQuery('myCommandId', (event, query, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.queryInvokeName,
          value: {
            commandId: 'myCommandId'
          }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onQuery handler was not called');
        done();
      })
    });

    it('should fail if handlers were registered but not for the given command id', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onQuery('myCommandId', (event, query, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.queryInvokeName,
          value: {
            commandId: 'differentCommandId'
          }
        }
      ], (err, body, status) => {
        assert.ok(err, 'Dispatch succeeded even when no handler was registered for the given command id');
        done();
      })
    });

    it('should call invoke handler if no handlers were registered', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onInvoke((event, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.queryInvokeName,
          value: {
            commandId: 'myCommandId'
          }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onInvoke handler was not called');
        done();
      })
    });
  });

  describe('#onQuerySettingsUrl()', function () {
    it('should receive compose extension query settings url events', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onQuerySettingsUrl((event, query, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.querySettingUrlInvokeName,
          value: { }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onQuerySettingsUrl handler was not called');
        done();
      })
    });

    it('should call invoke handler if no onQuerySettingsUrl handler was registered', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onInvoke((event, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.querySettingUrlInvokeName,
          value: { }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onInvoke handler was not called');
        done();
      })
    });
  });

  describe('#onSettingsUpdate()', function () {
    it('should receive compose extension settings update events', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onSettingsUpdate((event, query, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.settingInvokeName,
          value: { }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onSettingsUpdate handler was not called');
        done();
      })
    });

    it('should call invoke handler if no onSettingsUpdate handler was registered', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onInvoke((event, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.settingInvokeName,
          value: { }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onInvoke handler was not called');
        done();
      })
    });
  });

  describe('#onSelectItem()', function () {
    it('should receive compose extension select item events', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onSelectItem((event, query, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.selectItemInvokeName,
          value: { }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onSelectItem handler was not called');
        done();
      })
    });

    it('should call invoke handler if no onSelectItem handler was registered', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onInvoke((event, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.selectItemInvokeName,
          value: { }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onInvoke handler was not called');
        done();
      })
    });
  });

  describe('#onO365ConnectorCardAction()', function () {
    it('should receive O365 connector card action events', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onO365ConnectorCardAction((event, query, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.o365CardActionInvokeName,
          value: { }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onO365ConnectorCardAction handler was not called');
        done();
      })
    });

    it('should call invoke handler if no onO365ConnectorCardAction handler was registered', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onInvoke((event, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.o365CardActionInvokeName,
          value: { }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onInvoke handler was not called');
        done();
      })
    });
  });

  describe('#onSigninStateVerification()', function () {
    it('should receive signin state verification events', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onSigninStateVerification((event, query, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.signinStateVerificationInvokeName,
          value: { }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onSigninStateVerification handler was not called');
        done();
      })
    });

    it('should call invoke handler if no onSigninStateVerification handler was registered', function (done) {
      let connector = new lib.TeamsChatConnector({});

      let wasHandlerCalled = false;
      connector.onInvoke((event, cb) => {
        wasHandlerCalled = true;
        cb(null, {}, 200);
      });

      connector.onDispatchEvents([
        {
          type: 'invoke',
          name: lib.TeamsChatConnector.signinStateVerificationInvokeName,
          value: { }
        }
      ], (err, body, status) => {
        assert.ok(!err, 'An error occurred: ' + err);
        assert.ok(wasHandlerCalled, 'The registered onInvoke handler was not called');
        done();
      })
    });
  });

});