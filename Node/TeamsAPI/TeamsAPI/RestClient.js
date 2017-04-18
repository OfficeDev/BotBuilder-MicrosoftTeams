/*
 * Code generated by Microsoft (R) AutoRest Code Generator 1.0.1.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

/* jshint latedef:false */
/* jshint forin:false */
/* jshint noempty:false */

'use strict';

var util = require('util');
var msRest = require('ms-rest');
var ServiceClient = msRest.ServiceClient;

var models = require('../models');

/**
 * @class
 * Initializes a new instance of the RestClient class.
 * @constructor
 *
 * @param {string} [baseUri] - The base URI of the service.
 *
 * @param {object} [options] - The parameter options
 *
 * @param {Array} [options.filters] - Filters to be added to the request pipeline
 *
 * @param {object} [options.requestOptions] - Options for the underlying request object
 * {@link https://github.com/request/request#requestoptions-callback Options doc}
 *
 * @param {boolean} [options.noRetryPolicy] - If set to true, turn off default retry policy
 *
 */
function RestClient(baseUri, options) {

  if (!options) options = {};

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