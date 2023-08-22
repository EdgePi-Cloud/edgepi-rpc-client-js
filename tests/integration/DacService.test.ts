import { DacService } from "../../src";


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
      ])('should get the state of a digital input pin', async (setGain, autoCodeChange)=>{
        let response = await dac.set_dac_gain(setGain, autoCodeChange)
        expect(response).toBe(setGain)
    } )
})
