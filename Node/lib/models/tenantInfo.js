'use strict';
var TenantInfo = (function () {
    function TenantInfo(id) {
        this.id = id;
    }
    TenantInfo.prototype.mapper = function () {
        return {
            required: false,
            serializedName: 'TenantInfo',
            type: {
                name: 'Composite',
                className: 'TenantInfo',
                modelProperties: {
                    id: {
                        required: false,
                        serializedName: 'id',
                        type: {
                            name: 'String'
                        }
                    }
                }
            }
        };
    };
    return TenantInfo;
}());
module.exports = TenantInfo;
