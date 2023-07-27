import * as protobuf from 'protobufjs'
import { LEDPins } from './LedPins';

export interface SuccessMsg extends protobuf.Message {
  content: string
}

// Type representing the values of the LEDPins object
export type LEDPin = typeof LEDPins[keyof typeof LEDPins];