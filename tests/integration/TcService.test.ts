import { TcService } from "../../src";

jest.unmock('zeromq')

describe('TcService', ()=> {
    let tc: TcService

    beforeAll(() =>{
        tc = new TcService();
    })

    it('should call single_sample and get a an array of temps', async ()=>{
        let response = await tc.singleSample()

        // Assert that the result is an array
        expect(response).toBeInstanceOf(Array);

        // Assert that the result has exactly two elements
        expect(response.length).toBe(2);

        // Assert that both elements in the array are floats (with a precision of 6 decimal places)
        expect(response[0]).toBeInstanceOf(Number);
        expect(response[1]).toBeInstanceOf(Number);
    })

    it('should call read_temperatures and get a an array of temps', async ()=>{
        let response = await tc.readTemperatures()

        // Assert that the result is an array
        expect(response).toBeInstanceOf(Array);

        // Assert that the result has exactly two elements
        expect(response.length).toBe(2);

        // Assert that both elements in the array are floats (with a precision of 6 decimal places)
        expect(response[0]).toBeInstanceOf(Number);
        expect(response[1]).toBeInstanceOf(Number);
    })
})