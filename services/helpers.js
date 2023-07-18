"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateService = void 0;
const protobufjs_1 = require("protobufjs");
const RpcChannel_1 = __importDefault(require("../RpcChannel"));
function generateService(serviceName) {
    // Create rpc channel instance
    const host = 'ipc:///tmp/edgepi.pipe';
    const rpcRoot = (0, protobufjs_1.loadSync)('../../protos/rpc.proto'); // Unhard code this
    const rpcChannel = new RpcChannel_1.default(host, rpcRoot);
    // create rpcImpl for protobuf service creation
    const rpcImpl = (method, requestData, callback) => {
        void rpcChannel.callMethod(method, requestData, callback);
    };
    // create service
    const tcRoot = (0, protobufjs_1.loadSync)('../../protos/tc.proto'); // Unhardcode this
    const Service = tcRoot.lookupService('TcService');
    const service = Service.create(rpcImpl, false, false);
    return service;
}
exports.generateService = generateService;
