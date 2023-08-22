import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import { createConfigArgsList } from '../util/helpers'
import { SuccessMsg } from '../serviceTypes/successMsg'
import { adcConfig } from './AdcTypes'

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..');

/**
 * @constructor Adc class for calling EdgePi adc SDK methods through RPC
 * @param serverEndpoint String representation of the RPC Server's endpoint
 */
class AdcService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor (serverEndpoint: string) {
    this.rpcProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'rpc.proto'))
    this.serviceProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'adc.proto'))
    this.serviceName = 'AdcService'
    this.rpcChannel = new RpcChannel(serverEndpoint, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

   /**
   * @async Calls the EdgePi set_config adc SDK method through RPC
   * @param DinPin Enum
   * @returns {Promise<string>} The state of the digital input pin
  */
  async set_config(
    {
      adc_1AnalogIn = undefined,
      adc_1DataRate = undefined,
      adc_2AnalogIn = undefined,
      filterMode = undefined,
      conversionMode = undefined,
      overrideUpdatesValidation = undefined
    }: adcConfig
  ): Promise<string> {
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_ADC.Config')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_ADC.SuccessMsg')
    // Create request
    const argsList = createConfigArgsList({
      adc_1AnalogIn,adc_1DataRate,adc_2AnalogIn,filterMode,conversionMode,overrideUpdatesValidation
    })
    console.log(argsList)
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'set_config',
      requestMsg: /*Config Message*/{
        // Config Argument Messages
        confArg : argsList
      }
    }
    console.log(serviceReq);
    // Call method through rpc
    console.debug("Sending  request through rpcChannel")
    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
 
    const successMsg: SuccessMsg = response.content as SuccessMsg
    return successMsg.content
  }

}

export { AdcService }