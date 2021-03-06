import MethodDescriptor from 'src/method-descriptor'
import Request from 'src/request'
import BasicAuthMiddleware from 'src/middlewares/basic-auth'

describe('Middleware / BasicAuth', () => {
  let methodDescriptor, request, authData, middleware

  beforeEach(() => {
    methodDescriptor = new MethodDescriptor({ method: 'get' })
    request = new Request(methodDescriptor)
    authData = { username: 'bob', password: 'bob' }
    middleware = BasicAuthMiddleware(authData)()
  })

  it('configures the auth data', () => {
    const newRequest = middleware.request(request)
    expect(newRequest.auth()).toEqual(authData)
  })

  describe('when the auth property is explicitly defined', () => {
    it('keeps the original auth data', () => {
      const authData2 = { username: 'bob', password: 'bill' }
      request = new Request(methodDescriptor, { auth: authData2 })
      const newRequest = middleware.request(request)
      expect(newRequest.auth()).toEqual(authData2)
    })
  })
})
