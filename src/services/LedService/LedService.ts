import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import { LEDPin, SuccessMsg } from './LedTypes'


const protoPckgPath = path.join(process.cwd(), 'node_modules', '@edgepi-cloud', 'rpc-protobuf');

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

  private async LEDRequest(methodName: string, ledPin: LEDPin): Promise<string>{
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_LED.LEDPin')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_LED.SuccessMsg')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName,
      requestMsg: {ledPin}
    }
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

  async turnOn(ledPin: LEDPin): Promise<string>{
    return await this.LEDRequest('turn_led_on', ledPin)
  }
  async turnOff(ledPin: LEDPin): Promise<string>{
    return await this.LEDRequest('turn_led_off', ledPin)
  }
  async toggleLed(ledPin: LEDPin): Promise<string>{
    return await this.LEDRequest('toggle_led', ledPin)
  }
    
}

export { LEDService }
