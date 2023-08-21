export interface DoutPins{
  DOUT1: DoutPin
  DOUT2: DoutPin
  DOUT3: DoutPin
  DOUT4: DoutPin
  DOUT5: DoutPin
  DOUT6: DoutPin
  DOUT7: DoutPin
  DOUT8: DoutPin

}
export enum DoutPin{
  DOUT1,
  DOUT2,
  DOUT3,
  DOUT4,
  DOUT5,
  DOUT6,
  DOUT7,
  DOUT8,
}

export interface DoutTriStates{
  HI_Z: DoutTriState
  HIGH: DoutTriState
  LOW: DoutTriState
}

export enum DoutTriState{
  HI_Z,
  HIGH,
  LOW
}