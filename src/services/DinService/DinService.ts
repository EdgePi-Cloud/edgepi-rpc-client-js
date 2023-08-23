import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import { DinPin } from './DinTypes'
import { StateMsg } from '../serviceTypes/stateMsg'

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..');

/**
 * @constructor DinService class for calling EdgePi digital input SDK methods through RPC
 * @param serverEndpoint String representation of the RPC Server's endpoint
 */
class DinService {
  private rpcProtoRoot: protobuf.Root
  private serviceProtoRoot: protobuf.Root
  private serviceName: string
  private rpcChannel: RpcChannel

  constructor (serverEndpoint: string) {
    this.rpcProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'rpc.proto'))
    this.serviceProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'din.proto'))
    this.serviceName = 'DinService'
    this.rpcChannel = new RpcChannel(serverEndpoint, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

   /**
   * @async Calls the EdgePi digital_input_state SDK method through RPC
   * @param DinPin Enum
   * @returns {Promise<boolean>} The state of the digital input pin
  */
  async digitalInputState(dinPin: DinPin): Promise<boolean> {
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_DIN.DinPin')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_DIN.State')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'digital_input_state',
      requestMsg: {dinPin}
    }
    // Call method through rpc
    console.info("Calling digitalInputState through Rpc Channel..")
    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
 
    const stateMsg: StateMsg = response.content as StateMsg
    return stateMsg.stateBool
    
  }

}

export { DinService }