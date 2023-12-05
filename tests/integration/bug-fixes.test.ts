const zmq = require('zeromq');

jest.unmock('zeromq')

describe('zeromq bug fix', () => {
  test('should create zmq.Context without libsodium error', () => {
    expect(() => {
      let a = new zmq.Context();
    }).not.toThrow();
  });
});
