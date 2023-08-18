const protobuf = require('protobufjs')
const path = require('path')

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..')

this.serviceProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'adc.proto'))
const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_ADC.Config')

const requestMsg = {
    conf_arg: [
        {overrideUpdatesValidation: true}
    ]
}

const msg = requestType.create(requestMsg)



