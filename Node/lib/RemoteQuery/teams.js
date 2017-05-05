'use strict';
var util = require('util');
var msRest = require('ms-rest');
var WebResource = msRest.WebResource;
var Teams = (function () {
    function Teams(client) {
        this.client = client;
    }
    return Teams;
}());
Teams.prototype.fetchChannelList = function (teamsId, options, callback) {
    var client = this.client;
    if (!callback && typeof options === 'function') {
        callback = options;
        options = null;
    }
    if (!callback) {
        throw new Error('callback cannot be null.');
    }
    try {
        if (teamsId === null || teamsId === undefined || typeof teamsId.valueOf() !== 'string') {
            throw new Error('teamsId cannot be null or undefined and it must be of type string.');
        }
    }
    catch (error) {
        return callback(error);
    }
    var baseUrl = this.client.baseUri;
    var requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'v3/teams/{teamsId}/conversations';
    requestUrl = requestUrl.replace('{teamsId}', encodeURIComponent(teamsId));
    var httpRequest = new WebResource();
    httpRequest.method = 'GET';
    httpRequest.headers = {};
    httpRequest.url = requestUrl;
    if (options) {
        for (var headerName in options['customHeaders']) {
            if (options['customHeaders'].hasOwnProperty(headerName)) {
                httpRequest.headers[headerName] = options['customHeaders'][headerName];
            }
        }
    }
    httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
    httpRequest.body = null;
    return client.pipeline(httpRequest, function (err, response, responseBody) {
        if (err) {
            return callback(err);
        }
        var statusCode = response.statusCode;
        if (statusCode !== 200) {
            var error = new Error(responseBody);
            error.statusCode = response.statusCode;
            error.request = msRest.stripRequest(httpRequest);
            error.response = msRest.stripResponse(response);
            if (responseBody === '')
                responseBody = null;
            var parsedErrorResponse;
            try {
                parsedErrorResponse = JSON.parse(responseBody);
                if (parsedErrorResponse) {
                    var internalError = null;
                    if (parsedErrorResponse.error)
                        internalError = parsedErrorResponse.error;
                    error.code = internalError ? internalError.code : parsedErrorResponse.code;
                    error.message = internalError ? internalError.message : parsedErrorResponse.message;
                }
            }
            catch (defaultError) {
                error.message = util.format('Error "%s" occurred in deserializing the responseBody ' +
                    '- "%s" for the default response.', defaultError.message, responseBody);
                return callback(error);
            }
            return callback(error);
        }
        var result = null;
        if (responseBody === '')
            responseBody = null;
        if (statusCode === 200) {
            var parsedResponse = null;
            try {
                parsedResponse = JSON.parse(responseBody);
                result = JSON.parse(responseBody);
                if (parsedResponse !== null && parsedResponse !== undefined) {
                    var resultMapper = {
                        required: false,
                        serializedName: 'parsedResponse',
                        type: {
                            name: 'Object'
                        }
                    };
                    result = client.deserialize(resultMapper, parsedResponse, 'result');
                }
            }
            catch (error) {
                var deserializationError = new Error(util.format('Error "%s" occurred in deserializing the responseBody - "%s"', error, responseBody));
                deserializationError.request = msRest.stripRequest(httpRequest);
                deserializationError.response = msRest.stripResponse(response);
                return callback(deserializationError);
            }
        }
        return callback(null, result['conversations'], httpRequest, response);
    });
};
Teams.prototype.fetchMemberList = function (conversationId, options, callback) {
    var client = this.client;
    if (!callback && typeof options === 'function') {
        callback = options;
        options = null;
    }
    if (!callback) {
        throw new Error('callback cannot be null.');
    }
    try {
        if (conversationId === null || conversationId === undefined || typeof conversationId.valueOf() !== 'string') {
            throw new Error('conversationId cannot be null or undefined and it must be of type string.');
        }
    }
    catch (error) {
        return callback(error);
    }
    var baseUrl = this.client.baseUri;
    var requestUrl = baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'v3/conversations/{conversationId}/members';
    requestUrl = requestUrl.replace('{conversationId}', encodeURIComponent(conversationId));
    var httpRequest = new WebResource();
    httpRequest.method = 'GET';
    httpRequest.headers = {};
    httpRequest.url = requestUrl;
    if (options) {
        for (var headerName in options['customHeaders']) {
            if (options['customHeaders'].hasOwnProperty(headerName)) {
                httpRequest.headers[headerName] = options['customHeaders'][headerName];
            }
        }
    }
    httpRequest.headers['Content-Type'] = 'application/json; charset=utf-8';
    httpRequest.body = null;
    return client.pipeline(httpRequest, function (err, response, responseBody) {
        if (err) {
            return callback(err);
        }
        var statusCode = response.statusCode;
        if (statusCode !== 200) {
            var error = new Error(responseBody);
            error.statusCode = response.statusCode;
            error.request = msRest.stripRequest(httpRequest);
            error.response = msRest.stripResponse(response);
            if (responseBody === '')
                responseBody = null;
            var parsedErrorResponse = void 0;
            try {
                parsedErrorResponse = JSON.parse(responseBody);
                if (parsedErrorResponse) {
                    var internalError = null;
                    if (parsedErrorResponse.error)
                        internalError = parsedErrorResponse.error;
                    error.code = internalError ? internalError.code : parsedErrorResponse.code;
                    error.message = internalError ? internalError.message : parsedErrorResponse.message;
                }
            }
            catch (defaultError) {
                error.message = "Error \"" + defaultError.message + "\" occurred in deserializing the responseBody " +
                    ("- \"" + responseBody + "\" for the default response.");
                return callback(error);
            }
            return callback(error);
        }
        var result = null;
        if (responseBody === '')
            responseBody = null;
        if (statusCode === 200) {
            var parsedResponse = null;
            try {
                parsedResponse = JSON.parse(responseBody);
                result = JSON.parse(responseBody);
                if (parsedResponse !== null && parsedResponse !== undefined) {
                    var resultMapper = {
                        required: false,
                        serializedName: 'parsedResponse',
                        type: {
                            name: 'Object'
                        }
                    };
                    result = client.deserialize(resultMapper, parsedResponse, 'result');
                }
            }
            catch (error) {
                var deserializationError = new Error("Error " + error + " occurred in deserializing the responseBody - " + responseBody);
                deserializationError.request = msRest.stripRequest(httpRequest);
                deserializationError.response = msRest.stripResponse(response);
                return callback(deserializationError);
            }
        }
        return callback(null, result, httpRequest, response);
    });
};
module.exports = Teams;
