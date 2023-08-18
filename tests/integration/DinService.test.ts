import { DinPins, DinService } from "../../src";



// Disable the manual mocks
jest.unmock('zeromq')

describe('TcService', ()=> {
    let din: DinService

    beforeAll(() =>{
        din = new DinService('tcp://localhost:5555');
        
    })
    
    // digital_input_state test suite
    test.each([
        [DinPins.DIN1],
        [DinPins.DIN2],
        [DinPins.DIN3],
        [DinPins.DIN4],
        [DinPins.DIN5],
        [DinPins.DIN6],
        [DinPins.DIN7],
        [DinPins.DIN8],
      ])('should get the state of a digital input pin', async (DinPin)=>{
        let response = await din.digital_input_state(DinPin)
        expect(typeof response == 'boolean').toBe(true)
    } )
})