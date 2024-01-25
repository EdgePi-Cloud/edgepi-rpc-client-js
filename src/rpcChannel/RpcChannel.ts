import type * as protobuf from 'protobufjs'
import * as zmq from 'zeromq'
import type { serviceRequest, RpcRequest, RpcResponse, serverResponse } from './ReqRepTypes'

/**
 * Mediates RPC messages to and from the RPC server.
 * @param socketEndpoint string representation of the RPC server's endoint
 * @param rpcProtoRoot a protobufjs Root object of the PRC protobuf messages file
 */
class RpcChannel {
  socket_endpoint: string
  socket: zmq.Request
  rpcRequestType: protobuf.Type
  rpcResponseType: protobuf.Type

  constructor (socketEndPoint: string, rpcProtoRoot: protobuf.Root) {
    this.socket_endpoint = socketEndPoint
    this.socket = new zmq.Request()
    this.socket.connect(this.socket_endpoint)
    this.rpcRequestType = rpcProtoRoot.lookupType('rpc.RpcRequest')
    this.rpcResponseType = rpcProtoRoot.lookupType('rpc.RpcResponse')
    console.info('RpcChannel intialized on', this.socket_endpoint)
  }

  /**
   * Wraps client message in an Rpc message
   * @param serviceReq
   * @param requestType
   * @returns RpcRequest obect
   */
  createRpcRequest (serviceReq: serviceRequest, requestType: protobuf.Type): RpcRequest {
    // Serialize request message
    const request = requestType.create(serviceReq.requestMsg)
    const requestProto = requestType.encode(request).finish()
    // Should catch some errors here

    // Wrap request in RpcRequest message. Create rpc request
    const rpcRequestProps = {
      serviceName: serviceReq.serviceName,
      methodName: serviceReq.methodName,
      requestProto
    }
    const rpcRequest: RpcRequest = this.rpcRequestType.create(rpcRequestProps) as RpcRequest
    return rpcRequest
  }

  /**
   * @async Serializes the Rpc Request and sends it over a socket to server
   * @param rpcRequest
   */
  async sendRpcRequest (rpcRequest: protobuf.Message): Promise<void> {
    // serialize rpc request
    // const rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
    const rpcRequestBuff = this.rpcRequestType.encode(rpcRequest).finish()
    // send over socket
    console.debug('Sending request to server')
    await this.socket.send(rpcRequestBuff)
  }

  /**
   * @async Receives the rpc response from server and decodes it
   * @returns
   */
  async getRpcResponse (): Promise<RpcResponse> {
    // get rpc response from server
    const [rpcResponseData] = await this.socket.receive()
    console.debug('Response from server received')
    // decode
    const rpcResponse: RpcResponse = this.rpcResponseType.decode(rpcResponseData) as RpcResponse
    return rpcResponse
  }

  /**
   * Deserializes the client message within the Rpc Response message and creates a response object
   * @param responseType
   * @param rpcResponse
   * @returns server response object
   */
  createServerResponse (responseType: protobuf.Type, rpcResponse: RpcResponse): serverResponse {
    // deserialize server response
    const serverResponseMessage = (rpcResponse.responseProto !== null)
      ? responseType.decode(rpcResponse.responseProto)
      : undefined
    // populate response object
    const errorMsg = (rpcResponse.errorMsg !== null)
      ? `Error ${rpcResponse.errorCode}: ${rpcResponse.errorMsg}`
      : undefined

    const serverResponse = {
      error: errorMsg,
      content: serverResponseMessage
    }

    return serverResponse
  }

  /**
   * Calls an SDK method through RPC from a given service request object and the expected request/reponse types
   * @param serviceReq
   * @param requestType
   * @param responseType
   * @returns server response object
   */
  async callMethod (
    serviceReq: serviceRequest,
    requestType: protobuf.Type,
    responseType: protobuf.Type
  ): Promise<serverResponse> {
    // create rpc request
    const rpcRequest = this.createRpcRequest(serviceReq, requestType)
    // send rpc service request over socket
    await this.sendRpcRequest(rpcRequest)
    // wait for rpc response from server
    const rpcResponse = await this.getRpcResponse()
    // create a server response
    const serverResponse = this.createServerResponse(responseType, rpcResponse)
    // finish
    return serverResponse
  }
}

export { RpcChannel }
