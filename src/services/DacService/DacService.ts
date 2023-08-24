import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type { serverResponse, serviceRequest } from '../../rpcChannel/ReqRepTypes'
import type { DACChannel, GainStateMsg, GetState, State, StateMsg } from './DacTypes'
import { SuccessMsg } from '../serviceTypes/successMsg'

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/rpc-protobuf'), '..');

/**
 * @constructor DinService class for calling EdgePi digital input SDK methods through RPC
 * @param serverEndpoint String representation of the RPC Server's endpoint
 */
class DacService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor (serverEndpoint: string) {
    this.rpcProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'rpc.proto'))
    this.serviceProtoRoot = protobuf.loadSync(path.join(protoPckgPath,'dac.proto'))
    this.serviceName = 'DacService'
    this.rpcChannel = new RpcChannel(serverEndpoint, this.rpcProtoRoot)
    console.info(this.serviceName, "initialized")
  }

   /**
   * @async Calls the EdgePi set_dac_gain SDK method through RPC
   * @param 
   * @returns {Promise<boolean>} state of gain pin
  */
  async setDacGain(setGain: boolean, autoCodeChange: boolean = false): Promise<boolean> {
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_DAC.Gain')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_DAC.GainState')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'set_dac_gain',
      requestMsg: {
        setGain,
        autoCodeChange
      }
    }
    // Call method through rpc
    console.info("Calling DAC setDacGain through Rpc Channel..")
    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
 
    const stateMsg: GainStateMsg = response.content as GainStateMsg
    return stateMsg.gainState
    
  }

  /**
   * @async Calls the EdgePi writeVoltage SDK method through RPC
   * @param {DACChannel} dacChannel DAC Channel to write to
   * @param {number} voltage voltage to write to the requested channel
   * @returns {Promise<string>} A success message
  */
  async writeVoltage(dacChannel: DACChannel, voltage: number): Promise<string> {
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_DAC.WriteVoltage')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_DAC.SuccessMsg')
    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'write_voltage',
      requestMsg: {
        dacChannel,
        voltage
      }
    }
    // Call method through rpc
    console.info("Calling DAC writeVoltage through Rpc Channel..")
    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
 
    const success: SuccessMsg = response.content as SuccessMsg
    return success.content
    
  }

  /**
   * @async Calls the EdgePi get_state SDK method through RPC
   * @param {GetState} GetState Parameters for getState
   * @param {DACChannel} GetState.analogOut Requested channel
   * @param {boolean} GetState.code Requesting the current code value written in the 
   * specified channel input register. false if not requested
   * @param {boolean} GetState.voltage Requesting the current expected voltage. 
   * false if not requested
   * @param {boolean} GetState.gain Requesting the current gain value set for the DAC.
   * false if not requested
   * @returns {Promise<State>} An object with the current state information 
   * for the specified DAC channel. The object will have no information on unrequested
   * parameters
  */
  async getState(
    { 
      analogOut, 
      code = false, 
      voltage = false, 
      gain = false
    }: GetState
    ): Promise<State> {
  
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_DAC.GetState')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_DAC.State')

    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'get_state',
      requestMsg: {
        dacChannel: analogOut,
        code,
        voltage,
        gain
      }
    }
    // Call method through rpc
    console.info("Calling DAC getState through Rpc Channel..")
    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
 
    const stateMsg: StateMsg = response.content as StateMsg

    return {
      codeVal: stateMsg.codeVal,
      voltageVal: stateMsg.voltageVal,
      gainState: stateMsg.gainState
    } as State
    
  }
  /**
   * @async Calls the EdgePi DAC reset SDK method through RPC
   * @returns {Promise<string>} Success message
  */
  async reset(): Promise<string> {
    const requestType = this.serviceProtoRoot.lookupType('EdgePiRPC_DAC.EmptyMsg')
    const responseType = this.serviceProtoRoot.lookupType('EdgePiRPC_DAC.SuccessMsg')

    // Create request
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName: 'reset',
      requestMsg: { /**Empty Msg */ }
    }
    // Call method through rpc
    console.info("Calling DAC reset through Rpc Channel..")
    const response: serverResponse =
      await this.rpcChannel.callMethod(serviceReq, requestType, responseType)

    if (response.error !== undefined) {
      throw Error(response.error)
    }
 
    const success: SuccessMsg = response.content as SuccessMsg
    return success.content

  }

}

export { DacService }