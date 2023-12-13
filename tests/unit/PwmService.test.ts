import * as protobuf from "protobufjs";
import { RpcChannel } from "../../src/rpcChannel/RpcChannel";
import { PWMService } from "../../src/services/PwmService/PwmService";
import { PWMPins, Polarity } from "../../src/services/PwmService/PwmEnums";
import type {
  serverResponse,
  serviceRequest,
} from "../../src/rpcChannel/ReqRepTypes";
import { hasUncaughtExceptionCaptureCallback } from "process";

// Mock dependencies
jest.mock("protobufjs", () => {
  const mockProto = {
    values: {
      pwmPin: {
        PWM1: 0,
        PWM2: 1,
      },
      Polarity: {
        NORMAL: 0,
        INVERSED: 1,
      },
    },
  };
  const mockRoot = {
    lookupType: jest.fn(),
    lookupEnum: jest.fn().mockReturnValue(mockProto),
  } as unknown as protobuf.Root;
  return {
    loadSync: jest.fn().mockReturnValue(mockRoot),
  };
});

jest.mock("../../src/rpcChannel/RpcChannel", () => {
  return {
    RpcChannel: jest.fn().mockImplementation(() => {
      return { callMethod: jest.fn() };
    }),
  };
});

describe("PWMService test suite", () => {
  const pwm: PWMService = new PWMService("fake_endpoint");

  // Test init
  it("should be defined", () => {
    expect(pwm).toBeDefined();
    expect(protobuf.loadSync).toBeCalledTimes(3);
    expect(RpcChannel).toHaveBeenCalled();
  });

  describe("PWMService setConfig function", () => {
    it("should call setConfig and return a success message", async () => {
      const successMsg = "Successfully applied pwm configurations.";
      const mockMsgType = {} as unknown as protobuf.Type;
      const mockResponse = {
        error: undefined,
        content: {
          content: successMsg,
        },
      } as unknown as serverResponse;
      const mockServiceRequest = {
        serviceName: "PWMService",
        methodName: "set_config",
        requestMsg: {
          confArg: [],
        },
      } as unknown as serviceRequest;

      const mockReturnValue = jest
        .spyOn(pwm.serviceProtoRoot, "lookupType")
        .mockReturnValue(mockMsgType);
      const mockResolvedValue = jest
        .spyOn(pwm.rpcChannel, "callMethod")
        .mockResolvedValue(mockResponse);

      const result = await pwm.setConfig({ pwmNum: PWMPins.PWM1 });
      expect(mockReturnValue).toBeCalledTimes(2);
      expect(mockResolvedValue).toHaveBeenCalledWith(mockServiceRequest, mockMsgType, mockMsgType);
      expect(result).toEqual(successMsg);
    });
  });

  describe("PWMService PWMRequest function", () => {
    it("should call enable function and return a success message", async () => {
      const successMsg = "Successfully enabled PWM1.";
      const mockMsgType = {} as unknown as protobuf.Type;
      const mockResponse = {
        error: undefined,
        content: {
          content: successMsg,
        },
      } as unknown as serverResponse;
      const mockServiceRequest = {
        serviceName: "PWMService",
        methodName: "enable",
        requestMsg: {
          PWM: PWMPins.PWM1,
        },
      } as unknown as serviceRequest;

      const mockReturnValue = jest
        .spyOn(pwm.serviceProtoRoot, "lookupType")
        .mockReturnValue(mockMsgType);
      const mockResolvedValue = jest
        .spyOn(pwm.rpcChannel, "callMethod")
        .mockResolvedValue(mockResponse);

      const result = await pwm.enable( PWMPins.PWM1 );
      expect(mockReturnValue).toBeCalledTimes(4);
      expect(mockResolvedValue).toHaveBeenCalledWith(mockServiceRequest, mockMsgType, mockMsgType);
      expect(result).toEqual(successMsg);
    });
  });
});
