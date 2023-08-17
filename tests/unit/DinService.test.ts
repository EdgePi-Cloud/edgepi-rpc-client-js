import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../src/rpcChannel/RpcChannel'
import { DinService } from '../../src/services/DinService/DinService'
import { DinPins } from '../../src/services/DinService/DinPins'
import type { serverResponse, serviceRequest } from '../../src/rpcChannel/ReqRepTypes'

// Mock dependencies
jest.mock('protobufjs', () => {
  const mockProtoEnums = {
   values:{
      protoEnum: {
        DIN1: 0,
        DIN2: 1,
        DIN3: 2,
        DIN4: 3,
        DIN5: 4,
        DIN6: 5,
        DIN7: 6,
        DIN8: 7,
      }
    }
  }
  const mockRoot = { 
    lookupType: jest.fn() , 
    lookupEnum: jest.fn().mockReturnValue(mockProtoEnums)
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

describe('DinService test suite', () => {
  const din: DinService = new DinService('fake_endpoint')

  // Test init
  it('should be defined', () => {
    expect(din).toBeDefined()
    expect(protobuf.loadSync).toBeCalledTimes(3) // Twice in constructor and once in DinPins
    expect(RpcChannel).toHaveBeenCalled()
  })

  // Test setDoutState
  describe('call digitalInputState', () => {
    it('Call digitalInputState and get state', async () => {
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
        serviceName: 'DinService',
        methodName: 'digital_input_state',
        requestMsg: {
          dinPin: DinPins.DIN1
        }
      } as unknown as serviceRequest
      const lookupTypeSpy = jest.spyOn(din.serviceProtoRoot, 'lookupType').mockReturnValue(mockMsgType)
      const callMethodSpy = jest.spyOn(din.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Call set_dout_state
      const result = await din.digital_input_state(DinPins.DIN1)

      // Assertions
      expect(lookupTypeSpy).toBeCalledTimes(2)
      expect(callMethodSpy).toHaveBeenCalledWith(mockServiceRequest, mockMsgType, mockMsgType)
      expect(result).toEqual(stateBool)
    })
    it('Call set_dout_state and get error', async () => {
      // Arrange mocks
      const mockResponse = {
        error: 'Uh oh this is an error',
        content: undefined
      } as unknown as serverResponse
      jest.spyOn(din.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Assertions
      await expect(din.digital_input_state(DinPins.DIN1)).rejects.toThrow('Uh oh this is an error')
    })
  })
})
