import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import { LEDPin } from '../LedService/LedTypes'
import { SuccessMsg } from '../serviceTypes/successMsg'

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..');

/**
 * @constructor LEDService class for calling EdgePi LED SDK methods through RPC
 * @param serverEndpoint String representation of the RPC Server's endpoint
 */
class LEDService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor (serverEndpoint: string) {
    this.rpcProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'rpc.proto'))
    this.serviceProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'led.proto'))
    this.serviceName = 'LEDService'
    this.rpcChannel = new RpcChannel(serverEndpoint, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

  /**
   * @async Sends an RPC request for a specified LED method
   * @param methodName Name of the LED SDK method to call
   * @param ledPin The LED Pin argument for the method
   * @returns {Promise<String>} The RPC response message
   */
  private async LEDRequest(methodName: string, ledPin: LEDPin): Promise<string>{
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_LED.LEDPin')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_LED.SuccessMsg')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName,
      requestMsg: {ledPin}
    }
  
    console.info(
      `Calling LED ${methodName.replace(/_([a-z])/g, (_, group1) => group1.toUpperCase())}`+
     ` through Rpc Channel..`
     )

    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
    const successMsg: SuccessMsg = response.content as SuccessMsg
    return successMsg.content
  }

  /**
   * @async Calls EdgePi turnOn SDK method through RPC
   * @param LEDPin Enum
   * @returns {Promise<String>} A message specifying whether the call was successful or not
  */
  async turnOn(ledPin: LEDPin): Promise<string>{
    
    return await this.LEDRequest('turn_led_on', ledPin)
  }

  /**
   * @async Calls the EdgePi turnOff SDK method through RPC
   * @param LEDPin Enum
   * @returns {Promise<String>} A message specifying whether the call was successful or not
  */
  async turnOff(ledPin: LEDPin): Promise<string>{
    return await this.LEDRequest('turn_led_off', ledPin)
  }

  /**
   * @async Calls the EdgePi toggleLed SDK method through RPC
   * @param LEDPin Enum
   * @returns {Promise<String>} A message specifying whether the call was successful or not
  */
  async toggleLed(ledPin: LEDPin): Promise<string>{
    return await this.LEDRequest('toggle_led', ledPin)
  }
    
}

export { LEDService }
