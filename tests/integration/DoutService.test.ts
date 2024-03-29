import { DoutService } from "../../src"
import { DoutTriState } from "../../src"
import { DOUTPins } from "../../src"

// Disable manual mocks
jest.unmock('zeromq')

describe('DoutService', ()=> {
    let dout: DoutService

    beforeAll(() =>{
        dout = new DoutService('tcp://localhost:5555')
    })

    const pinEnumNames: { [key: number]: string } = {
        0: 'DoutPins.DOUT1', // DoutPins.DOUT1
        1: 'DoutPins.DOUT2', // DoutPins.DOUT2
        2: 'DoutPins.DOUT3', // DoutPins.DOUT3
        3: 'DoutPins.DOUT4', // DoutPins.DOUT4
        4: 'DoutPins.DOUT5', // DoutPins.DOUT5
        5: 'DoutPins.DOUT6', // DoutPins.DOUT6
        6: 'DoutPins.DOUT7', // DoutPins.DOUT7
        7: 'DoutPins.DOUT8'  // DoutPins.DOUT8
    }
    const stateEnumNames: { [key: number]: string } = {
        0: 'DoutTriState.HI_Z', //DoutTriState.HI_Z
        1: 'DoutTriState.HIGH',     //DoutTriState.HIGH
        2: 'DoutTriState.LOW', //DoutTriState.LOW
    }

    // set_dout_config HI_Z test suite
    test.each([
        [DOUTPins.DOUT1],
        [DOUTPins.DOUT2],
        [DOUTPins.DOUT3],
        [DOUTPins.DOUT4],
        [DOUTPins.DOUT5],
        [DOUTPins.DOUT6],
        [DOUTPins.DOUT7],
        [DOUTPins.DOUT8]
    ])('should set dout pin to HI_Z and and get correct successmsg', async (doutPin) => {
        const response = await dout.setDoutState(doutPin, DoutTriState.HI_Z)
        expect(response).toEqual(
            `Successfully set ${pinEnumNames[doutPin]} to ${stateEnumNames[DoutTriState.HI_Z]}.`)
    })

    // set_dout_config HIGH test suite
    test.each([
        [DOUTPins.DOUT1],
        [DOUTPins.DOUT2],
        [DOUTPins.DOUT3],
        [DOUTPins.DOUT4],
        [DOUTPins.DOUT5],
        [DOUTPins.DOUT6],
        [DOUTPins.DOUT7],
        [DOUTPins.DOUT8]
    ])('should set dout pin to HIGH and and get correct successmsg', async (doutPin) => {
        const response = await dout.setDoutState(doutPin, DoutTriState.HIGH)
        expect(response).toEqual(
            `Successfully set ${pinEnumNames[doutPin]} to ${stateEnumNames[DoutTriState.HIGH]}.`)
    })

    // set_dout_config LOW test suite
    test.each([
        [DOUTPins.DOUT1],
        [DOUTPins.DOUT2],
        [DOUTPins.DOUT3],
        [DOUTPins.DOUT4],
        [DOUTPins.DOUT5],
        [DOUTPins.DOUT6],
        [DOUTPins.DOUT7],
        [DOUTPins.DOUT8]
    ])('should set dout pin to LOW and and get correct successmsg', async (doutPin) => {
        const response = await dout.setDoutState(doutPin, DoutTriState.LOW)
        expect(response).toEqual(
            `Successfully set ${pinEnumNames[doutPin]} to ${stateEnumNames[DoutTriState.LOW]}.`)
    })
})