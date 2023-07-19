import type * as protobuf from 'protobufjs'

/*
NOTE: protobufjs requries that:
- When messages are created by protobufjs, all fields are converted to camelCase convention.
  i.e messages with fields like "abc_yo" defined in a .proto file will take be converted to "abcYo"
*/

export interface serviceRequest {
  serviceName: string
  methodName: string
  requestMsg: object
}

export interface RpcRequest extends protobuf.Message {
  serviceName?: string
  methodName?: string
  responseProto?: Uint8Array
}

export interface RpcResponse extends protobuf.Message {
  serviceName?: string | null
  methodName?: string | null
  responseProto?: Uint8Array | protobuf.Reader
  errorMsg?: string | null
  errorCode?: number
}

export interface serverResponse {
  error: string | undefined
  content: protobuf.Message | undefined
}
