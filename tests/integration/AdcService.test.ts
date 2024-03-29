import { AdcService } from "../../src"
import { ADC1DataRate, ADC2DataRate, AnalogIn, FilterMode, ConvMode, ADCNum, DiffMode } from "../../src"


// Disable the manual mocks
jest.unmock('zeromq')

describe('AdcService', ()=> {
    let adc: AdcService

    beforeAll(async() =>{
        adc = new AdcService('tcp://localhost:5555');
        // set rtds off
        await adc.setRtd(false, ADCNum.ADC_1)
        await adc.setRtd(false, ADCNum.ADC_2)
        
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
        // config pulse mode
        await adc.setConfig({conversionMode:ConvMode.PULSE})

        // voltage reading
        const voltage = await adc.singleSample()

        expect(typeof voltage === 'number').toBe(true)
    })

    test.each([
        [ADCNum.ADC_1, DiffMode.DIFF_1, 'DiffMode.DIFF_1'],
        [ADCNum.ADC_1, DiffMode.DIFF_2, 'DiffMode.DIFF_2'],
        [ADCNum.ADC_1, DiffMode.DIFF_3, 'DiffMode.DIFF_3'],
        [ADCNum.ADC_1, DiffMode.DIFF_4, 'DiffMode.DIFF_4'],
        [ADCNum.ADC_1, DiffMode.DIFF_OFF, 'DiffMode.DIFF_OFF'],
        [ADCNum.ADC_2, DiffMode.DIFF_1, 'DiffMode.DIFF_1'],
        [ADCNum.ADC_2, DiffMode.DIFF_2, 'DiffMode.DIFF_2'],
        [ADCNum.ADC_2, DiffMode.DIFF_3, 'DiffMode.DIFF_3'],
        [ADCNum.ADC_2, DiffMode.DIFF_4, 'DiffMode.DIFF_4'],
        [ADCNum.ADC_2, DiffMode.DIFF_OFF, 'DiffMode.DIFF_OFF'],
    ])('should run continuous differentials', async (adcNum, diff, diff_str) => {
        

        // config continuous mode
        await adc.setConfig({conversionMode:ConvMode.CONTINUOUS})

        // Select differential
        const response = await adc.selectDifferential(adcNum, diff)
        expect(response).toEqual(`Successfully selected ${diff_str}.`)

        // Get reading (if not diff_off)
        if(diff === DiffMode.DIFF_OFF) return
        
        // Start conversions
        const startConvRep = await adc.startConversions(adcNum)
            expect(startConvRep).toEqual('Successfully started conversions.')

        // Read voltage
        const voltage = await adc.readVoltage(adcNum)
        expect(typeof voltage === 'number').toBe(true)

        // Stop conversions
        const stopConvRep = await adc.stopConversions(adcNum)
        expect(stopConvRep).toEqual('Successfully stopped conversions.')
    })

    test.each([
        [ADCNum.ADC_1],
        [ADCNum.ADC_2,],

    ])('should get rtd readings', async (adcNum) => {
        // config continuous mode
        await adc.setConfig({conversionMode:ConvMode.CONTINUOUS})

        // set rtds on
        await adc.setRtd(true, adcNum)

        // Start conversions
        await adc.startConversions(adcNum)
 
        // Read temp
        const temp = await adc.readRtdTemperature()
        expect(typeof temp === 'number').toBe(true)

        // Stop conversions
        await adc.stopConversions(adcNum)
    })


})
