import { TcService } from "../../src";

// Disable the manual mocks
jest.unmock('zeromq')

describe('Service Tests with TCP Transport', ()=> {
    let tc: TcService

    beforeAll(() =>{
        tc = new TcService('tcp://localhost:5555');
    })

    it('should init TcService on TCP and call single_sample to get a an array of temps', async ()=>
    {
        let response = await tc.singleSample()

        // Assert that the result is an array
        expect(response).toBeInstanceOf(Array);

        // Assert that the result has exactly two elements
        expect(response.length).toBe(2);

        // Assert that both elements in the array are floats (with a precision of 6 decimal places)
        expect(typeof response[0]).toEqual("number");
        expect(typeof response[1]).toEqual("number");
    })

    /* Add basic methods for other services aswell */
})