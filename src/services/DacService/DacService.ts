import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import type { DACChannel, GainStateMsg } from './DacTypes'

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..');

/**
 * @constructor DinService class for calling EdgePi digital input SDK methods through RPC
 * @param serverEndpoint String representation of the RPC Server's endpoint
 */
class DacService {
  private rpcProtoRoot: protobuf.Root
  private serviceProtoRoot: protobuf.Root
  private serviceName: string
  private rpcChannel: RpcChannel

  constructor (serverEndpoint: string) {
    this.rpcProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'rpc.proto'))
    this.serviceProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'dac.proto'))
    this.serviceName = 'DacService'
    this.rpcChannel = new RpcChannel(serverEndpoint, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

   /**
   * @async Calls the EdgePi set_dac_gain SDK method through RPC
   * @param 
   * @returns {Promise<boolean>} state of gain pin
  */
  async set_dac_gain(setGain: boolean, autoCodeChange: boolean = false): Promise<boolean> {
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_DAC.Gain')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_DAC.GainState')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'set_dac_gain',
      requestMsg: {
        setGain,
        autoCodeChange
      }
    }
    // Call method through rpc
    console.debug("Sending  request through rpcChannel")
    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
 
    const stateMsg: GainStateMsg = response.content as GainStateMsg
    return stateMsg.gainState
    
  }

}

export { DacService }