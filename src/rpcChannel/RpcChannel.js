"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcChannel = void 0;
var zmq = require("zeromq");
var RpcChannel = /** @class */ (function () {
    function RpcChannel(socketEndPoint, protoRoot) {
        this.socket_endpoint = socketEndPoint;
        this.socket = new zmq.Request();
        this.socket.connect(this.socket_endpoint);
        this.rpcRequestType = protoRoot.lookupType('rpc.RpcRequest');
        this.rpcResponseType = protoRoot.lookupType('rpc.RpcResponse');
    }
    RpcChannel.prototype.createRpcRequest = function (serviceReq, requestType) {
        // Serialize request message
        var request = requestType.create(serviceReq.requestMsg);
        var requestProto = requestType.encode(request);
        // Should catch some errors here
        // Wrap request in RpcRequest message. Create rpc request
        var rpcRequestProps = {
            serviceName: serviceReq.serviceName,
            methodName: serviceReq.methodName,
            requestProto: requestProto
        };
        var rpcRequest = this.rpcRequestType.create(rpcRequestProps);
        return rpcRequest;
    };
    RpcChannel.prototype.sendRpcRequest = function (rpcRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var rpcRequestBuff;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rpcRequestBuff = this.rpcRequestType.encode(rpcRequest).finish();
                        // send over socket
                        return [4 /*yield*/, this.socket.send(rpcRequestBuff)];
                    case 1:
                        // send over socket
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RpcChannel.prototype.getRpcResponse = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rpcResponseData, rpcResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.socket.receive()
                        // decode
                    ];
                    case 1:
                        rpcResponseData = (_a.sent())[0];
                        rpcResponse = this.rpcResponseType.decode(rpcResponseData);
                        return [2 /*return*/, rpcResponse];
                }
            });
        });
    };
    RpcChannel.prototype.createServerResponse = function (responseType, rpcResponse) {
        // deserialize server response
        var serverResponseMessage = (rpcResponse.responseProto !== undefined)
            ? responseType.decode(rpcResponse.responseProto)
            : undefined;
        // populate response object
        var errorMsg = (rpcResponse.errorCode !== undefined && rpcResponse.errorMsg !== undefined)
            ? "Error ".concat(rpcResponse.errorCode, ": ").concat(rpcResponse.errorMsg)
            : undefined;
        var responseObj = {
            error: errorMsg,
            content: serverResponseMessage
        };
        return responseObj;
    };
    RpcChannel.prototype.callMethod = function (serviceReq, requestType, responseType) {
        return __awaiter(this, void 0, void 0, function () {
            var rpcRequest, rpcResponse, serverResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rpcRequest = this.createRpcRequest(serviceReq, requestType);
                        // send rpc service request over socket
                        return [4 /*yield*/, this.sendRpcRequest(rpcRequest)
                            // wait for rpc response from server
                        ];
                    case 1:
                        // send rpc service request over socket
                        _a.sent();
                        return [4 /*yield*/, this.getRpcResponse()
                            // create a server response
                        ];
                    case 2:
                        rpcResponse = _a.sent();
                        serverResponse = this.createServerResponse(responseType, rpcResponse);
                        // finish
                        return [2 /*return*/, serverResponse];
                }
            });
        });
    };
    return RpcChannel;
}());
exports.RpcChannel = RpcChannel;
