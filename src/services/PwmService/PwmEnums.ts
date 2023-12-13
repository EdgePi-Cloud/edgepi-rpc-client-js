import path from 'path'
import * as protobuf from 'protobufjs'
import type {PwmMap, PolarityMap} from './PwmTypes'

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/edgepi-rpc-protobuf'), '../edgepi_rpc_protos');
const root = protobuf.loadSync(path.join(protoPckgPath, 'pwm.proto'))

export const PWMPins = root.lookupEnum('PWMPins').values as unknown as PwmMap
export const Polarity = root.lookupEnum('Polarity').values as unknown as PolarityMap
