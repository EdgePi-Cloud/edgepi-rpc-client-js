import * as protobuf from 'protobufjs'
import path from 'path';
import { DoutPins } from './DoutTypes';

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/edgepi-rpc-protobuf'), '../edgepi_rpc_protos');

const root = protobuf.loadSync(path.join(protoPckgPath, 'dout.proto'))
export const DOUTPins = root.lookupEnum('DoutPins').values as unknown as DoutPins
