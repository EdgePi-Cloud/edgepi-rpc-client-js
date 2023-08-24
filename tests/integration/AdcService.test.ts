import { AdcService } from "../../src"
import { ADC1DataRate, ADC2DataRate, AnalogIn, FilterMode, ConvMode } from "../../src"


// Disable the manual mocks
jest.unmock('zeromq')

describe('AdcService', ()=> {
    let adc: AdcService

    beforeAll(() =>{
        adc = new AdcService('tcp://localhost:5555');
        
    })
    
    // adc set_config
    test.each([
            [{adc_1AnalogIn: AnalogIn.AIN1}],
            [{adc_1AnalogIn: AnalogIn.AIN2}],
            [{adc_1AnalogIn: AnalogIn.AIN3}],
            [{adc_1AnalogIn: AnalogIn.AIN4}],
            [{adc_1AnalogIn: AnalogIn.AIN5}],
            [{adc_1AnalogIn: AnalogIn.AIN6}],
            [{adc_1AnalogIn: AnalogIn.AIN7}],
            [{adc_1AnalogIn: AnalogIn.AIN8}],
            [{adc_2AnalogIn: AnalogIn.AIN1}],
            [{adc_2AnalogIn: AnalogIn.AIN2}],
            [{adc_2AnalogIn: AnalogIn.AIN3}],
            [{adc_2AnalogIn: AnalogIn.AIN4}],
            [{adc_2AnalogIn: AnalogIn.AIN5}],
            [{adc_2AnalogIn: AnalogIn.AIN6}],
            [{adc_2AnalogIn: AnalogIn.AIN7}],
            [{adc_2AnalogIn: AnalogIn.AIN8}],
            [{adc_1DataRate: ADC1DataRate.SPS_2P5}],
            [{adc_1DataRate: ADC1DataRate.SPS_5}],
            [{adc_1DataRate: ADC1DataRate.SPS_10_}],
            [{adc_1DataRate: ADC1DataRate.SPS_16P6}],
            [{adc_1DataRate: ADC1DataRate.SPS_20}],
            [{adc_1DataRate: ADC1DataRate.SPS_50}],
            [{adc_1DataRate: ADC1DataRate.SPS_60}],
            [{adc_1DataRate: ADC1DataRate.SPS_100_}],
            [{adc_1DataRate: ADC1DataRate.SPS_400_}],
            [{adc_1DataRate: ADC1DataRate.SPS_1200}],
            [{adc_1DataRate: ADC1DataRate.SPS_2400}],
            [{adc_1DataRate: ADC1DataRate.SPS_4800}],
            [{adc_1DataRate: ADC1DataRate.SPS_7200}],
            [{adc_1DataRate: ADC1DataRate.SPS_14400}],
            [{adc_1DataRate: ADC1DataRate.SPS_19200}],
            [{adc_1DataRate: ADC1DataRate.SPS_38400}],
            [{adc_2DataRate: ADC2DataRate.SPS_10}],
            [{adc_2DataRate: ADC2DataRate.SPS_100}],
            [{adc_2DataRate: ADC2DataRate.SPS_400}],
            [{adc_2DataRate: ADC2DataRate.SPS_800}],
            [{filterMode: FilterMode.SINC1}],
            [{filterMode: FilterMode.SINC2}],
            [{filterMode: FilterMode.SINC3}],
            [{filterMode: FilterMode.SINC4}],
            [{filterMode: FilterMode.FIR}],
            [{conversionMode: ConvMode.PULSE}],
            [{conversionMode: ConvMode.CONTINUOUS}]

      ])('should config ain and get sucess msg', async (arg)=>{
        const response = await adc.setConfig(arg)
        expect(response).toEqual(`Successfully applied adc configurations using set_config`)
    } )

    it('should call singleSample and get voltage reading', async ()=>{
        const voltage = await adc.singleSample()
        expect(typeof voltage == 'number').toBe(true)
    })
})
