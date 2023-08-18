import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../src/rpcChannel/RpcChannel'
import { LEDService } from '../../src/services/LedService/LedService'
import { LEDPins } from '../../src/services/LedService/LedPins'
import type { serverResponse, serviceRequest } from '../../src/rpcChannel/ReqRepTypes'

// Mock dependencies
jest.mock('protobufjs', () => {
  const mockProtoEnums = {
   values:{
      protoEnum: {
        LED1: 0,
        LED2: 1,
        LED3: 2,
        LED4: 3,
        LED5: 4,
        LED6: 5,
        LED7: 6,
        LED8: 7,
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

describe('LEDService test suite', () => {
  const led: LEDService = new LEDService('fake_endpoint')

  // Test init
  it('should be defined', () => {
    expect(led).toBeDefined()
    expect(protobuf.loadSync).toBeCalledTimes(3) // Twice in constructor and once in LEDPins
    expect(RpcChannel).toHaveBeenCalled()
  })

  // Test singleSample/ readTemperatures
  describe('call LEDRequest', () => {
    it('Should call an ledRequest method and get success msg', async () => {
      // Arrange mocks
      const successMsg = 'Successfully turned on LEDPins.LED1.'
      const mockMsgType = {} as unknown as protobuf.Type
      const mockResponse = {
        error: undefined,
        content: {
          content: successMsg
        }
      } as unknown as serverResponse
      const mockServiceRequest = {
        serviceName: 'LEDService',
        methodName: 'turn_led_on',
        requestMsg: {
          ledPin: LEDPins.LED1,
        }
      } as unknown as serviceRequest
      const lookupTypeSpy = jest.spyOn(led.serviceProtoRoot, 'lookupType').mockReturnValue(mockMsgType)
      const callMethodSpy = jest.spyOn(led.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Call turn_on
      const result = await led.turnOn(LEDPins.LED1)

      // Assertions
      expect(lookupTypeSpy).toBeCalledTimes(2)
      expect(callMethodSpy).toHaveBeenCalledWith(mockServiceRequest, mockMsgType, mockMsgType)
      expect(result).toEqual(successMsg)
    })
    it('Call an led method and get error', async () => {
      // Arrange mocks
      const mockResponse = {
        error: 'Uh oh this is an error',
        content: undefined
      } as unknown as serverResponse
      jest.spyOn(led.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Assertions
      await expect(led.turnOn(LEDPins.LED1)).rejects.toThrow('Uh oh this is an error')
    })
  })
})
