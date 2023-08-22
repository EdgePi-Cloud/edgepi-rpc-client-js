import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import type { TempReading } from './tcTypes'

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..')

  /**
   * @constructor TcService class for calling EdgePi thermocouple SDK methods through RPC
   * @param serverEndpoint String representation of the RPC Server's endpoint
   */
class TcService {
  private rpcProtoRoot: protobuf.Root
  private serviceProtoRoot: protobuf.Root
  private serviceName: string
  private rpcChannel: RpcChannel

  constructor (serverEndpoint: string) {
    this.rpcProtoRoot = protobuf.loadSync(path.join(protoPckgPath, 'rpc.proto'))
    this.serviceProtoRoot = protobuf.loadSync(path.join(protoPckgPath, 'tc.proto'))
    this.serviceName = 'TcService'
    this.rpcChannel = new RpcChannel(serverEndpoint, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

  /**
   * Sends an RPC request for a specified Tc Method
   * @param methodName Name of the Tc SDK method to call
   * @returns {Promise<number[]>} An array [cold junction temp, linearized temp]
   */
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

  /**
   * Calls the EdgePi singleSample SDK method through RPC
   * @param None
   * @returns {Promise<number[]>} An array [cold junction temp, linearized temp]
   */
  async singleSample (): Promise<number[]> {
    return await this.callTempReadMethod('single_sample')
  }
  /**
   * Calls the EdgePi readTemperatures SDK method through RPC
   * @param None
   * @returns {Promise<number[]>} An array [cold junction temp, linearized temp]
   */
  async readTemperatures (): Promise<number[]> {
    return await this.callTempReadMethod('read_temperatures')
  }
}

export { TcService }
