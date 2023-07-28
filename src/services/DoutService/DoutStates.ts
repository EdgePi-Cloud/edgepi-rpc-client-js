import * as protobuf from 'protobufjs'

const root = protobuf.loadSync(`${__dirname}../../../../protos/dout.proto`)
const protoEnum = root.lookupEnum('DoutTriState').values

const DoutTriState= Object.freeze({
    HI_Z: protoEnum.HI_Z,
    HIGH: protoEnum.HIGH,
    LOW: protoEnum.LOW,
});

  
export { DoutTriState }


