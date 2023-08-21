export interface AdcConfig{
    adc1AnalogIn: number | undefined
    adc2AnalogIn: number | undefined
    adc1DataRate: number | undefined
    adc2DataRate: number | undefined
    filterMode: number | undefined
    conversionMode: number | undefined
    overrideUpdatesValidation: boolean | undefined
}