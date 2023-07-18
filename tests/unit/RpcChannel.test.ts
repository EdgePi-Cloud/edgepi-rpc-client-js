import * as protobuf from 'protobufjs';
import { RpcChannel } from '../../src/rpcChannel/RpcChannelnnel/RpcChannel';


describe('RpcChannel', () => {
  let socketEndpoint: string;
  let protoRoot: protobuf.Root;
  let rpcChannel: RpcChannel;

  beforeEach(() => {
    socketEndpoint = 'fake_endpoint';
    protoRoot = new protobuf.Root();
    // Mock type lookup
    const mockedMsgType = 
      { 
        create: jest.fn(),
        encode: jest.fn().mockReturnValueOnce({
          finish: jest.fn().mockReturnValueOnce({}) }) } as unknown as protobuf.Type;
    jest.spyOn(protoRoot, 'lookupType').mockReturnValueOnce(mockedMsgType);
    
    rpcChannel = new RpcChannel(socketEndpoint, protoRoot);

  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Test class init
  it('should be defined', () =>{
    expect(rpcChannel).toBeDefined();
  })

  describe('createRpcRequest', () => {
    it('should throw an error if method parent is null', () => {
      const method = { parent: null, name: 'SomeMethod' } as protobuf.Method;
      const requestData = new Uint8Array();

      expect(() => rpcChannel.createRpcRequest(method, requestData)).toThrowError(
        'Method parent is null. Could not find requested service.'
      );
    });

    it('should create and return an RpcRequest message', () => {
      const serviceName = 'SomeService';
      const methodName = 'SomeMethod';
      const requestData = new Uint8Array();
      
      const createSpy = jest.spyOn(rpcChannel.rpcRequestType, 'create').mockReturnValueOnce({} as protobuf.Message);

      const rpcRequest = rpcChannel.createRpcRequest(
        { parent: { name: serviceName }, name: methodName } as protobuf.Method,
        requestData
      );

      expect(createSpy).toHaveBeenCalledWith({
        serviceName: serviceName,
        methodName: methodName,
        requestProto: requestData,
      });
      expect(rpcRequest).toEqual({} as protobuf.Message);
    });

    describe('sendRpcRequest', () => {
      it('should encode and send the RPC request over the socket', async () => {
        const rpcRequest = {} as protobuf.Message;
        const sendSpy = jest.spyOn(rpcChannel.socket, 'send').mockResolvedValueOnce(undefined);
  
        await rpcChannel.sendRpcRequest(rpcRequest);
  
        expect(rpcChannel.rpcRequestType.encode).toHaveBeenCalledWith(rpcRequest);
        expect(sendSpy).toHaveBeenCalledWith({});
      });
    });

    describe('getRpcResponse', () => {
      it('should receive and return the RPC response from the server', async () => {
        const rpcResponseData = new Uint8Array() as Buffer;
        const receiveSpy = jest.spyOn(rpcChannel.socket, 'receive').mockResolvedValueOnce([rpcResponseData]);
  
        const response = await rpcChannel.getRpcResponse();
  
        expect(receiveSpy).toHaveBeenCalled();
        expect(response).toBe(rpcResponseData);
      });
    });

    describe('callMethod', () => {
      let method: protobuf.Method;
      let requestData: Uint8Array;
      let callback: protobuf.RPCImplCallback;
  
      beforeEach(() => {
        method = { parent: { name: 'SomeService' }, name: 'SomeMethod' } as protobuf.Method;
        requestData = new Uint8Array();
        callback = jest.fn();
      });
  
      it('should create an RPC request, send it, and invoke the callback with the response', async () => {
        const rpcRequest = {} as protobuf.Message;
        const rpcResponse = new Uint8Array() as Buffer;
        
        // Mock rpcChannel methods within callMethod
        const createRpcRequestSpy = jest.spyOn(rpcChannel, 'createRpcRequest').mockReturnValueOnce(rpcRequest);
        const sendRpcRequestSpy = jest.spyOn(rpcChannel, 'sendRpcRequest').mockResolvedValueOnce(undefined);
        const getRpcResponseSpy = jest.spyOn(rpcChannel, 'getRpcResponse').mockResolvedValueOnce(rpcResponse);
  
        await rpcChannel.callMethod(method, requestData, callback);
  
        expect(createRpcRequestSpy).toHaveBeenCalledWith(method, requestData);
        expect(sendRpcRequestSpy).toHaveBeenCalledWith(rpcRequest);
        expect(getRpcResponseSpy).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith(null, rpcResponse);
      });
  
      it('should invoke the callback with an error if an exception occurs', async () => {
        const error = new Error('Some error');
  
        const createRpcRequestSpy = jest.spyOn(rpcChannel, 'createRpcRequest').mockImplementation(() => {
          throw error;
        });
  
        await rpcChannel.callMethod(method, requestData, callback);
  
        expect(createRpcRequestSpy).toHaveBeenCalledWith(method, requestData);
        expect(callback).toHaveBeenCalledWith(error);
      });
    });
  });

});
