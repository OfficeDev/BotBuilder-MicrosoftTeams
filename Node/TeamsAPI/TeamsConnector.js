
'use strict';

var builder = require('botbuilder');
var teamsAPI = require('./TeamsAPI/teams');
var RestClient = require('./TeamsAPI/RestClient');

class TeamsConnector {

	constructor () {
		var restClient = new RestClient('https://smba.trafficmanager.net/apis');
		this.Teams = new teamsAPI(restClient);
		return this;
	}
}

builder.ChatConnector.prototype.getTeamsConnector = function () {
	return new TeamsConnector();
}

builder.ConsoleConnector.prototype.getTeamsConnector = function () {
	return new TeamsConnector();
}

module.exports = TeamsConnector;

