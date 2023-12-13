import { hasUncaughtExceptionCaptureCallback } from "process"
import { PWMService } from "../../src"
import { PWMPins, Polarity } from "../../src"

jest.unmock('zeromq')

describe('PwmService', () => {
    let pwm: PWMService

    beforeAll(async () => {
        pwm = new PWMService('tcp://localhost:5555')
        await pwm.initPwm(PWMPins.PWM1)
        await pwm.initPwm(PWMPins.PWM2)
    })

    const enumNames: { [key: number]: string } = {
        0: 'PWMPins.PWM1',
        1: 'PWMPins.PWM2'
    }
    
    test.each([
        [{pwmNum: PWMPins.PWM1, frequency: 1000, dutyCycle: 1, polarity: Polarity.NORMAL}],
        [{pwmNum: PWMPins.PWM2, frequency: 1000, dutyCycle: 1, polarity: Polarity.NORMAL}]
    ])('Call setConfig and check configurations', async (args) => {
        const response = await pwm.setConfig(args)
        expect(response).toEqual('Successfully applied pwm configurations.')

        const frequency = await pwm.getFrequency(args.pwmNum)
        expect(typeof frequency).toBe('number')
        expect(frequency).toEqual(args.frequency)

        const dutyCycle = await pwm.getDutyCycle(args.pwmNum)
        expect(typeof dutyCycle).toBe('number')
        expect(dutyCycle).toEqual(args.dutyCycle)

        const polarity = await pwm.getPolarity(args.pwmNum)
        expect(Object.values(Polarity)).toContain(polarity)
        expect(polarity).toEqual(args.polarity)
    })

    test.each([
        [PWMPins.PWM1],
        [PWMPins.PWM2],
    ])('Call enable and check state', async (PwmPins) => {
        const response = await pwm.enable(PwmPins)
        expect(response).toEqual(`Successfully enabled ${enumNames[PwmPins]}.`)

        const enabled = await pwm.getEnabled(PwmPins)
        expect(typeof enabled).toBe('boolean')
        expect(enabled).toEqual(true)
    })

    test.each([
        [PWMPins.PWM1],
        [PWMPins.PWM2],
    ])('Call disable and check state', async (PwmPins) => {
        const response = await pwm.disable(PwmPins)
        expect(response).toEqual(`Successfully disabled ${enumNames[PwmPins]}.`)

        const enabled = await pwm.getEnabled(PwmPins)
        expect(typeof enabled).toBe('boolean')
        expect(enabled).toEqual(false)
    })

    test.each([
        [PWMPins.PWM1],
        [PWMPins.PWM2],
    ])('Call close and check success message', async (PwmPins) => {
        const response = await pwm.close(PwmPins)
        expect(response).toEqual(`Successfully closed ${enumNames[PwmPins]}.`)
    })
})
