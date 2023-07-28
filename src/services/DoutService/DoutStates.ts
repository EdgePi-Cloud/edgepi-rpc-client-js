import * as protobuf from 'protobufjs'
import path from 'path'

const pathToProtosRelative = path.join(__dirname,'..','..','..','node_modules', '@edgepi-cloud','rpc-protobuf')
const root = protobuf.loadSync(path.join(pathToProtosRelative, 'dout.proto'))
const protoEnum = root.lookupEnum('DoutTriState').values

const DoutTriState= Object.freeze({
    HI_Z: protoEnum.HI_Z,
    HIGH: protoEnum.HIGH,
    LOW: protoEnum.LOW,
});

  
export { DoutTriState }


