import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../src/rpcChannel/RpcChannel'
import { DoutService } from '../../src/services/DoutService/DoutService'
import { DoutPins } from '../../src/services/DoutService/DoutPins'
import { DoutTriState } from '../../src/services/DoutService/DoutStates'
import type { serverResponse, serviceRequest } from '../../src/rpcChannel/ReqRepTypes'

// Mock dependencies
jest.mock('protobufjs', () => {
  const mockProtoEnums = {
   values:{
      protoEnum: {
        DOUT1: 0,
        DOUT2: 1,
        DOUT3: 2,
        DOUT4: 3,
        DOUT5: 4,
        DOUT6: 5,
        DOUT7: 6,
        DOUT8: 7,
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

describe('DoutService test suite', () => {
  const dout: DoutService = new DoutService('fake_endpoint')

  // Test init
  it('should be defined', () => {
    expect(dout).toBeDefined()
    expect(protobuf.loadSync).toBeCalledTimes(4) // Twice in constructor and once in DoutPins and DoutState
    expect(RpcChannel).toHaveBeenCalled()
  })

  // Test setDoutState
  describe('call setDoutState', () => {
    it('Call setDoutState and get success msg', async () => {
      // Arrange mocks
      const successMsg = 'Successfully set DoutPins.DOUT1 to DoutTriState.HIGH.'
      const mockMsgType = {} as unknown as protobuf.Type
      const mockResponse = {
        error: undefined,
        content: {
          content: successMsg
        }
      } as unknown as serverResponse
      const mockServiceRequest = {
        serviceName: 'DoutService',
        methodName: 'set_dout_state',
        requestMsg: {
          doutPin: DoutPins.DOUT1,
          state: DoutTriState.HIGH
        }
      } as unknown as serviceRequest
      const lookupTypeSpy = jest.spyOn(dout.serviceProtoRoot, 'lookupType').mockReturnValue(mockMsgType)
      const callMethodSpy = jest.spyOn(dout.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Call set_dout_state
      const result = await dout.set_dout_state(DoutPins.DOUT1, DoutTriState.HIGH)

      // Assertions
      expect(lookupTypeSpy).toBeCalledTimes(2)
      expect(callMethodSpy).toHaveBeenCalledWith(mockServiceRequest, mockMsgType, mockMsgType)
      expect(result).toEqual(successMsg)
    })
    it('Call set_dout_state and get error', async () => {
      // Arrange mocks
      const mockResponse = {
        error: 'Uh oh this is an error',
        content: undefined
      } as unknown as serverResponse
      jest.spyOn(dout.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Assertions
      await expect(dout.set_dout_state(DoutPins.DOUT1, DoutTriState.HIGH)).rejects.toThrow('Uh oh this is an error')
    })
  })
})
