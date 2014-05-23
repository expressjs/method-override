
var http = require('http')
var methodOverride = require('..')
var request = require('supertest')

describe('methodOverride()', function(){
  var server
  before(function () {
    server = createServer()
  })

  it('should not touch the method by default', function(done){
    request(server)
    .get('/')
    .expect('X-Got-Method', 'GET', done)
  })

  describe('with body', function(){
    it('should be case in-sensitive', function(done){
      var server = createServer('_method', {
        _method: 'DELete'
      })

      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('X-Got-Method', 'DELETE', done)
    })

    it('should ignore invalid methods', function(done){
      var server = createServer('_method', {
        _method: 'BOGUS'
      })

      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('X-Got-Method', 'POST', done)
    })

    it('should remove key from req.body', function(done){
      var server = createServer('_method', {
        foo: 'bar',
        _method: 'DELETE'
      })

      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('X-Got-Method', 'DELETE')
      .expect(200, '{"foo":"bar"}', done)
    })

    it('should handle key referencing array', function(done){
      var server = createServer('_method', {
        foo: 'bar',
        _method: ['DELETE', 'PUT']
      })

      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('X-Got-Method', 'DELETE')
      .expect(200, '{"foo":"bar"}', done)
    })

    it('should handle key referencing object', function(done){
      var server = createServer('_method', {
        foo: 'bar',
        _method: {}
      })

      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .expect('X-Got-Method', 'POST')
      .expect(200, '{"foo":"bar"}', done)
    })
  })

  describe('with header', function(){
    var server
    before(function () {
      server = createServer()
    })

    it('should be case in-sensitive', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'DELete')
      .expect('X-Got-Method', 'DELETE', done)
    })

    it('should ignore invalid methods', function(done){
      request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('X-HTTP-Method-Override', 'BOGUS')
      .expect('X-Got-Method', 'POST', done)
    })
  })
})

function createServer(key, _body) {
  var _override = methodOverride(key)
  return http.createServer(function (req, res) {
    req.body = _body
    _override(req, res, function (err) {
      res.statusCode = err ? 500 : 200
      res.setHeader('X-Got-Method', req.method)
      res.end(err ? err.message : JSON.stringify(req.body))
    })
  })
}
