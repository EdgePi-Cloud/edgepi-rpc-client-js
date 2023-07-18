import type { rpc, Method, RPCImplCallback } from 'protobufjs'
import { loadSync } from 'protobufjs'
import RpcChannel from '../RpcChannel'

export function generateService (serviceName: string): rpc.Service {
// Create rpc channel instance
  const host = 'ipc:///tmp/edgepi.pipe' // <-- will need to allow ipc and tcp soon.
  const rpcRoot = loadSync('../../protos/rpc.proto')

  const rpcChannel = new RpcChannel(host, rpcRoot)

  // create rpcImpl for protobuf service creation
  const rpcImpl = (method: Method, requestData: Uint8Array, callback: RPCImplCallback):
  void => {
    void rpcChannel.callMethod(method, requestData, callback)
  }

  // create service
  const tcRoot = loadSync('../../protos/tc.proto')
  const Service = tcRoot.lookupService(serviceName)
  const service = Service.create(rpcImpl, false, false)

  return service
}