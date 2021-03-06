import forge, { configs } from 'src/index'

describe('mappersmith', () => {
  describe('#forge', () => {
    let originalConfig,
      manifest,
      gatewayClass,
      gatewayInstance

    beforeEach(() => {
      if (!originalConfig) {
        originalConfig = configs.gateway
      }

      manifest = {
        resources: {
          Test: {
            method: { path: '/test' }
          }
        }
      }

      gatewayInstance = { call: jest.fn() }
      gatewayClass = jest.fn(() => gatewayInstance)
    })

    afterEach(() => {
      configs.gateway = originalConfig
    })

    it('builds a new client with the configured gateway', () => {
      configs.gateway = gatewayClass

      const client = forge(manifest)
      expect(client.Test).toEqual(expect.any(Object))
      expect(client.Test.method).toEqual(expect.any(Function))

      client.Test.method()
      expect(gatewayClass).toHaveBeenCalled()
      expect(gatewayInstance.call).toHaveBeenCalled()
    })

    describe('when config.gateway changes', () => {
      it('make calls using the new configuration', () => {
        configs.gateway = gatewayClass
        const client = forge(manifest)

        client.Test.method()
        expect(gatewayClass).toHaveBeenCalled()
        expect(gatewayClass.mock.calls.length).toEqual(1)

        const newGatewayInstance = { call: jest.fn() }
        const newGatewayClass = jest.fn(() => newGatewayInstance)
        configs.gateway = newGatewayClass

        client.Test.method()
        expect(newGatewayClass).toHaveBeenCalled()
        expect(gatewayClass.mock.calls.length).toEqual(1)
      })
    })
  })
})
