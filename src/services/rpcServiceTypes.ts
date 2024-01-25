export interface GetDutyCycle extends protobuf.Message {
  dutyCycle: number
}

export interface GetEnabled extends protobuf.Message {
  enabled: boolean
}

export interface PWMSettings extends protobuf.Message {
  dutyCycle: number
  frequency: number
  polarity: number
  enabled: boolean
}

export interface GetFrequency extends protobuf.Message {
  frequency: number
}

export interface GetPolarity extends protobuf.Message {
  polarity: number
}

export interface StateMsg extends protobuf.Message {
  stateBool: boolean
}

export interface SuccessMsg extends protobuf.Message {
  content: string
}
