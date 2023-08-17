import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import { SuccessMsg } from './DoutTypes'

// Construct the path to the proto pacakge directory
const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..');

  /**
   * @constructor DoutService class for calling EdgePi digital output SDK methods through RPC
   * @param serverEndpoint String representation of the RPC Server's endpoint
   */
class DoutService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor (serverEndpoint: string) {
    this.rpcProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'rpc.proto'))
    this.serviceProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'dout.proto'))
    this.serviceName = 'DoutService'
    this.rpcChannel = new RpcChannel(serverEndpoint, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

  /**
   * @async Calls EdgePi set_dout_state SDK method through rpc
   * @param doutPin 
   * @param state 
   * @returns {Promise<String>}
   */
  async set_dout_state(doutPin: number, state: number): Promise<string>{
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_Dout.PinAndState')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_Dout.SuccessMsg')
    // Create request
    const serviceReq: serviceRequest = {
        serviceName: this.serviceName,
        methodName: 'set_dout_state',
        requestMsg: {
            doutPin,
            state
        }
    }
    // Call method through rpc
    console.debug("Calling set_dout_state method through rpc channel")
    const response: serverResponse = 
        await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
        throw Error(response.error)
    }
    const successMsg: SuccessMsg = response.content as SuccessMsg
    return successMsg.content
  }
    
}

export { DoutService }