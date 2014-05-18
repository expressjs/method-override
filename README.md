# method-override [![Build Status](https://travis-ci.org/expressjs/method-override.svg)](https://travis-ci.org/expressjs/method-override) [![NPM version](https://badge.fury.io/js/method-override.svg)](http://badge.fury.io/js/method-override)

Lets you use HTTP verbs such as PUT or DELETE in places you normally can't. It does so by checking either the x-http-method-override header or a key provided in the request's body.

Previously `connect.methodOverride()`.

## Install

```sh
$ npm install method-override
```

## API

**NOTE** It is very important that this module is used **before** any module that
needs to know the method of the request (for example, it _must_ be used prior to
the `csurf` module).

### methodOverride(key)

#### key

This is the property to look for the overwritten method in the `req.body` object.
This defaults to `"_method"`.

## Examples

```js
var bodyParser = require('body-parser')
var connect = require('connect')
var methodOverride = require('method-override')

app.use(bodyParser())
app.use(methodOverride())
```

## License

The MIT License (MIT)

Copyright (c) 2014 Jonathan Ong me@jongleberry.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
