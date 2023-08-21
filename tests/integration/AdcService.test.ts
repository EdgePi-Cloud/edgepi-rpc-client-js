import { AdcService } from "../../src"
import { ADC1DataRate, ADC2DataRate, AnalogIn, FilterMode, ConvMode } from "../../src"


// Disable the manual mocks
jest.unmock('zeromq')

describe('LedService', ()=> {
    let adc: AdcService

    beforeAll(() =>{
        adc = new AdcService('tcp://localhost:5555');
        
    })

    // Reset configs after test
    afterAll(async ()=> {
        //
    })
    
    // Turn on LED test suite
    test.each([
        [{adc1AnalogIn: AnalogIn.AIN1}],
        [{adc1AnalogIn: AnalogIn.AIN2}],
        [{adc1AnalogIn: AnalogIn.AIN3}],
        [{adc1AnalogIn: AnalogIn.AIN4}],
        [{adc1AnalogIn: AnalogIn.AIN5}],
        [{adc1AnalogIn: AnalogIn.AIN6}],
        [{adc1AnalogIn: AnalogIn.AIN7}],
        [{adc1AnalogIn: AnalogIn.AIN8}],
      ])('should config ain and get sucess msg', async (arg)=>{
        let response = await adc.set_config(arg)
        expect(response).toEqual(`Successfully applied adc configurations using set_config`)
    } )
})