// Import required modules and types
import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../src/rpcChannel/RpcChannel'
import type { RpcResponse, serviceRequest } from '../../src/types/types'

// Test suite for RpcChannel class
describe('RpcChannel', () => {
  // Declare variables to be used in tests
  let socketEndpoint: string
  let protoRoot: protobuf.Root
  let rpcChannel: RpcChannel
  let mockedMsgType: protobuf.Type

  // Set up before each test
  beforeEach(() => {
    // Initialize test data
    socketEndpoint = 'fake_endpoint'
    protoRoot = new protobuf.Root()

    // Mock protobuf.Type to be used in RpcChannel
    mockedMsgType = {
      create: jest.fn(),
      encode: jest.fn().mockReturnValueOnce({ finish: jest.fn().mockReturnValueOnce({}) }),
      decode: jest.fn()
    } as unknown as protobuf.Type

    // Mock the 'lookupType' method in protoRoot to return mockedMsgType
    jest.spyOn(protoRoot, 'lookupType').mockReturnValue(mockedMsgType)

    // Initialize RpcChannel instance with the mock data
    rpcChannel = new RpcChannel(socketEndpoint, protoRoot)
  })

  // Clean up after each test
  afterEach(() => {
    jest.resetAllMocks()
  })

  // Test case: RpcChannel instance should be defined
  it('should be defined', () => {
    expect(rpcChannel).toBeDefined()
  })

  // Test suite for createRpcRequest method
  describe('createRpcRequest', () => {
    // Test case: createRpcRequest should create and return an RpcRequest message
    it('should create and return an RpcRequest message', () => {
      // Arrange mocks
      const mockRequest: protobuf.Message = {} as unknown as protobuf.Message
      const mockRpcRequest: protobuf.Message = {} as unknown as protobuf.Message
      const requestCreateSpy = jest.spyOn(mockedMsgType, 'create').mockReturnValueOnce(mockRequest)
      const rpcRequestCreateSpy = jest.spyOn(rpcChannel.rpcRequestType, 'create').mockReturnValueOnce(mockRpcRequest)

      // Call createRpcRequest with mock data
      const mockServiceReq: serviceRequest = { serviceName: 'service', methodName: 'method', requestMsg: {} }
      const rpcRequest = rpcChannel.createRpcRequest(mockServiceReq, mockedMsgType)

      // Assertions
      expect(requestCreateSpy).toHaveBeenCalledWith(mockServiceReq.requestMsg)
      expect(mockedMsgType.encode).toHaveBeenCalledWith(mockRequest)
      expect(rpcRequestCreateSpy).toHaveBeenCalled()
      expect(rpcRequest).toEqual(mockRpcRequest)
    })
  })

  // Test suite for sendRpcRequest method
  describe('sendRpcRequest', () => {
    // Test case: sendRpcRequest should encode and send the RPC request over the socket
    it('should encode and send the RPC request over the socket', async () => {
      // Arrange mocks
      const rpcRequest: protobuf.Message = {} as unknown as protobuf.Message
      const sendSpy = jest.spyOn(rpcChannel.socket, 'send').mockResolvedValueOnce(undefined)

      // call sendRpcRequest
      await rpcChannel.sendRpcRequest(rpcRequest)

      // Assertions
      expect(rpcChannel.rpcRequestType.encode).toHaveBeenCalledWith(rpcRequest)
      expect(sendSpy).toHaveBeenCalledWith({})
    })
  })

  // Test suite for getRpcResponse method
  describe('getRpcResponse', () => {
    // Test case: getRpcResponse should receive and return the RPC response from the server
    it('should receive and return the RPC response from the server', async () => {
      // Arrange mocks
      const mockRpcResponseData = new Uint8Array() as Buffer
      const mockRpcResponse: protobuf.Message = {} as unknown as protobuf.Message
      const receiveSpy = jest.spyOn(rpcChannel.socket, 'receive').mockResolvedValueOnce([mockRpcResponseData])
      const decodeSpy = jest.spyOn(rpcChannel.rpcRequestType, 'decode').mockReturnValue(mockRpcResponse)

      // Call getRpcResponse
      const response = await rpcChannel.getRpcResponse()

      // Assertions
      expect(receiveSpy).toHaveBeenCalled()
      expect(decodeSpy).toHaveBeenCalledWith(mockRpcResponseData)
      expect(response).toBe(mockRpcResponse)
    })
  })

  // Test suite for createServerResponse method
  describe('createServerResponse', () => {
    // Test case 1: createServerResponse should return the response object with content when there is no error and valid responseProto
    it('should return the response object with content when there is no error and valid responseProto', () => {
      // Arrange mocks
      const mockRpcResponse: RpcResponse = {
        responseProto: Buffer.from('protobuf_response_data'),
        errorCode: 0,
        errorMsg: null
      } as unknown as RpcResponse

      const mockServerResponseMsg = { someField: 'someValue' } as unknown as protobuf.Message
      const decodeSpy = jest.spyOn(mockedMsgType, 'decode').mockReturnValueOnce(mockServerResponseMsg)

      // Call the createServerResponse with the mocked objects
      const result = rpcChannel.createServerResponse(mockedMsgType, mockRpcResponse)

      // Assertions
      expect(decodeSpy).toHaveBeenCalledWith(mockRpcResponse.responseProto)
      expect(result).toEqual({
        error: undefined,
        content: mockServerResponseMsg
      })
    })

    // Test case 2: createServerResponse should return the response object with an error message when errorCode and errorMsg are provided
    it('should return the response object with an error message when errorCode and errorMsg are provided', () => {
      // Mock the RpcResponse object
      const mockRpcResponse: RpcResponse = {
        responseProto: null,
        errorCode: 0,
        errorMsg: 'Bad message data'
      } as unknown as RpcResponse

      // Call the createServerResponse with the mocked objects
      const result = rpcChannel.createServerResponse(mockedMsgType, mockRpcResponse)

      // Assertions
      expect(mockedMsgType.decode).not.toHaveBeenCalled()
      expect(result).toEqual({
        error: 'Error 0: Bad message data',
        content: undefined
      })
    })
  })
})
