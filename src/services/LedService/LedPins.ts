import * as protobuf from 'protobufjs'
import path from 'path'

const pathToProtosRelative = path.join(
    __dirname,'..','..','..','node_modules', '@edgepi-cloud','rpc-protobuf'
    )
const root = protobuf.loadSync(path.join(pathToProtosRelative, 'led.proto'))
const protoEnum = root.lookupEnum('LEDPins').values

const LEDPins= Object.freeze({
    LED1: protoEnum.LED1,
    LED2: protoEnum.LED2,
    LED3: protoEnum.LED3,
    LED4: protoEnum.LED4,
    LED5: protoEnum.LED5,
    LED6: protoEnum.LED6,
    LED7: protoEnum.LED7,
    LED8: protoEnum.LED8
});

  
export { LEDPins }
