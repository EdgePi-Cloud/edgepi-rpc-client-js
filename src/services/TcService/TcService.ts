import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import { serviceRequest } from '../../types/types'

const SOCKETENDPOINT = 'ipc:///tmp/edgepi.pipe' // Temporary

class TcService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor () {
    // find better way to load these paths
    this.rpcProtoRoot = protobuf.loadSync('../../protos/rpc.proto')
    this.serviceProtoRoot = protobuf.loadSync('../../protos/tc.proto')
    this.serviceName = 'TcService'
    this.rpcChannel = new RpcChannel(SOCKETENDPOINT, this.rpcProtoRoot)
  }

  async singleSample () {
    // Get types
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_TC.EmptyMsg')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_TC.TempReading')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'single_sample',
      requestMsg: {/* Empty Msg */}
    }

    // Call method through rpc
    let response = await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    return response
  }
}

const t = new TcService()

t.singleSample()

export { TcService }
