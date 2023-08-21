import path from "path";
import * as protobuf from 'protobufjs'
import { adc1DataRate, adc2DataRate, analogIn, convMode, filterMode } from "./AdcTypes";

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'),'..');

const root = protobuf.loadSync(path.join(protoPckgPath, 'adc.proto'))

export const AnalogIn = root.lookupEnum('AnalogIn').values as unknown as analogIn
export const ADC1DataRate  = root.lookupEnum('ADC1DataRate').values as unknown as adc1DataRate
export const ADC2DataRate = root.lookupEnum('ADC2DataRate').values as unknown as adc2DataRate
export const FilterMode = root.lookupEnum('FilterMode').values as unknown as filterMode
export const ConvMode = root.lookupEnum('ConvMode').values as unknown as convMode
