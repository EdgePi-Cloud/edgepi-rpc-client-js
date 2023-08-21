import * as protobuf from 'protobufjs'
import path from 'path'

// Construct the path to the proto pacakge directory
const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'),'..');

const root = protobuf.loadSync(path.join(protoPckgPath, 'din.proto'))
export const DinPins = root.lookupEnum('DinPins').values

