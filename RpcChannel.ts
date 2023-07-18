import type * as protobuf from 'protobufjs'
import * as zmq from 'zeromq'

/*
NOTE: protobufjs requries that:
- the method of a service follows a convention such that the first letter of the
  method is lower case.
  i.e If "MyMethod" defined in proto file, "myMethod" would be the equivalent
- messages with fields like "abc_yo" must have convention "abcYo" for message payload
*/

class RpcChannel {
  socket_endpoint: string
  socket: zmq.Request
  rpcRequestType: protobuf.Type
  rpcResponseType: protobuf.Type

  constructor (socketEndPoint: string, protoRoot: protobuf.Root) {
    this.socket_endpoint = socketEndPoint
    this.socket = new zmq.Request()
    this.socket.connect(this.socket_endpoint)
    this.rpcRequestType = protoRoot.lookupType('rpc.RpcRequest')
    this.rpcResponseType = protoRoot.lookupType('rpc.RpcResponse')
  }

  createRpcRequest (serviceRequest, requestType): protobuf.Message {
    const serviceName = serviceRequest.serviceName
    const methodName = serviceRequest.methodName
    const requestProto = requestType.encode(serviceRequest.requestMsg)
    // Should catch some errors here

    const rpcRequestProps = {
      serviceName,
      methodName,
      requestProto
    }
    // create rpc message
    const rpcRequest = this.rpcRequestType.create(rpcRequestProps)
    return rpcRequest
  }

  async sendRpcRequest (rpcRequest: protobuf.Message): Promise<void> {
    // serialize rpc request
    // const rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
    const rpcRequestBuff = this.rpcRequestType.encode(rpcRequest).finish()
    // send over socket
    await this.socket.send(rpcRequestBuff)
  }

  async getRpcResponse (): Promise<protobuf.Message> {
    // get rpc response from server
    const [rpcResponseData] = await this.socket.receive()
    // decode
    const rpcResponse = this.rpcResponseType.decode(rpcResponseData)
    return rpcResponse
  }

  createServerResponse (responseType: protobuf.Type, rpcResponse: protobuf.Message): object {
    // deserialize server response
    const serverResponseData = rpcResponse.responseProto
    const serverResponse = responseType.decode(serverResponseData)
    // populate response object
    const errorMsg = (rpcResponse.errorCode !== undefined)
      ? `Error ${rpcResponse.errorCode}: ${rpcResponse.errorMsg}` : null

    const responseObj = {
      error: errorMsg,
      content: serverResponse
    }

    return responseObj
  }

  async callMethod (serviceRequest, requestType: protobuf.Type, responseType: protobuf.Type): Promise<object> {
    // create rpc request
    const rpcRequest = this.createRpcRequest(serviceRequest, requestType)
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
