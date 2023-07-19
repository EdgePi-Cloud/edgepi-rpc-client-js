import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../types/types'

const SOCKETENDPOINT = 'ipc:///tmp/edgepi.pipe' // Temporary

class TcService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor () {
    // find better way to load these paths
    this.rpcProtoRoot = protobuf.loadSync('../../../../src/protos/rpc.proto')
    this.serviceProtoRoot = protobuf.loadSync('../../../../src/protos/tc.proto')
    this.serviceName = 'TcService'
    this.rpcChannel = new RpcChannel(SOCKETENDPOINT, this.rpcProtoRoot)
  }

  private async callTempReadMethod (methodName: string): Promise<serverResponse> {
    // Get types
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_TC.EmptyMsg')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_TC.TempReading')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName,
      requestMsg: {/* Empty Msg */}
    }

    // Call method through rpc
    const response = await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
    return response
  }

  async singleSample (): Promise<serverResponse> {
    return await this.callTempReadMethod('single_sample')
  }

  async read_temperatures (): Promise<serverResponse> {
    return await this.callTempReadMethod('read_temperatures')
  }
}

const t = new TcService()
t.singleSample()
  .then((response) => {
    console.log(response) // Handle the response data here
  })
  .catch((error) => {
    console.error(error) // Handle any potential errors here
  })

t.read_temperatures()
  .then((response) => {
    console.log(response) // Handle the response data here
  })
  .catch((error) => {
    console.error(error) // Handle any potential errors here
  })

export { TcService }
