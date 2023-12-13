import * as protobuf from 'protobufjs'
import path from 'path'
import { DacChannels } from './DacTypes';

// Construct the path to the proto pacakge directory
const protoPckgPath = path.join(require.resolve('@edgepi-cloud/edgepi-rpc-protobuf'), '../edgepi_rpc_protos');

const root = protobuf.loadSync(path.join(protoPckgPath, 'dac.proto'))
export const DACChannel = root.lookupEnum('DACChannels').values as unknown as DacChannels