import protobuf, {rpc} from 'protobufjs';
import * as zmq from 'zeromq';


/* 
NOTE: protobufjs requries that:
- the method of a service follows a convention such that the first letter of the
  method is lower case. 
  i.e If "MyMethod" defined in proto file, "myMethod" would be the equivalent
- messages with fields like "abc_yo" must have convention "abcYo" for message payload
*/

class RpcChannel {
    socket_endpoint: string;
    proto_root: protobuf.Root;
    socket: zmq.Request;

    constructor(socket_endpoint: string, proto_root: protobuf.Root){
        this.socket_endpoint = socket_endpoint;
        this.socket = new zmq.Request();
        this.socket.connect(this.socket_endpoint);
        this.proto_root = proto_root;
    }

    createRpcRequest(method: protobuf.Method, requestData: Uint8Array): protobuf.Message{
      if (method.parent === null) {
        throw new Error("Method parent is null. Could not find requested service.\
         The requested service method may not have been called correctly or was \
         incorectly initialized.");
      }
      let rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
      // wrap client message 
      let rpc_request_data = {
        serviceName: method.parent.name,
        methodName: method.name,
        requestProto: requestData,
      };
      // create rpc message
      const rpc_request = rpc_request_type.create(rpc_request_data);
      return rpc_request;
    }

    async sendRpcRequest(rpc_request: protobuf.Message<{}>): Promise<void>{
      // serialize rpc request
      const rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
      const rpc_request_buff = rpc_request_type.encode(rpc_request).finish();
      // send over socket
      await this.socket.send(rpc_request_buff);
    }

    async getRpcResponse(): Promise<Uint8Array>{
      // get rpc response from server
      let [rpc_response_data] = await this.socket.receive();
      return rpc_response_data;
    }  

    async callMethod(
      method: protobuf.Method,
      requestData: Uint8Array,
      callback: protobuf.RPCImplCallback
    ):Promise<void>{
      try {
        // create rpc request
        const rpc_request = this.createRpcRequest(method, requestData);
        // send rpc service request over socket
        await this.sendRpcRequest(rpc_request);
        // wait for response from server
        const rpc_response = await this.getRpcResponse();
        callback(null, rpc_response);
      } 
      catch (error) {
        callback(error as Error);
      }
    }
}

export {RpcChannel};