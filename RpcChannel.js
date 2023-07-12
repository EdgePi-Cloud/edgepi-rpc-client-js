const protobuf = require("protobufjs");
const zmq = require('zeromq');


/* 
NOTE: protobufjs requries that:
- the method of a service follows a convention such that the first letter of the
  method is lower case. 
  i.e If "MyMethod" defined in proto file, "myMethod" would be the equivalent
- messages with fields like "abc_yo" must have convention "abcYo" for message payload
*/

class RpcChannel {
    constructor(host, proto_root){
        this.host = host;
        this.socket = new zmq.Request();
        this.socket.connect(this.host);
        this.proto_root = proto_root;
    }

    get_rpc_request(method, requestData) {
      let rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
      // wrap client message 
      let rpc_request_data = {
        serviceName: method.parent.fullName,
        methodName: method.name,
        requestProto: requestData,
      };
      // create rpc message
      let rpc_request = rpc_request_type.create(rpc_request_data);
      return rpc_request;
    }

    async send_rpc_request(rpc_request){
      // serialize rpc request
      let rpc_request_type = this.proto_root.lookupType("rpc.RpcRequest");
      let rpc_request_buff = rpc_request_type.encode(rpc_request).finish();
      // send over socket
      await this.socket.send(rpc_request_buff);
    }

    async get_rpc_response(){
      // get rpc response from server
      let [rpc_response_data] = await this.socket.receive();
      // deserialize rpc response
      let rpc_response_type = this.proto_root.lookupType("rpc.RpcResponse");
      let rpc_response = rpc_response_type.decode(rpc_response_data);
      return rpc_response;
    }
    
    get_server_response(method, rpc_response){
      // get required response type
      let server_response_type = method.resolvedResponseType;
      // deserialize server response
      let server_response_data = rpc_response.responseProto;
      let server_response = server_response_type.decode(server_response_data);
      return server_response;
    }
       

    async CallMethod(method,requestData,callback){
      // create rpc request
      let rpc_request = this.get_rpc_request(method, requestData);
      // send rpc service request over socket
      await this.send_rpc_request(rpc_request);
      // wait for response from server
      let rpc_response = await this.get_rpc_response();
      // get server response message and deserialize
      let server_response = this.get_server_response(method,rpc_response);
      callback(null, server_response)
    }
}

module.exports = {RpcChannel};