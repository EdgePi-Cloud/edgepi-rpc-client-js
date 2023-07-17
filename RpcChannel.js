"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcChannel = void 0;
const zmq = __importStar(require("zeromq"));
/*
NOTE: protobufjs requries that:
- the method of a service follows a convention such that the first letter of the
  method is lower case.
  i.e If "MyMethod" defined in proto file, "myMethod" would be the equivalent
- messages with fields like "abc_yo" must have convention "abcYo" for message payload
*/
class RpcChannel {
    constructor(socket_endpoint, proto_root) {
        this.socket_endpoint = socket_endpoint;
        this.socket = new zmq.Request();
        this.socket.connect(this.socket_endpoint);
        this.rpc_request_type = proto_root.lookupType("rpc.RpcRequest");
    }
    createRpcRequest(method, requestData) {
        if (method.parent === null) {
            throw new Error("Method parent is null. Could not find requested service.\
         The requested service method may not have been called correctly or was \
         incorectly initialized.");
        }
        //let rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
        // wrap client message 
        let rpc_request_data = {
            serviceName: method.parent.name,
            methodName: method.name,
            requestProto: requestData,
        };
        // create rpc message
        const rpc_request = this.rpc_request_type.create(rpc_request_data);
        return rpc_request;
    }
    sendRpcRequest(rpc_request) {
        return __awaiter(this, void 0, void 0, function* () {
            // serialize rpc request
            //const rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
            const rpc_request_buff = this.rpc_request_type.encode(rpc_request).finish();
            // send over socket
            yield this.socket.send(rpc_request_buff);
        });
    }
    getRpcResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            // get rpc response from server
            let [rpc_response_data] = yield this.socket.receive();
            return rpc_response_data;
        });
    }
    callMethod(method, requestData, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // create rpc request
                const rpc_request = this.createRpcRequest(method, requestData);
                // send rpc service request over socket
                yield this.sendRpcRequest(rpc_request);
                // wait for response from server
                const rpc_response = yield this.getRpcResponse();
                callback(null, rpc_response);
            }
            catch (error) {
                callback(error);
            }
        });
    }
}
exports.RpcChannel = RpcChannel;
