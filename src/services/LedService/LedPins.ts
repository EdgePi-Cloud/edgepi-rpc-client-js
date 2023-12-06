import * as protobuf from 'protobufjs'
import path from 'path'
import { LedPins } from './LedTypes';

// Construct the path to the proto pacakge directory
const protoPckgPath = path.join(require.resolve('@edgepi-cloud/edgepi-rpc-protobuf'), '../edgepi_rpc_protos');

const root = protobuf.loadSync(path.join(protoPckgPath, 'led.proto'))
export const LEDPins = root.lookupEnum('LEDPins').values as unknown as LedPins
