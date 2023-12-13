import * as protobuf from "protobufjs";
import path from "path";
import { RpcChannel } from "../../rpcChannel/RpcChannel";
import type {
  serverResponse,
  serviceRequest,
} from "../../rpcChannel/ReqRepTypes";
import { PWMConfig, PWM, Polarity } from "../PwmService/PwmTypes";
import { createConfigArgsList } from "../util/helpers";
import { SuccessMsg, GetDutyCycle, GetFrequency, GetPolarity, GetEnabled } from '../rpcServiceTypes';
import { Console } from "console";

const protoPckgPath = path.join(require.resolve('@edgepi-cloud/edgepi-rpc-protobuf'), '../edgepi_rpc_protos');

/**
 * @constructor PWM class for calling EdgePi PWM SDK methods through RPC
 */
class PWMService {
  rpcProtoRoot: protobuf.Root;
  serviceProtoRoot: protobuf.Root;
  serviceName: string;
  rpcChannel: RpcChannel;

  constructor(serverEndpoint: string) {
    this.rpcProtoRoot = protobuf.loadSync(
      path.join(protoPckgPath, "rpc.proto")
    );
    this.serviceProtoRoot = protobuf.loadSync(
      path.join(protoPckgPath, "pwm.proto")
    );
    this.serviceName = "PWMService";
    this.rpcChannel = new RpcChannel(serverEndpoint, this.rpcProtoRoot);
    console.info(this.serviceName, "initialized");
  }

  /**
 * @async Calls the PWM init_pwm SDK method through an RPC request
 */
  async initPwm(PWM: PWM): Promise<string> {
    const response = await this.PWMRequest("init_pwm", PWM, "EdgePiRPC_PWM.SuccessMsg");
    return (response.content as SuccessMsg).content;
  }

  /**
   * @async Calls the PWM enable SDK method through an RPC request
   */
  async enable(PWM: PWM): Promise<string> {
    const response = await this.PWMRequest("enable", PWM, "EdgePiRPC_PWM.SuccessMsg");
    return (response.content as SuccessMsg).content;
  }

  /**
   * @async Calls the PWM disable SDK method through an RPC request
   */
  async disable(PWM: PWM): Promise<string> {
    const response = await this.PWMRequest("disable", PWM, "EdgePiRPC_PWM.SuccessMsg");
    return (response.content as SuccessMsg).content;
  }

  /**
   * @async Calls the PWM close SDK method through an RPC request
   */
  async close(PWM: PWM): Promise<string> {
    const response = await this.PWMRequest("close", PWM, "EdgePiRPC_PWM.SuccessMsg");
    return (response.content as SuccessMsg).content;
  }

  /**
   * @async Calls the PWM frequency SDK method through an RPC request
   */
  async getFrequency(PWM: PWM): Promise<number> {
    const response = await this.PWMRequest("get_frequency", PWM, "EdgePiRPC_PWM.GetFrequency");
    return (response.content as GetFrequency).frequency;
  }

  /**
   * @async Calls the PWM get_duty_cycle SDK method through an RPC request
   */
  async getDutyCycle(PWM: PWM): Promise<number> {
    const response = await this.PWMRequest("get_duty_cycle", PWM, "EdgePiRPC_PWM.GetDutyCycle");
    return (response.content as GetDutyCycle).dutyCycle;
  }

  /**
   * @async Calls the PWM get_polarity SDK method through an RPC request
   */
  async getPolarity(PWM: PWM): Promise<Polarity> {
    const response = await this.PWMRequest("get_polarity", PWM, "EdgePiRPC_PWM.GetPolarity");
    return (response.content as GetPolarity).polarity;
  }

  /**
   * @async Calls the PWM get_enabled SDK method through an RPC request
   */
  async getEnabled(PWM: PWM): Promise<boolean> {
    const response = await this.PWMRequest("get_enabled", PWM, "EdgePiRPC_PWM.GetEnabled");
    return (response.content as GetEnabled).enabled;
  }

  /**
   * @async Calls the PWM set_config SDK method through RPC
   */
  async setConfig({
    pwmNum,
    frequency = undefined,
    dutyCycle = undefined,
    polarity = undefined,
  }: PWMConfig): Promise<string> {
    const requestType = this.serviceProtoRoot.lookupType(
      "EdgePiRPC_PWM.Config"
    );
    const responseType = this.serviceProtoRoot.lookupType(
      "EdgePiRPC_PWM.SuccessMsg"
    );
    const argsList = createConfigArgsList({ pwmNum, frequency, dutyCycle, polarity });

    const response = await this.handlePWMRequest(
      requestType,
      responseType,
      "set_config",
      { confArg: argsList }
    );
    return (response.content as SuccessMsg).content;
  }

  /**
   * @async Sends an RPC request for a specified PWM SDK method
   */
  private async PWMRequest(
    methodName: string,
    pwmNum: PWM,
    responseTypeName: string,
  ): Promise<serverResponse> {
    const requestType = this.serviceProtoRoot.lookupType(
      "EdgePiRPC_PWM.PWM"
    );
    const responseType = this.serviceProtoRoot.lookupType(
      responseTypeName
    );

    return await this.handlePWMRequest(
      requestType,
      responseType,
      methodName,
      { pwmNum }
    );
  }

  /**
   * @async Handles an RPC request and returns a response message
   */
  private async handlePWMRequest(
    requestType: protobuf.Type,
    responseType: protobuf.Type,
    methodName: string,
    requestMsg: Object
  ): Promise<serverResponse> {
    const serviceReq: serviceRequest = {
      serviceName: this.serviceName,
      methodName,
      requestMsg,
    };

    console.info(
      `Calling PWM ${methodName.replace(/_([a-z])/g, (_, group1) =>
        group1.toUpperCase()
      )}` + ` through Rpc Channel.`
    );

    const response: serverResponse = await this.rpcChannel.callMethod(
      serviceReq,
      requestType,
      responseType
    );

    if (response.error !== undefined) {
      throw Error(response.error);
    }
    return response;
  }
}

export { PWMService };
