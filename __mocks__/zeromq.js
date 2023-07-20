"use strict";
class MockRequest {
    constructor() {
        // Do nothing
    }
    connect(_mock_endpoint) {
        // Do nothing; mock the connect method
    }
    send(_request_data) {
        // Do nothing
    }
    receive() {
        // Do nothing
    }
}
const zeromq = {
    Request: MockRequest, // Use the custom MockRequest instead of zmq.Request
};
module.exports = zeromq;
