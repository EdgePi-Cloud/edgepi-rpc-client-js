import path from "path";
import * as protobuf from 'protobufjs'

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'),'..');

const root = protobuf.loadSync(path.join(protoPckgPath, 'adc.proto'))

export const AnalogIn = root.lookupEnum('AnalogIn').values
export const ADC1DataRate  = root.lookupEnum('ADC1DataRate').values
export const ADC2DataRate = root.lookupEnum('ADC2DataRate').values
export const FilterMode = root.lookupEnum('FilterMode').values
export const ConvMode = root.lookupEnum('ConvMode').values

