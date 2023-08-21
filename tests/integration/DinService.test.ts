import { DINPins, DinService } from "../../src";



// Disable the manual mocks
jest.unmock('zeromq')

describe('TcService', ()=> {
    let din: DinService

    beforeAll(() =>{
        din = new DinService('tcp://localhost:5555');
        
    })
    
    // digital_input_state test suite
    test.each([
        [DINPins.DIN1],
        [DINPins.DIN2],
        [DINPins.DIN3],
        [DINPins.DIN4],
        [DINPins.DIN5],
        [DINPins.DIN6],
        [DINPins.DIN7],
        [DINPins.DIN8],
      ])('should get the state of a digital input pin', async (DinPin)=>{
        let response = await din.digital_input_state(DinPin)
        expect(typeof response == 'boolean').toBe(true)
    } )
})