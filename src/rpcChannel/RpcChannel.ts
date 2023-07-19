import type * as protobuf from 'protobufjs'
import * as zmq from 'zeromq'
import type { serviceRequest, RpcRequest, RpcResponse, serverResponse } from '../types/types'

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
  }

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

  async sendRpcRequest (rpcRequest: protobuf.Message): Promise<void> {
    // serialize rpc request
    // const rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
    const rpcRequestBuff = this.rpcRequestType.encode(rpcRequest).finish()
    // send over socket
    await this.socket.send(rpcRequestBuff)
  }

  async getRpcResponse (): Promise<RpcResponse> {
    // get rpc response from server
    const [rpcResponseData] = await this.socket.receive()
    // decode
    const rpcResponse: RpcResponse = this.rpcResponseType.decode(rpcResponseData) as RpcResponse
    return rpcResponse
  }

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
