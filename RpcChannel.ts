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
  rpc_request_type: protobuf.Type

  constructor (socketEndPoint: string, protoRoot: protobuf.Root) {
    this.socket_endpoint = socketEndPoint
    this.socket = new zmq.Request()
    this.socket.connect(this.socket_endpoint)
    this.rpc_request_type = protoRoot.lookupType('rpc.RpcRequest')
  }

  createRpcRequest (method: protobuf.Method, requestData: Uint8Array): protobuf.Message {
    if (method.parent === null) {
      throw new Error('Method parent is null. Could not find requested service.\
        The requested service method may not have been called correctly or was \
        incorectly initialized.')
    }
    // let rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
    // wrap client message
    const rpcRequestData = {
      serviceName: method.parent.name,
      methodName: method.name,
      requestProto: requestData,
    }
    // create rpc message
    const rpcRequest = this.rpc_request_type.create(rpcRequestData)
    return rpcRequest
  }

  async sendRpcRequest (rpcRequest: protobuf.Message): Promise<void> {
    // serialize rpc request
    // const rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
    const rpcRequestBuff = this.rpc_request_type.encode(rpcRequest).finish()
    // send over socket
    await this.socket.send(rpcRequestBuff)
  }

  async getRpcResponse (): Promise<Uint8Array> {
    // get rpc response from server
    const [rpcResponseData] = await this.socket.receive()
    return rpcResponseData
  }

  async callMethod (
    method: protobuf.Method,
    requestData: Uint8Array,
    callback: protobuf.RPCImplCallback
  ): Promise<void> {
    try {
      // create rpc request
      const rpcRequest = this.createRpcRequest(method, requestData)
      // send rpc service request over socket
      await this.sendRpcRequest(rpcRequest)
      // wait for response from server
      const rpcResponse = await this.getRpcResponse()
      callback(null, rpcResponse)
    } catch (error: any) {
      callback(error)
    }
  }
}

export { RpcChannel }
