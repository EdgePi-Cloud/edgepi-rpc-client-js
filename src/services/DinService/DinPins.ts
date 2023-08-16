import * as protobuf from 'protobufjs'
import path from 'path'

// Construct the path to the proto pacakge directory
const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'),'..');

const root = protobuf.loadSync(path.join(protoPckgPath, 'din.proto'))
const protoEnum = root.lookupEnum('DinPins').values

const DinPins= Object.freeze({
    DIN1: protoEnum.DIN1,
    DIN2: protoEnum.DIN2,
    DIN3: protoEnum.DIN3,
    DIN4: protoEnum.DIN4,
    DIN5: protoEnum.DIN5,
    DIN6: protoEnum.DIN6,
    DIN7: protoEnum.DIN7,
    DIN8: protoEnum.DIN8
});

  
export { DinPins }
