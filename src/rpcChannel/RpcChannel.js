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
class RpcChannel {
    constructor(socketEndPoint, rpcProtoRoot) {
        this.socket_endpoint = socketEndPoint;
        this.socket = new zmq.Request();
        this.socket.connect(this.socket_endpoint);
        this.rpcRequestType = rpcProtoRoot.lookupType('rpc.RpcRequest');
        this.rpcResponseType = rpcProtoRoot.lookupType('rpc.RpcResponse');
    }
    createRpcRequest(serviceReq, requestType) {
        // Serialize request message
        const request = requestType.create(serviceReq.requestMsg);
        const requestProto = requestType.encode(request).finish();
        // Should catch some errors here
        // Wrap request in RpcRequest message. Create rpc request
        const rpcRequestProps = {
            serviceName: serviceReq.serviceName,
            methodName: serviceReq.methodName,
            requestProto
        };
        const rpcRequest = this.rpcRequestType.create(rpcRequestProps);
        return rpcRequest;
    }
    sendRpcRequest(rpcRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            // serialize rpc request
            // const rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
            const rpcRequestBuff = this.rpcRequestType.encode(rpcRequest).finish();
            // send over socket
            yield this.socket.send(rpcRequestBuff);
        });
    }
    getRpcResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            // get rpc response from server
            const [rpcResponseData] = yield this.socket.receive();
            // decode
            const rpcResponse = this.rpcResponseType.decode(rpcResponseData);
            return rpcResponse;
        });
    }
    createServerResponse(responseType, rpcResponse) {
        // deserialize server response
        const serverResponseMessage = (rpcResponse.responseProto !== undefined)
            ? responseType.decode(rpcResponse.responseProto)
            : undefined;
        // populate response object
        const errorMsg = (rpcResponse.errorCode !== undefined && rpcResponse.errorMsg !== undefined)
            ? `Error ${rpcResponse.errorCode}: ${rpcResponse.errorMsg}`
            : undefined;
        const serverResponse = {
            error: errorMsg,
            content: serverResponseMessage
        };
        return serverResponse;
    }
    callMethod(serviceReq, requestType, responseType) {
        return __awaiter(this, void 0, void 0, function* () {
            // create rpc request
            const rpcRequest = this.createRpcRequest(serviceReq, requestType);
            // send rpc service request over socket
            yield this.sendRpcRequest(rpcRequest);
            // wait for rpc response from server
            const rpcResponse = yield this.getRpcResponse();
            // create a server response
            const serverResponse = this.createServerResponse(responseType, rpcResponse);
            // finish
            return serverResponse;
        });
    }
}
exports.RpcChannel = RpcChannel;
