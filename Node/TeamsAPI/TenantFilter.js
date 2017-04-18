'use strict';

var builder = require('botbuilder');
var teamsAPI = require('./TeamsAPI/teams');
var RestClient = require('./TeamsAPI/RestClient');
var teamsHelper = require('./TeamsActivityHelper');

class TenantFilter {
	constructor (allowedTenants) {
		this.allowedTenants = allowedTenants;
	}
}

TenantFilter.prototype.isAllowedTenant = function(tenantId) {
		if (tenantId && this.allowedTenants) {
			return this.allowedTenants.indexOf(tenantId) > -1;
		}

		return false;
	}

builder.ChatConnector.prototype.listenAllowedTenant = function (tenantFilter) {
	return _listenAllowedTenant(this, tenantFilter);
}

builder.ConsoleConnector.prototype.listenAllowedTenant = function (tenantFilter) {
	return _listenAllowedTenant(this, tenantFilter);
}

var _listenAllowedTenant = function (connector, tenantFilter) {
	return (req, res) => {
        if (req.body) {
            connector.verifyBotFramework(req, res);
        } else {
            var requestData = '';
            req.on('data', (chunk) => {
                requestData += chunk
            });
            req.on('end', () => {
                req.body = JSON.parse(requestData);
                if (req.body && req.body.channelData) {
                	var channelData = req.body.channelData;
                	if (channelData.tenant && channelData.tenant.id) {
                		var tenantId = channelData.tenant.id;
                		if (!tenantFilter.isAllowedTenant(tenantId)) {
                			console.log('Tenant: '+tenantId+' not allowed. Please update tenant filter.')
                			return res.end();
                		}
                	}
                }
                connector.verifyBotFramework(req, res);
            });
        }
    };
}

module.exports = TenantFilter;
