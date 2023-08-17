import { RelayService } from "../../src";



// Disable the manual mocks
jest.unmock('zeromq')

describe('TcService', ()=> {
    let relay: RelayService

    beforeAll(() =>{
        relay = new RelayService('tcp://localhost:5555');
        
    })
    
    it('should open relay and check state that it is open', async ()=>{
        // call open_relay
        const response = await relay.openRelay()
        // call get_state_relay
        const state = await relay.getStateRelay()

        // assert that the state is open and correct success msg
        expect(state).toBe(false)
        expect(response).toEqual("Successfully opened relay")
    })

    it('should open relay and check state that it is open', async ()=>{
        // call open_relay
        const response = await relay.closeRelay()
        // call get_state_relay
        const state = await relay.getStateRelay()

        // assert that the state is open and correct success msg
        expect(state).toBe(true)
        expect(response).toEqual("Successfully closed relay")
    })
})