import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import { SuccessMsg } from './DoutTypes'


const SOCKETENDPOINT = 'ipc:///tmp/edgepi.pipe' // Temporary

class DoutService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor () {
    // TODO: Modify proto pats
    this.rpcProtoRoot = protobuf.loadSync(`${__dirname}../../../../protos/rpc.proto`)
    this.serviceProtoRoot = protobuf.loadSync(`${__dirname}../../../../protos/dout.proto`)
    this.serviceName = 'DoutService'
    this.rpcChannel = new RpcChannel(SOCKETENDPOINT, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

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