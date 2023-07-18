import type * as protobuf from 'protobufjs'
import { generateService } from '../helpers'

interface TcService extends protobuf.rpc.Service {
  single_sample: (request: Record<string, any>, callback: protobuf.rpc.ServiceMethodCallback) => Promise<void>
}

class TcService {
  serviceStub: TcService

  constructor () {
    this.serviceStub = generateService('TcService') as TcService
  }

  async singleSample (): Promise<number[]> {
    await this.serviceStub.single_sample({}, (error, response) => {
      if (error !== null) {
        console.log('Error occured', error)
      } else {
        console.log(response)
      }
    })
  }
}

const t = new TcService()

t.singleSample()

export { TcService }
