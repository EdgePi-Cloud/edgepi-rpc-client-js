import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../src/rpcChannel/RpcChannel'
import { TcService } from '../../src/services/TcService/TcService'
import type { serverResponse, serviceRequest } from '../../src/rpcChannel/ReqRepTypes'

// Mock dependencies
jest.mock('protobufjs', () => {
  const mockRoot = { lookupType: jest.fn() } as unknown as protobuf.Root
  return {
    loadSync: jest.fn().mockReturnValue(mockRoot)
  }
})

jest.mock('../../src/rpcChannel/RpcChannel', () => {
  return {
    RpcChannel: jest.fn().mockImplementation(() => { return { callMethod: jest.fn() } })
  }
})

describe('TcService', () => {
  const tc: TcService = new TcService('fake_endpoint')

  // Test init
  it('should be defined', () => {
    expect(tc).toBeDefined()
    expect(protobuf.loadSync).toBeCalledTimes(2)
    expect(RpcChannel).toHaveBeenCalled()
  })

  // Test singleSample/ readTemperatures
  describe('callTempReadMethod', () => {
    it('Call a given temp reading method and return an array w/ the results', async () => {
      // Arrange mocks
      const mockMsgType = {} as unknown as protobuf.Type
      const mockResponse = {
        error: undefined,
        content: {
          cjTemp: 25.9,
          linTemp: 26.6
        }
      } as unknown as serverResponse
      const mockServiceRequest = {
        serviceName: 'TcService',
        methodName: 'single_sample',
        requestMsg: {/* Empty Msg */}
      } as unknown as serviceRequest
      const lookupTypeSpy = jest.spyOn(tc.serviceProtoRoot, 'lookupType').mockReturnValue(mockMsgType)
      const callMethodSpy = jest.spyOn(tc.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Call single sample
      const result = await tc.singleSample()

      // Assertions
      expect(lookupTypeSpy).toBeCalledTimes(2)
      expect(callMethodSpy).toHaveBeenCalledWith(mockServiceRequest, mockMsgType, mockMsgType)
      expect(result).toEqual([25.9, 26.6])
    })
    it('Call a given temp reading method get an error back', async () => {
      // Arrange mocks
      const mockResponse = {
        error: 'Uh oh this is an error',
        content: undefined
      } as unknown as serverResponse
      jest.spyOn(tc.rpcChannel, 'callMethod').mockResolvedValue(mockResponse)

      // Assertions
      await expect(tc.singleSample()).rejects.toThrow('Uh oh this is an error')
    })
  })
})
