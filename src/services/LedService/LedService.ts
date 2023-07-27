import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import { LEDPin, SuccessMsg } from './LedTypes'

const SOCKETENDPOINT = 'ipc:///tmp/edgepi.pipe' // Temporary

class LEDService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor () {
    this.rpcProtoRoot = protobuf.loadSync(`${__dirname}../../../../protos/rpc.proto`)
    this.serviceProtoRoot = protobuf.loadSync(`${__dirname}../../../../protos/led.proto`)
    this.serviceName = 'LEDService'
    this.rpcChannel = new RpcChannel(SOCKETENDPOINT, this.rpcProtoRoot)
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
