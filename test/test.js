
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
    .expect(200, 'GET', done)
  })

  it('should be case in-sensitive', function(done){
    request(server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-HTTP-Method-Override', 'DELETE')
    .expect(200, 'DELETE', done)
  })

  it('should ignore invalid methods', function(done){
    request(server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-HTTP-Method-Override', 'POST')
    .expect(200, 'POST', done)
  })
})

function createServer() {
  var _override = methodOverride()
  return http.createServer(function (req, res) {
    _override(req, res, function (err) {
      res.statusCode = err ? 500 : 200
      res.end(err ? err.message : req.method)
    })
  })
}
