"use strict";
var sprintf = require("sprintf-js");
function clone(obj) {
    var cpy = {};
    if (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                cpy[key] = obj[key];
            }
        }
    }
    return cpy;
}
exports.clone = clone;
function copyTo(frm, to) {
    if (frm) {
        for (var key in frm) {
            if (frm.hasOwnProperty(key)) {
                if (typeof to[key] === 'function') {
                    to[key](frm[key]);
                }
                else {
                    to[key] = frm[key];
                }
            }
        }
    }
}
exports.copyTo = copyTo;
function copyFieldsTo(frm, to, fields) {
    if (frm && to) {
        fields.split('|').forEach(function (f) {
            if (frm.hasOwnProperty(f)) {
                if (typeof to[f] === 'function') {
                    to[f](frm[f]);
                }
                else {
                    to[f] = frm[f];
                }
            }
        });
    }
}
exports.copyFieldsTo = copyFieldsTo;
function moveFieldsTo(frm, to, fields) {
    if (frm && to) {
        for (var f in fields) {
            if (frm.hasOwnProperty(f)) {
                if (typeof to[f] === 'function') {
                    to[fields[f]](frm[f]);
                }
                else {
                    to[fields[f]] = frm[f];
                }
                delete frm[f];
            }
        }
    }
}
exports.moveFieldsTo = moveFieldsTo;
function toDate8601(date) {
    return sprintf.sprintf('%04d-%02d-%02d', date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}
exports.toDate8601 = toDate8601;
