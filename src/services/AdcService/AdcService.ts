import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import { createConfigArgsList } from '../util/helpers'
import { SuccessMsg } from '../serviceTypes/successMsg'
import { VoltageReadMsg, adcConfig } from './AdcTypes'

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
   * @async Calls the ADC set_config SDK method through RPC
   * @param {adcConfig} adcConfig Configuration options for the ADC.
   * @param {aIn} adcConfig.adc_1AnalogIn Analog input for ADC channel 1. Default is undefined.
   * @param {aIn} adcConfig.adc_2AnalogIn Analog input for ADC channel 2. Default is undefined.
   * @param {adc1DR} adcConfig.adc_1DataRate Data rate for ADC channel 1. Default is undefined.
   * @param {adc2DR} adcConfig.adc_2DataRate Data rate for ADC channel 2. Default is undefined.
   * @param {fMode} adcConfig.filterMode Filter mode for ADC. Default is undefined.
   * @param {cMode} adcConfig.conversionMode Conversion mode for ADC. Default is undefined.
   * @param {boolean} adcConfig.overrideUpdatesValidation Override updates validation. Default is undefined.
   * 
   * @returns {Promise<string>} A Promise that resolves with a success message upon successful configuration.
  */
  async setConfig(
    {
      adc_1AnalogIn = undefined,
      adc_2AnalogIn = undefined,
      adc_1DataRate = undefined,
      adc_2DataRate = undefined,
      filterMode = undefined,
      conversionMode = undefined,
      overrideUpdatesValidation = undefined
    }: adcConfig
  ): Promise<string> {
    
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_ADC.Config')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_ADC.SuccessMsg')
    // Create request
    const args = {
      adc_1AnalogIn, adc_1DataRate, adc_2AnalogIn, adc_2DataRate,
      filterMode, conversionMode, overrideUpdatesValidation
    }
    const argsList = createConfigArgsList(args)

    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'set_config',
      requestMsg: /*Config Message*/{
        // Config Argument Messages
        confArg : argsList
      }
    }

    // Call method through rpc
    console.info("Calling ADC setConfig through Rpc Channel with the following configurations: {"
    + `${JSON.stringify(args)}` + "\n}")


    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
 
    const successMsg: SuccessMsg = response.content as SuccessMsg
    return successMsg.content
  }

  /**
   * Calls the ADC single_sample SDK method through RPC
   * @returns {Promise<number>} Voltage reading
   */
  async singleSample(): Promise<number> {
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_ADC.EmptyMsg')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_ADC.VoltageRead')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'single_sample',
      requestMsg: {/**Empty Msg */}
  }

    // Call method through rpc
    console.info("Calling ADC singleSample through Rpc Channel..")
    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }

    const stateMsg: VoltageReadMsg = response.content as VoltageReadMsg
    return stateMsg.voltageRead
  }
}

export { AdcService }