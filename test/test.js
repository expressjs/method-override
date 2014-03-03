
var connect = require('connect');
var request = require('supertest');

var app = connect();
var server = app.listen();

app.use(require('../')());

app.use(function(req, res){
  res.end(req.method);
});

describe('methodOverride()', function(){
  it('should not touch the method by default', function(done){
    request(server)
    .get('/')
    .expect('GET', done);
  })

  it('should be case in-sensitive', function(done){
    request(server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-HTTP-Method-Override', 'DELETE')
    .expect('DELETE', done);
  })

  it('should ignore invalid methods', function(done){
    request(server)
    .post('/')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('X-HTTP-Method-Override', 'POST')
    .expect('POST', done);
  })
})
