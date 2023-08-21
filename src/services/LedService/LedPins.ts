import * as protobuf from 'protobufjs'
import path from 'path'
import { LedPins } from './LedTypes';

// Construct the path to the proto pacakge directory
const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'),'..');

const root = protobuf.loadSync(path.join(protoPckgPath, 'led.proto'))
export const LEDPins = root.lookupEnum('LEDPins').values as unknown as LedPins
