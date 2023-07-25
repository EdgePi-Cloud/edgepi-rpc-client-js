import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'

const SOCKETENDPOINT = 'ipc:///tmp/edgepi.pipe' // Temporary

class LEDService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor () {
    this.rpcProtoRoot = protobuf.loadSync(`${__dirname}../../../../protos/rpc.proto`)
    this.serviceProtoRoot = protobuf.loadSync(`${__dirname}../../../../protos/tc.proto`)
    this.serviceName = 'LEDService'
    this.rpcChannel = new RpcChannel(SOCKETENDPOINT, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

  private async LEDRequest(methodName: string, LedName: ): Promise<string>{
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_TC.LEDName')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_TC.SuccessMsg')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName,
      requestMsg: {LedName}
    }

    return ''
  }
    
}

export { LEDService }
