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

  private async LEDRequest(methodName: string, ledName: LEDPin): Promise<string>{
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_LED.LEDName')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_LED.SuccessMsg')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName,
      requestMsg: {ledName}
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

  async turnOn(ledName: LEDPin): Promise<string>{
    return await this.LEDRequest('turn_led_on', ledName)
  }
  async turnOff(ledName: LEDPin): Promise<string>{
    return await this.LEDRequest('turn_led_off', ledName)
  }
  async toggleLed(ledName: LEDPin): Promise<string>{
    return await this.LEDRequest('toggle_led', ledName)
  }
    
}

export { LEDService }
