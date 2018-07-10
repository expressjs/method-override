
var http = require('http')
var methodOverride = require('..')
var request = require('supertest')

describe('methodOverride(getter)', function () {
  it('should not touch the method by default', function (done) {
    var server = createServer()
    request(server)
      .get('/')
      .expect('X-Got-Method', 'GET', done)
  })

  it('should use X-HTTP-Method-Override by default', function (done) {
    var server = createServer()
    request(server)
      .post('/')
      .set('X-HTTP-Method-Override', 'DELETE')
      .expect('X-Got-Method', 'DELETE', done)
  })

  describe('with query', function () {
    it('should work missing query', function (done) {
      var server = createServer('_method')

      request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .expect('X-Got-Method', 'POST', done)
    })

    it('should be case in-sensitive', function (done) {
      var server = createServer('_method')

      request(server)
        .post('/?_method=DELete')
        .set('Content-Type', 'application/json')
        .expect('X-Got-Method', 'DELETE', done)
    })

    it('should ignore invalid methods', function (done) {
      var server = createServer('_method')

      request(server)
        .post('/?_method=BOGUS')
        .set('Content-Type', 'application/json')
        .expect('X-Got-Method', 'POST', done)
    })

    it('should handle key referencing array', function (done) {
      var server = createServer('_method')

      var test = request(server).post('/')
      test.request().path += '?_method=DELETE&_method=PUT' // supertest mangles query params
      test.set('Content-Type', 'application/json')
      test.expect('X-Got-Method', 'DELETE', done)
    })

    it('should only work with POST', function (done) {
      var server = createServer('_method')

      request(server)
        .delete('/?_method=PATCH')
        .set('Content-Type', 'application/json')
        .expect('X-Got-Method', 'DELETE', done)
    })
  })

  describe('with header', function () {
    var server
    before(function () {
      server = createServer('X-HTTP-Method-Override')
    })

    it('should work missing header', function (done) {
      request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .expect('X-Got-Method', 'POST', done)
    })

    it('should be case in-sensitive', function (done) {
      request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .set('X-HTTP-Method-Override', 'DELete')
        .expect('X-Got-Method', 'DELETE', done)
    })

    it('should ignore invalid methods', function (done) {
      request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .set('X-HTTP-Method-Override', 'BOGUS')
        .expect('X-Got-Method', 'POST', done)
    })

    it('should handle multiple headers', function (done) {
      request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .set('X-HTTP-Method-Override', 'DELETE, PUT')
        .expect('X-Got-Method', 'DELETE', done)
    })

    it('should set Vary header', function (done) {
      request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .set('X-HTTP-Method-Override', 'DELETE')
        .expect('Vary', 'X-HTTP-Method-Override')
        .expect('X-Got-Method', 'DELETE', done)
    })

    it('should set Vary header even with no override', function (done) {
      request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .expect('Vary', 'X-HTTP-Method-Override')
        .expect('X-Got-Method', 'POST', done)
    })
  })

  describe('with function', function () {
    var server
    before(function () {
      server = createServer(function (req) {
        return req.headers['x-method-override'] || 'PaTcH'
      })
    })

    it('should work missing header', function (done) {
      request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .expect('X-Got-Method', 'PATCH', done)
    })

    it('should be case in-sensitive', function (done) {
      request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .set('X-Method-Override', 'DELete')
        .expect('X-Got-Method', 'DELETE', done)
    })

    it('should ignore invalid methods', function (done) {
      request(server)
        .post('/')
        .set('Content-Type', 'application/json')
        .set('X-Method-Override', 'BOGUS')
        .expect('X-Got-Method', 'POST', done)
    })
  })

  describe('given "options.methods"', function () {
    it('should allow other methods', function (done) {
      var server = createServer('X-HTTP-Method-Override', { methods: ['POST', 'PATCH'] })
      request(server)
        .patch('/')
        .set('Content-Type', 'application/json')
        .set('X-HTTP-Method-Override', 'DELETE')
        .expect('X-Got-Method', 'DELETE', done)
    })

    it('should allow all methods', function (done) {
      var server = createServer('X-HTTP-Method-Override', { methods: null })
      request(server)
        .patch('/')
        .set('Content-Type', 'application/json')
        .set('X-HTTP-Method-Override', 'DELETE')
        .expect('X-Got-Method', 'DELETE', done)
    })

    it('should not call getter when method not allowed', function (done) {
      var server = createServer(function (req) { return 'DELETE' })
      request(server)
        .patch('/')
        .set('Content-Type', 'application/json')
        .expect('X-Got-Method', 'PATCH', done)
    })
  })
})

function createServer (getter, opts, fn) {
  var _override = methodOverride(getter, opts)
  return http.createServer(function (req, res) {
    fn && fn(req, res)
    _override(req, res, function (err) {
      res.statusCode = err ? 500 : 200
      res.setHeader('X-Got-Method', req.method)
      res.end(err ? err.message : JSON.stringify(req.body))
    })
  })
}
