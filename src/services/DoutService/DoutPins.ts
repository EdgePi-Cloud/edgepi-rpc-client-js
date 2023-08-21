import * as protobuf from 'protobufjs'
import path from 'path';

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..');

const root = protobuf.loadSync(path.join(protoPckgPath, 'dout.proto'))
export const DoutPins = root.lookupEnum('DoutPins').values
