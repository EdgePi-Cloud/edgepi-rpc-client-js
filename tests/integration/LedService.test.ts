import { LEDService } from "../../src"
import { LEDPins } from "../../src"


// Disable the manual mocks
jest.unmock('zeromq')

describe('TcService', ()=> {
    let led: LEDService

    beforeAll(() =>{
        led = new LEDService('tcp://localhost:5555');
        
    })

    // Turn off leds after tests ( if they pass that is...)
    afterAll(async ()=> {
        const ledPins = Object.values(LEDPins)
        for (const ledPin of ledPins) {
            await led.turnOff(ledPin)
        }
    })

    const enumNames: { [key: number]: string } = {
        0: 'LEDPins.LED1', // LEDPins.LED1
        1: 'LEDPins.LED2', // LEDPins.LED2
        2: 'LEDPins.LED3', // LEDPins.LED3
        3: 'LEDPins.LED4', // LEDPins.LED4
        4: 'LEDPins.LED5', // LEDPins.LED5
        5: 'LEDPins.LED6', // LEDPins.LED6
        6: 'LEDPins.LED7', // LEDPins.LED7
        7: 'LEDPins.LED8' // LEDPins.LED8
    }
    
    // Turn on LED test suite
    test.each([
        [LEDPins.LED1],
        [LEDPins.LED2],
        [LEDPins.LED3],
        [LEDPins.LED4],
        [LEDPins.LED5],
        [LEDPins.LED6],
        [LEDPins.LED7],
        [LEDPins.LED8],
      ])('should turn on led and get a success msg', async (ledPin)=>{
        let response = await led.turnOn(ledPin)
        expect(response).toEqual(`Successfully turned on ${enumNames[ledPin]}.`)
    } )

    test.each([
        [LEDPins.LED1],
        [LEDPins.LED2],
        [LEDPins.LED3],
        [LEDPins.LED4],
        [LEDPins.LED5],
        [LEDPins.LED6],
        [LEDPins.LED7],
        [LEDPins.LED8],
      ])('should turn off led and get a success msg', async (ledPin)=>{
        let response = await led.turnOff(ledPin)
        expect(response).toEqual(`Successfully turned off ${enumNames[ledPin]}.`)
    })

    test.each([
        [LEDPins.LED1],
        [LEDPins.LED2],
        [LEDPins.LED3],
        [LEDPins.LED4],
        [LEDPins.LED5],
        [LEDPins.LED6],
        [LEDPins.LED7],
        [LEDPins.LED8],
      ])('should toggle led to opposite state and get a success msg', async (ledPin)=>{
        let response = await led.toggleLed(ledPin)
        expect(response).toEqual(`Successfully toggled ${enumNames[ledPin]} to the opposite state.`)
    })
})