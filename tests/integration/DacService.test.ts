import { DACChannel, DacService } from "../../src";


// Disable the manual mocks
jest.unmock('zeromq')

describe('DacService', ()=> {
    let dac: DacService

    beforeAll(() =>{
        dac = new DacService('tcp://localhost:5555');
        
    })
    
    // set_dac_gain test suite
    test.each([
        [true, true],
        [false, false],
      ])('should set dac gain and get correct state from response and then reset', 
      async (setGain, autoCodeChange)=>{
        const gain = await dac.setDacGain(setGain, autoCodeChange)
        expect(gain).toBe(setGain)

        const reset = await dac.reset()
        expect(reset).toBe('Successfully reset DAC.')
    } )

    test.each([
        [DACChannel.AOUT1, 3.3],
        [DACChannel.AOUT2, 3.3],
        [DACChannel.AOUT3, 3.3],
        [DACChannel.AOUT4, 3.3],
        [DACChannel.AOUT5, 3.3],
        [DACChannel.AOUT6, 3.3],
        [DACChannel.AOUT7, 3.3],
        [DACChannel.AOUT8, 3.3]
    ])('should write voltage to a specified dac channel and get a success'+
     ' response and compare voltage correctly with voltage read',
    async (channel, voltage) =>{
        const write = await dac.writeVoltage(channel, voltage)
        expect(typeof write === 'string').toBe(true)

        const {voltageVal} = await dac.getState({
            analogOut: channel,  
            voltage: true, 
        })

        expect(voltage).toBeCloseTo(voltageVal,3)

        await dac.reset()
    })

    it('should set gain and read it correctly', async () =>{
        const gain = await dac.setDacGain(true)
        const {gainState} = await dac.getState({
            analogOut:DACChannel.AOUT1, 
            gain: true})

        expect(gain).toBe(gainState)

        await dac.reset()
    })

    it('should test that auto_code_change functionality works and that reading code works',
    async () => {
        // enforce state
        await dac.setDacGain(false,false)

        // write votlage
        await dac.writeVoltage(DACChannel.AOUT1, 3.3)

        // change gain with auto code change enabled
        await dac.setDacGain(true,true)

        // read code and voltage
        const {voltageVal, codeVal} = await dac.getState({
                analogOut: DACChannel.AOUT1,
                voltage: true,
                code: true
            })

        expect(voltageVal).toBeCloseTo(3.3, 3)
        expect(typeof codeVal === "number" && codeVal > 0).toBe(true)

        await dac.reset()
    })
})
