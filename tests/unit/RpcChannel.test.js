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
// Import required modules and types
const protobuf = __importStar(require("protobufjs"));
const RpcChannel_1 = require("../../src/rpcChannel/RpcChannel");
// Test suite for RpcChannel class
describe('RpcChannel', () => {
    // Declare variables to be used in tests
    let socketEndpoint;
    let protoRoot;
    let rpcChannel;
    let mockedMsgType;
    // Set up before each test
    beforeEach(() => {
        // Initialize test data
        socketEndpoint = 'fake_endpoint';
        protoRoot = new protobuf.Root();
        // Mock protobuf.Type to be used in RpcChannel
        mockedMsgType = {
            create: jest.fn(),
            encode: jest.fn().mockReturnValueOnce({ finish: jest.fn().mockReturnValueOnce({}) }),
            decode: jest.fn()
        };
        // Mock the 'lookupType' method in protoRoot to return mockedMsgType
        jest.spyOn(protoRoot, 'lookupType').mockReturnValue(mockedMsgType);
        // Initialize RpcChannel instance with the mock data
        rpcChannel = new RpcChannel_1.RpcChannel(socketEndpoint, protoRoot);
    });
    // Clean up after each test
    afterEach(() => {
        jest.resetAllMocks();
    });
    // Test case: RpcChannel instance should be defined
    it('should be defined', () => {
        expect(rpcChannel).toBeDefined();
    });
    // Test suite for createRpcRequest method
    describe('createRpcRequest', () => {
        // Test case: createRpcRequest should create and return an RpcRequest message
        it('should create and return an RpcRequest message', () => {
            // Arrange mocks
            const mockRequest = {};
            const mockRpcRequest = {};
            const requestCreateSpy = jest.spyOn(mockedMsgType, 'create').mockReturnValueOnce(mockRequest);
            const rpcRequestCreateSpy = jest.spyOn(rpcChannel.rpcRequestType, 'create').mockReturnValueOnce(mockRpcRequest);
            // Call createRpcRequest with mock data
            const mockServiceReq = { serviceName: 'service', methodName: 'method', requestMsg: {} };
            const rpcRequest = rpcChannel.createRpcRequest(mockServiceReq, mockedMsgType);
            // Assertions
            expect(requestCreateSpy).toHaveBeenCalledWith(mockServiceReq.requestMsg);
            expect(mockedMsgType.encode).toHaveBeenCalledWith(mockRequest);
            expect(rpcRequestCreateSpy).toHaveBeenCalled();
            expect(rpcRequest).toEqual(mockRpcRequest);
        });
    });
    // Test suite for sendRpcRequest method
    describe('sendRpcRequest', () => {
        // Test case: sendRpcRequest should encode and send the RPC request over the socket
        it('should encode and send the RPC request over the socket', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange mocks
            const rpcRequest = {};
            const sendSpy = jest.spyOn(rpcChannel.socket, 'send').mockResolvedValueOnce(undefined);
            // call sendRpcRequest
            yield rpcChannel.sendRpcRequest(rpcRequest);
            // Assertions
            expect(rpcChannel.rpcRequestType.encode).toHaveBeenCalledWith(rpcRequest);
            expect(sendSpy).toHaveBeenCalledWith({});
        }));
    });
    // Test suite for getRpcResponse method
    describe('getRpcResponse', () => {
        // Test case: getRpcResponse should receive and return the RPC response from the server
        it('should receive and return the RPC response from the server', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange mocks
            const mockRpcResponseData = new Uint8Array();
            const mockRpcResponse = {};
            const receiveSpy = jest.spyOn(rpcChannel.socket, 'receive').mockResolvedValueOnce([mockRpcResponseData]);
            const decodeSpy = jest.spyOn(rpcChannel.rpcRequestType, 'decode').mockReturnValue(mockRpcResponse);
            // Call getRpcResponse
            const response = yield rpcChannel.getRpcResponse();
            // Assertions
            expect(receiveSpy).toHaveBeenCalled();
            expect(decodeSpy).toHaveBeenCalledWith(mockRpcResponseData);
            expect(response).toBe(mockRpcResponse);
        }));
    });
    // Test suite for createServerResponse method
    describe('createServerResponse', () => {
        // Test case 1: createServerResponse should return the response object with content when there is no error and valid responseProto
        it('should return the response object with content when there is no error and valid responseProto', () => {
            // Arrange mocks
            const mockRpcResponse = {
                responseProto: Buffer.from('protobuf_response_data'),
                errorCode: undefined,
                errorMsg: undefined
            };
            const mockServerResponseMsg = { someField: 'someValue' };
            const decodeSpy = jest.spyOn(mockedMsgType, 'decode').mockReturnValueOnce(mockServerResponseMsg);
            // Call the createServerResponse with the mocked objects
            const result = rpcChannel.createServerResponse(mockedMsgType, mockRpcResponse);
            // Assertions
            expect(decodeSpy).toHaveBeenCalledWith(mockRpcResponse.responseProto);
            expect(result).toEqual({
                error: undefined,
                content: mockServerResponseMsg
            });
        });
        // Test case 2: createServerResponse should return the response object with an error message when errorCode and errorMsg are provided
        it('should return the response object with an error message when errorCode and errorMsg are provided', () => {
            // Mock the RpcResponse object
            const mockRpcResponse = {
                responseProto: undefined,
                errorCode: 0,
                errorMsg: 'Bad message data'
            };
            // Call the createServerResponse with the mocked objects
            const result = rpcChannel.createServerResponse(mockedMsgType, mockRpcResponse);
            // Assertions
            expect(mockedMsgType.decode).not.toHaveBeenCalled();
            expect(result).toEqual({
                error: 'Error 0: Bad message data',
                content: undefined
            });
        });
    });
});
