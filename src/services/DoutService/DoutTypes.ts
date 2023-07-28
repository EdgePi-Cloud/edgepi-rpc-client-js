import * as protobuf from 'protobufjs'

export interface SuccessMsg extends protobuf.Message {
  content: string
}