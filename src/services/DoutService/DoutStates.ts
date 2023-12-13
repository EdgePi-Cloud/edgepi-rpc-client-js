import * as protobuf from 'protobufjs'
import path from 'path'
import { DoutTriStates } from './DoutTypes';

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/edgepi-rpc-protobuf'), '../edgepi_rpc_protos');
const root = protobuf.loadSync(path.join(protoPckgPath, 'dout.proto'))
const DoutTriState = root.lookupEnum('DoutTriState').values as unknown as DoutTriStates

  
export { DoutTriState }


