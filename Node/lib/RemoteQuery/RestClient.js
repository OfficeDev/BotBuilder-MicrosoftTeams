'use strict';
var util = require('util');
var msRest = require('ms-rest');
var ServiceClient = msRest.ServiceClient;
var models = require('../models');
function RestClient(baseUri, options) {
    if (!options)
        options = {};
    RestClient['super_'].call(this, null, options);
    this.baseUri = baseUri;
    if (!this.baseUri) {
        this.baseUri = 'https://api.botframework.com';
    }
    var packageInfo = this.getPackageJsonInfo(__dirname);
    this.addUserAgentInfo(util.format('%s/%s', packageInfo.name, packageInfo.version));
    this.models = models;
    msRest.addSerializationMixin(this);
    return this;
}
util.inherits(RestClient, ServiceClient);
module.exports = RestClient;
