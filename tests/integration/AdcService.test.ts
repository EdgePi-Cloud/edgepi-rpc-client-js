import { AdcService } from "../../src"
import { ADC1DataRate, ADC2DataRate, AnalogIn, FilterMode, ConvMode } from "../../src"


// Disable the manual mocks
jest.unmock('zeromq')

describe('AdcService', ()=> {
    let adc: AdcService

    beforeAll(() =>{
        adc = new AdcService('tcp://localhost:5555');
        
    })

    // Reset configs after test
    afterAll(async ()=> {
        //
    })
    
    // adc set_config
    test.each([
        [
            {"adc_1AnalogIn": AnalogIn.AIN1},
            {"adc_1AnalogIn": AnalogIn.AIN2},
            {"adc_1AnalogIn": AnalogIn.AIN3},
            {"adc_1AnalogIn": AnalogIn.AIN4},
            {"adc_1AnalogIn": AnalogIn.AIN5},
            {"adc_1AnalogIn": AnalogIn.AIN6},
            {"adc_1AnalogIn": AnalogIn.AIN7},
            {"adc_1AnalogIn": AnalogIn.AIN8},
            {"adc2_AnalogIn": AnalogIn.AIN1},
            {"adc2_AnalogIn": AnalogIn.AIN2},
            {"adc2_AnalogIn": AnalogIn.AIN3},
            {"adc2_AnalogIn": AnalogIn.AIN4},
            {"adc2_AnalogIn": AnalogIn.AIN5},
            {"adc2_AnalogIn": AnalogIn.AIN6},
            {"adc2_AnalogIn": AnalogIn.AIN7},
            {"adc2_AnalogIn": AnalogIn.AIN8},
            {"adc1_DataRate": ADC1DataRate.SPS_2P5},
            {"adc1_DataRate": ADC1DataRate.SPS_5},
            {"adc1_DataRate": ADC1DataRate.SPS_10_},
            {"adc1_DataRate": ADC1DataRate.SPS_16P6},
            {"adc1_DataRate": ADC1DataRate.SPS_20},
            {"adc1_DataRate": ADC1DataRate.SPS_50},
            {"adc1_DataRate": ADC1DataRate.SPS_60},
            {"adc1_DataRate": ADC1DataRate.SPS_100_},
            {"adc1_DataRate": ADC1DataRate.SPS_400_},
            {"adc1_DataRate": ADC1DataRate.SPS_1200},
            {"adc1_DataRate": ADC1DataRate.SPS_2400},
            {"adc1_DataRate": ADC1DataRate.SPS_4800},
            {"adc1_DataRate": ADC1DataRate.SPS_7200},
            {"adc1_DataRate": ADC1DataRate.SPS_14400},
            {"adc1_DataRate": ADC1DataRate.SPS_19200},
            {"adc1_DataRate": ADC1DataRate.SPS_3840},
            {"adc2_DataRate": ADC2DataRate.SPS_10},
            {"adc2_DataRate": ADC2DataRate.SPS_100},
            {"adc2_DataRate": ADC2DataRate.SPS_400},
            {"adc2_DataRate": ADC2DataRate.SPS_800},
            {"filterMode": FilterMode.SINC1},
            {"filterMode": FilterMode.SINC2},
            {"filterMode": FilterMode.SINC3},
            {"filterMode": FilterMode.SINC4},
            {"filterMode": FilterMode.FIR},
            {"conversionMode": ConvMode.PULSE},
            {"conversionMode": ConvMode.CONTINUOUS}
        ]
        
      ])('should config ain and get sucess msg', async (arg)=>{
        const response = await adc.setConfig(arg)
        expect(response).toEqual(`Successfully applied adc configurations using set_config`)
    } )

    it('should call singleSample and get voltage reading', async ()=>{
        const voltage = await adc.singleSample()
        expect(typeof voltage == 'number').toBe(true)
    })
})
