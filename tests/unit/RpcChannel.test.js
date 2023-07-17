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
const protobuf = __importStar(require("protobufjs"));
const RpcChannel_1 = require("../../RpcChannel");
describe('RpcChannel', () => {
    let socketEndpoint;
    let protoRoot;
    let rpcChannel;
    beforeEach(() => {
        socketEndpoint = 'fake_endpoint';
        protoRoot = new protobuf.Root();
        // Mock type lookup
        const mockedMsgType = {
            create: jest.fn(),
            encode: jest.fn().mockReturnValueOnce({
                finish: jest.fn().mockReturnValueOnce({})
            })
        };
        jest.spyOn(protoRoot, 'lookupType').mockReturnValueOnce(mockedMsgType);
        rpcChannel = new RpcChannel_1.RpcChannel(socketEndpoint, protoRoot);
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    // Test class init
    it('should be defined', () => {
        expect(rpcChannel).toBeDefined();
    });
    describe('createRpcRequest', () => {
        it('should throw an error if method parent is null', () => {
            const method = { parent: null, name: 'SomeMethod' };
            const requestData = new Uint8Array();
            expect(() => rpcChannel.createRpcRequest(method, requestData)).toThrowError('Method parent is null. Could not find requested service.');
        });
        it('should create and return an RpcRequest message', () => {
            const serviceName = 'SomeService';
            const methodName = 'SomeMethod';
            const requestData = new Uint8Array();
            const createSpy = jest.spyOn(rpcChannel.rpc_request_type, 'create').mockReturnValueOnce({});
            const rpcRequest = rpcChannel.createRpcRequest({ parent: { name: serviceName }, name: methodName }, requestData);
            expect(createSpy).toHaveBeenCalledWith({
                serviceName: serviceName,
                methodName: methodName,
                requestProto: requestData,
            });
            expect(rpcRequest).toEqual({});
        });
        describe('sendRpcRequest', () => {
            it('should encode and send the RPC request over the socket', () => __awaiter(void 0, void 0, void 0, function* () {
                const rpcRequest = {};
                const sendSpy = jest.spyOn(rpcChannel.socket, 'send').mockResolvedValueOnce(undefined);
                yield rpcChannel.sendRpcRequest(rpcRequest);
                expect(rpcChannel.rpc_request_type.encode).toHaveBeenCalledWith(rpcRequest);
                expect(sendSpy).toHaveBeenCalledWith({});
            }));
        });
        describe('getRpcResponse', () => {
            it('should receive and return the RPC response from the server', () => __awaiter(void 0, void 0, void 0, function* () {
                const rpcResponseData = new Uint8Array();
                const receiveSpy = jest.spyOn(rpcChannel.socket, 'receive').mockResolvedValueOnce([rpcResponseData]);
                const response = yield rpcChannel.getRpcResponse();
                expect(receiveSpy).toHaveBeenCalled();
                expect(response).toBe(rpcResponseData);
            }));
        });
        describe('callMethod', () => {
            let method;
            let requestData;
            let callback;
            beforeEach(() => {
                method = { parent: { name: 'SomeService' }, name: 'SomeMethod' };
                requestData = new Uint8Array();
                callback = jest.fn();
            });
            it('should create an RPC request, send it, and invoke the callback with the response', () => __awaiter(void 0, void 0, void 0, function* () {
                const rpcRequest = {};
                const rpcResponse = new Uint8Array();
                // Mock rpcChannel methods within callMethod
                const createRpcRequestSpy = jest.spyOn(rpcChannel, 'createRpcRequest').mockReturnValueOnce(rpcRequest);
                const sendRpcRequestSpy = jest.spyOn(rpcChannel, 'sendRpcRequest').mockResolvedValueOnce(undefined);
                const getRpcResponseSpy = jest.spyOn(rpcChannel, 'getRpcResponse').mockResolvedValueOnce(rpcResponse);
                yield rpcChannel.callMethod(method, requestData, callback);
                expect(createRpcRequestSpy).toHaveBeenCalledWith(method, requestData);
                expect(sendRpcRequestSpy).toHaveBeenCalledWith(rpcRequest);
                expect(getRpcResponseSpy).toHaveBeenCalled();
                expect(callback).toHaveBeenCalledWith(null, rpcResponse);
            }));
            it('should invoke the callback with an error if an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
                const error = new Error('Some error');
                const createRpcRequestSpy = jest.spyOn(rpcChannel, 'createRpcRequest').mockImplementation(() => {
                    throw error;
                });
                yield rpcChannel.callMethod(method, requestData, callback);
                expect(createRpcRequestSpy).toHaveBeenCalledWith(method, requestData);
                expect(callback).toHaveBeenCalledWith(error);
            }));
        });
    });
});
