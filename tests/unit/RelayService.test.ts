import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../src/rpcChannel/RpcChannel'
import { RelayService } from '../../src/services/RelayService/RelayService'
import type { serverResponse, serviceRequest } from '../../src/rpcChannel/ReqRepTypes'

// Mock dependencies
jest.mock('protobufjs', () => {
  
  const mockRoot = { 
    lookupType: jest.fn()
  } as unknown as protobuf.Root
  return {
    loadSync: jest.fn().mockReturnValue(mockRoot)
  }
})

jest.mock('../../src/rpcChannel/RpcChannel', () => {
  return {
    RpcChannel: jest.fn().mockImplementation(() => { return { callMethod: jest.fn() } })
  }
})

describe('RelayService test suite', () => {
  const relay: RelayService = new RelayService('fake_endpoint')

  afterEach(() => {
    jest.clearAllMocks(); // clear mocks after each test
  });

  // Test init
  it('should be defined', () => {
    expect(relay).toBeDefined()
    expect(protobuf.loadSync).toBeCalledTimes(2) // Twice in constructor
    expect(RpcChannel).toHaveBeenCalled()
  })

  // Test closeRelay/openRelay
  describe('call EnergizeMethod', () => {
    it('Should call an energize method and get success msg', async () => {
      // Arrange mocks
      const successMsg = 'Successfully closed relay'
      const mockMsgType = {} as unknown as protobuf.Type
      const mockResponse = {
        error: undefined,
        content: {
          content: successMsg
        }
      } as unknown as serverResponse
      const mockServiceRequest = {
        serviceName: 'RelayService',
        methodName: 'close_relay',
        requestMsg: {
            /*Empty Msg*/
        }
      } as unknown as serviceRequest
      const lookupTypeSpy = jest.spyOn(relay.serviceProtoRoot, 'lookupType').mockReturnValue(mockMsgType)
      const callMethodSpy = jest.spyOn(relay.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Call turn_on
      const result = await relay.closeRelay()

      // Assertions
      expect(lookupTypeSpy).toBeCalledTimes(2)
      expect(callMethodSpy).toHaveBeenCalledWith(mockServiceRequest, mockMsgType, mockMsgType)
      expect(result).toEqual(successMsg)
    })
    it('Call an relay energize method and get error', async () => {
      // Arrange mocks
      const mockResponse = {
        error: 'Uh oh this is an error',
        content: undefined
      } as unknown as serverResponse
      jest.spyOn(relay.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Assertions
      await expect(relay.closeRelay()).rejects.toThrow('Uh oh this is an error')
    })
  })

  describe('call getStateRelay', () => {
    it('Should call an getStateRelay and get state', async () => {
      // Arrange mocks
      const stateBool = true
      const mockMsgType = {} as unknown as protobuf.Type
      const mockResponse = {
        error: undefined,
        content: {
          stateBool
        }
      } as unknown as serverResponse
      const mockServiceRequest = {
        serviceName: 'RelayService',
        methodName: 'get_state_relay',
        requestMsg: {
          /*Empty Msg*/
        }
      } as unknown as serviceRequest
      const lookupTypeSpy = jest.spyOn(relay.serviceProtoRoot, 'lookupType').mockReturnValue(mockMsgType)
      const callMethodSpy = jest.spyOn(relay.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Call turn_on
      const result = await relay.getStateRelay()

      // Assertions
      expect(lookupTypeSpy).toBeCalledTimes(2)
      expect(callMethodSpy).toHaveBeenCalledWith(mockServiceRequest, mockMsgType, mockMsgType)
      expect(result).toEqual(stateBool)
    })
  })
})
