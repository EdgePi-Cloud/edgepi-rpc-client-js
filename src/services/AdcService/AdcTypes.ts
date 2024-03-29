export enum aIn {
  AIN1,
  AIN2,
  AIN3,
  AIN4,
  AIN5,
  AIN6,
  AIN7,
  AIN8
}

export interface analogIn {
  AIN1: aIn
  AIN2: aIn
  AIN3: aIn
  AIN4: aIn
  AIN5: aIn
  AIN6: aIn
  AIN7: aIn
  AIN8: aIn
}

export enum adc1DR {
  SPS_2P5,
  SPS_5,
  SPS_10_,
  SPS_16P6,
  SPS_20,
  SPS_50,
  SPS_60,
  SPS_100,
  SPS_400_,
  SPS_1200,
  SPS_2400,
  SPS_4800,
  SPS_7200,
  SPS_14400,
  SPS_19200,
  SPS_38400
}

export interface adc1DataRate {
  SPS_2P5: adc1DR
  SPS_5: adc1DR
  SPS_10_: adc1DR
  SPS_16P6: adc1DR
  SPS_20: adc1DR
  SPS_50: adc1DR
  SPS_60: adc1DR
  SPS_100_: adc1DR
  SPS_400_: adc1DR
  SPS_1200: adc1DR
  SPS_2400: adc1DR
  SPS_4800: adc1DR
  SPS_7200: adc1DR
  SPS_14400: adc1DR
  SPS_19200: adc1DR
  SPS_38400: adc1DR
}

export enum adc2DR {
  SPS_10,
  SPS_100,
  SPS_400,
  SPS_800
}

export interface adc2DataRate {
  SPS_10: adc2DR
  SPS_100: adc2DR
  SPS_400: adc2DR
  SPS_800: adc2DR
}

export enum fMode {
  SINC1,
  SINC2,
  SINC3,
  SINC4,
  FIR
}

export interface filterMode {
  SINC1: fMode
  SINC2: fMode
  SINC3: fMode
  SINC4: fMode
  FIR: fMode
}

export enum cMode {
  CONTINUOUS,
  PULSE

}

export interface convMode {
  CONTINUOUS: cMode
  PULSE: cMode
}

export interface adcConfig {
  adc_1AnalogIn?: aIn | undefined
  adc_2AnalogIn?: aIn | undefined
  adc_1DataRate?: adc1DR | undefined
  adc_2DataRate?: adc2DR | undefined
  filterMode?: fMode | undefined
  conversionMode?: cMode | undefined
  overrideUpdatesValidation?: boolean | undefined
}

export interface VoltageReadMsg extends protobuf.Message {
  voltageRead: number
}

export enum adc {
  ADC_1,
  ADC_2
}

export interface adcNum {
  ADC_1: adc
  ADC_2: adc
}

export enum diff {
  DIFF_1,
  DIFF_2,
  DIFF_3,
  DIFF_4,
  DIFF_OFF
}

export interface diffMode {
  DIFF_1: diff
  DIFF_2: diff
  DIFF_3: diff
  DIFF_4: diff
  DIFF_OFF: diff
}

export interface TempReading extends protobuf.Message {
  temp: number
}
