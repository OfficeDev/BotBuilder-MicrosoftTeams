var builder = require('botbuilder');
var assert = require('assert');
var lib = require('../lib/ConversationUpdate');

describe('Team events', function () {
  const teamInfo = {
    id: "19:1a92e3e515b8474c8a40e1e16fd3050c@thread.skype"
  };
  const channelInfo = {
    id: "19:6b349485a2564bf29b3c575686ae4430@thread.skype"
  };
  const tenantInfo = {
    id: "xxx"
  };

  describe('MembersAddedEvent', function (done) {
    it('should have correct type', () => {
      assert(lib.MembersAddedEvent.eventType === lib.TeamEventType.MembersAdded); 
    });

    it('should populate properties', () => {
      const users = [
        { id: "id1", name: "Name 1" },
        { id: "id2", name: "Name 2" },
      ];
      const event = new lib.MembersAddedEvent(users, teamInfo, tenantInfo);
      assert(event.eventType === lib.MembersAddedEvent.eventType);
      assert(event.membersAdded === users);
      assert(event.team === teamInfo);
      assert(event.tenant === tenantInfo);
    });
  });

  describe('MembersRemovedEvent', function (done) {
    it('should have correct type', () => {
      assert(lib.MembersRemovedEvent.eventType === lib.TeamEventType.MembersRemoved); 
    });

    it('should populate properties', () => {
      const users = [
        { id: "id1", name: "Name 1" },
        { id: "id2", name: "Name 2" },
      ];
      const event = new lib.MembersRemovedEvent(users, teamInfo, tenantInfo);
      assert(event.eventType === lib.MembersRemovedEvent.eventType);
      assert(event.membersRemoved === users);
      assert(event.team === teamInfo);
      assert(event.tenant === tenantInfo);
    });
  });

  describe('ChannelCreatedEvent', function (done) {
    it('should have correct type', () => {
      assert(lib.ChannelCreatedEvent.eventType === lib.TeamEventType.ChannelCreated); 
    });

    it('should populate properties', () => {
      const newChannel = Object.assign({ name: "New Channel" }, channelInfo);
      const event = new lib.ChannelCreatedEvent(newChannel, teamInfo, tenantInfo);
      assert(event.eventType === lib.ChannelCreatedEvent.eventType);
      assert(event.channel === newChannel);
      assert(event.team === teamInfo);
      assert(event.tenant === tenantInfo);
    });
  });

  describe('ChannelDeletedEvent', function (done) {
    it('should have correct type', () => {
      assert(lib.ChannelDeletedEvent.eventType === lib.TeamEventType.ChannelDeleted); 
    });

    it('should populate properties', () => {
      const event = new lib.ChannelDeletedEvent(channelInfo, teamInfo, tenantInfo);
      assert(event.eventType === lib.ChannelDeletedEvent.eventType);
      assert(event.channel === channelInfo);
      assert(event.team === teamInfo);
      assert(event.tenant === tenantInfo);
    });
  });

  describe('ChannelRenamedEvent', function (done) {
    it('should have correct type', () => {
      assert(lib.ChannelRenamedEvent.eventType === lib.TeamEventType.ChannelRenamed); 
    });

    it('should populate properties', () => {
      const renamedChannel = Object.assign({ name: "New Channel Name" }, channelInfo);
      const event = new lib.ChannelRenamedEvent(renamedChannel, teamInfo, tenantInfo);
      assert(event.eventType === lib.ChannelRenamedEvent.eventType);
      assert(event.channel === renamedChannel);
      assert(event.team === teamInfo);
      assert(event.tenant === tenantInfo);
    });
  });

  describe('TeamRenamedEvent', function (done) {
    it('should have correct type', () => {
      assert(lib.TeamRenamedEvent.eventType === lib.TeamEventType.TeamRenamed); 
    });

    it('should populate properties', () => {
      const renamedTeam = Object.assign({ name: "New Team Name" }, teamInfo);
      const event = new lib.TeamRenamedEvent(renamedTeam, tenantInfo);
      assert(event.eventType === lib.TeamRenamedEvent.eventType);
      assert(event.team === renamedTeam);
      assert(event.tenant === tenantInfo);
    });
  });

});
