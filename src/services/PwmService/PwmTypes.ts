export enum PWM {
    PWM1,
    PWM2,
}

export interface PwmMap {
    PWM1: PWM
    PWM2: PWM
}

export enum Polarity {
    NORMAL,
    INVERSED,
}

export interface PolarityMap {
    NORMAL: Polarity
    INVERSED: Polarity
}

export interface PWMConfig {
    pwmNum?: PWM
    frequency?: number | undefined
    dutyCycle?: number | undefined
    polarity?: Polarity | undefined
}