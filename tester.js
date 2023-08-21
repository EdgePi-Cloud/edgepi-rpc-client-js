const protobuf = require('protobufjs')
const path = require('path')

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..')

this.serviceProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'adc.proto'))
const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_ADC.Config')

const requestMsg = {
    confArg: [
        {overrideUpdatesValidation: true}
    ]
}

const msg = requestType.create(requestMsg)

const buf = requestType.encode(msg).finish();

const msg_dec = requestType.decode(buf)

console.log(msg_dec)

function a({a = 1}){
    return {...arguments}
}

console.log(a({poo:'1'}))