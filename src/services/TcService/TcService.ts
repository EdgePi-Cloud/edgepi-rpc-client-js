import * as protobuf from 'protobufjs'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import type { TempReading } from './tcTypes'

const SOCKETENDPOINT = 'ipc:///tmp/edgepi.pipe' // Temporary

class TcService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor () {
    this.rpcProtoRoot = protobuf.loadSync(`${__dirname}../../../../protos/rpc.proto`)
    this.serviceProtoRoot = protobuf.loadSync(`${__dirname}../../../../protos/tc.proto`)
    this.serviceName = 'TcService'
    this.rpcChannel = new RpcChannel(SOCKETENDPOINT, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

  private async callTempReadMethod (methodName: string): Promise<number[]> {
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
    console.debug("Sending temperature reading request through rpcChannel")
    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
    const tempReading: TempReading = response.content as TempReading
    return [tempReading.cjTemp, tempReading.linTemp]
  }

  async singleSample (): Promise<number[]> {
    return await this.callTempReadMethod('single_sample')
  }

  async readTemperatures (): Promise<number[]> {
    return await this.callTempReadMethod('read_temperatures')
  }
}

export { TcService }
