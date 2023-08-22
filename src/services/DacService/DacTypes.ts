export enum DACChannel {
    AOUT1,
    AOUT2,
    AOUT3,
    AOUT4,
    AOUT5,
    AOUT6,
    AOUT7,
    AOUT8
}

export interface DacChannels {
    AOUT1: DACChannel
    AOUT2: DACChannel
    AOUT3: DACChannel
    AOUT4: DACChannel
    AOUT5: DACChannel
    AOUT6: DACChannel
    AOUT7: DACChannel
    AOUT8: DACChannel
}

export interface GainStateMsg extends protobuf.Message{
    gainState: boolean
}