import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import { SuccessMsg } from '../serviceTypes/successMsg';
import { StateMsg } from '../serviceTypes/stateMsg';

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..');

/**
 * @constructor RelayService class for calling EdgePi LED SDK methods through RPC
 * @param serverEndpoint String representation of the RPC Server's endpoint
 */
class RelayService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor (serverEndpoint: string) {
    this.rpcProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'rpc.proto'))
    this.serviceProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'relay.proto'))
    this.serviceName = 'RelayService'
    this.rpcChannel = new RpcChannel(serverEndpoint, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

  private async callEnergizeMethod(methodName: string): Promise<string>{
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_Relay.EmptyMsg')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_Relay.SuccessMsg')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName,
      requestMsg: {/* Empty Msg */}
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

  async openRelay(): Promise<string>{
    return await this.callEnergizeMethod('open_relay')
  }

  async closeRelay(): Promise<string>{
    return await this.callEnergizeMethod('close_relay')
  }

  async getStateRelay(): Promise<boolean>{
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_Relay.EmptyMsg')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_Relay.State')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'get_state_relay',
      requestMsg: {/* Empty Msg */}
    }
    // Call method through rpc
    console.debug("Sending  request through rpcChannel")
    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
 
    const stateMsg: StateMsg = response.content as StateMsg
    return stateMsg.stateBool
  }

}

export { RelayService }