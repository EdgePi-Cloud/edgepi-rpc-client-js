import * as protobuf from 'protobufjs'

const root = protobuf.loadSync(`${__dirname}../../../../protos/dout.proto`)
const protoEnum = root.lookupEnum('DoutPins').values

const DoutPins= Object.freeze({
    DOUT1: protoEnum.DOUT1,
    DOUT2: protoEnum.DOUT2,
    DOUT3: protoEnum.DOUT3,
    DOUT4: protoEnum.DOUT4,
    DOUT5: protoEnum.DOUT5,
    DOUT6: protoEnum.DOUT6,
    DOUT7: protoEnum.DOUT7,
    DOUT8: protoEnum.DOUT8
});

  
export { DoutPins }