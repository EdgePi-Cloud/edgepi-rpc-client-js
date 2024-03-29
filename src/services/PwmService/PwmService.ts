import * as protobuf from 'protobufjs'
import path from 'path'
import { RpcChannel } from '../../rpcChannel/RpcChannel'
import type {
  serverResponse,
  serviceRequest
} from '../../rpcChannel/ReqRepTypes'
import { type PWMConfig, type PWM, type Polarity, type PWMSettingsType } from '../PwmService/PwmTypes'
import { createConfigArgsList } from '../util/helpers'
import {
  type SuccessMsg,
  type GetDutyCycle,
  type GetFrequency,
  type GetPolarity,
  type GetEnabled,
  type PWMSettings
} from '../rpcServiceTypes'

const protoPckgPath = path.join(
  require.resolve('@edgepi-cloud/edgepi-rpc-protobuf'),
  '../edgepi_rpc_protos'
)

const SUCCESS_MSG = 'EdgePiRPC_PWM.SuccessMsg'
const PWM_SETTINGS = 'EdgePiRPC_PWM.PWMSettings'
const GET_FREQUENCY = 'EdgePiRPC_PWM.GetFrequency'
const GET_DUTY_CYCLE = 'EdgePiRPC_PWM.GetDutyCycle'
const GET_POLARITY = 'EdgePiRPC_PWM.GetPolarity'
const GET_ENABLED = 'EdgePiRPC_PWM.GetEnabled'
const PWM_TYPE = 'EdgePiRPC_PWM.PWM'
const CONFIG_TYPE = 'EdgePiRPC_PWM.Config'

/**
 * @constructor PWM class for calling EdgePi PWM SDK methods through RPC
 */
class PWMService {
  rpcProtoRoot: protobuf.Root
  serviceProtoRoot: protobuf.Root
  serviceName: string
  rpcChannel: RpcChannel

  constructor (serverEndpoint: string) {
    this.rpcProtoRoot = protobuf.loadSync(
      path.join(protoPckgPath, 'rpc.proto')
    )
    this.serviceProtoRoot = protobuf.loadSync(
      path.join(protoPckgPath, 'pwm.proto')
    )
    this.serviceName = 'PWMService'
    this.rpcChannel = new RpcChannel(serverEndpoint, this.rpcProtoRoot)
    console.info(this.serviceName, 'initialized')
  }

  /**
   * @async Calls the PWM init_pwm SDK method through an RPC request
   */
  async initPwm (PWM: PWM): Promise<string> {
    const response = await this.PWMRequest('init_pwm', PWM, SUCCESS_MSG)
    return (response.content as SuccessMsg).content
  }

  /**
   * @async Calls the PWM enable SDK method through an RPC request
   */
  async enable (PWM: PWM): Promise<string> {
    const response = await this.PWMRequest('enable', PWM, SUCCESS_MSG)
    return (response.content as SuccessMsg).content
  }

  /**
   * @async Calls the PWM disable SDK method through an RPC request
   */
  async disable (PWM: PWM): Promise<string> {
    const response = await this.PWMRequest('disable', PWM, SUCCESS_MSG)
    return (response.content as SuccessMsg).content
  }

  /**
   * @async Calls the PWM close SDK method through an RPC request
   */
  async close (PWM: PWM): Promise<string> {
    const response = await this.PWMRequest('close', PWM, SUCCESS_MSG)
    return (response.content as SuccessMsg).content
  }

  /**
   * @async Calls the PWM settings SDK method through an RPC request
   */
  async getSettings (PWM: PWM): Promise<PWMSettingsType> {
    const response = await this.PWMRequest('get_settings', PWM, PWM_SETTINGS)
    return (response.content as PWMSettings)
  }

  /**
   * @async Calls the PWM frequency SDK method through an RPC request
   */
  async getFrequency (PWM: PWM): Promise<number> {
    const response = await this.PWMRequest('get_frequency', PWM, GET_FREQUENCY)
    return (response.content as GetFrequency).frequency
  }

  /**
   * @async Calls the PWM get_duty_cycle SDK method through an RPC request
   */
  async getDutyCycle (PWM: PWM): Promise<number> {
    const response = await this.PWMRequest(
      'get_duty_cycle',
      PWM,
      GET_DUTY_CYCLE
    )
    return (response.content as GetDutyCycle).dutyCycle
  }

  /**
   * @async Calls the PWM get_polarity SDK method through an RPC request
   */
  async getPolarity (PWM: PWM): Promise<Polarity> {
    const response = await this.PWMRequest('get_polarity', PWM, GET_POLARITY)
    return (response.content as GetPolarity).polarity
  }

  /**
   * @async Calls the PWM get_enabled SDK method through an RPC request
   */
  async getEnabled (PWM: PWM): Promise<boolean> {
    const response = await this.PWMRequest('get_enabled', PWM, GET_ENABLED)
    return (response.content as GetEnabled).enabled
  }

  /**
   * @async Calls the PWM set_config SDK method through RPC
   */
  async setConfig ({
    pwmNum,
    frequency = undefined,
    dutyCycle = undefined,
    polarity = undefined
  }: PWMConfig): Promise<string> {
    const requestType = this.serviceProtoRoot.lookupType(CONFIG_TYPE)
    const responseType = this.serviceProtoRoot.lookupType(SUCCESS_MSG)
    const argsList = createConfigArgsList({
      pwmNum,
      frequency,
      dutyCycle,
      polarity
    })

    const response = await this.handlePWMRequest(
      requestType,
      responseType,
      'set_config',
      { confArg: argsList }
    )
    return (response.content as SuccessMsg).content
  }

  /**
   * @async Sends an RPC request for a specified PWM SDK method
   */
  private async PWMRequest (
    methodName: string,
    pwmNum: PWM,
    responseTypeName: string
  ): Promise<serverResponse> {
    const requestType = this.serviceProtoRoot.lookupType(PWM_TYPE)
    const responseType = this.serviceProtoRoot.lookupType(responseTypeName)

    return await this.handlePWMRequest(requestType, responseType, methodName, {
      pwmNum
    })
  }

  /**
   * @async Handles an RPC request and returns a response message
   */
  private async handlePWMRequest (
    requestType: protobuf.Type,
    responseType: protobuf.Type,
    methodName: string,
    requestMsg: Record<string, unknown>
  ): Promise<serverResponse> {
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName,
      requestMsg
    }

    console.info(
      `Calling PWM ${methodName.replace(/_([a-z])/g, (_, group1) =>
        group1.toUpperCase()
      )}` + ' through Rpc Channel.'
    )

    const response: serverResponse = await this.rpcChannel.callMethod(
      serviceReq,
      requestType,
      responseType
    )

    if (response && !response.error) {
      return response
    } else {
      throw new Error(
        response ? response.error : 'Response is null or undefined.'
      )
    }
  }
}

export { PWMService }
