# method-override

[![NPM version](https://badge.fury.io/js/method-override.svg)](http://badge.fury.io/js/method-override)
[![Build Status](https://travis-ci.org/expressjs/method-override.svg?branch=master)](https://travis-ci.org/expressjs/method-override)
[![Coverage Status](https://img.shields.io/coveralls/expressjs/method-override.svg?branch=master)](https://coveralls.io/r/expressjs/method-override)

Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.

## Install

```sh
$ npm install method-override
```

## API

**NOTE** It is very important that this module is used **before** any module that
needs to know the method of the request (for example, it _must_ be used prior to
the `csurf` module).

### methodOverride(getter, options)

Create a new middleware function to override the `req.method` property with a new
value. This value will be pulled from the provided `getter`.

- `getter` - The getter to use to look up the overridden request method for the request. (default: `_method`)
- `options.methods` - The allowed methods the original request must be in to check for a method override value. (default: `['POST']`)

If the found method is supported by node.js core, then `req.method` will be set to
this value, as if it has originally been that value. The previous `req.method`
value will be stored in `req.originalMethod`.

#### getter

This is the method of getting the override value from the request. If a function is provided,
the `req` is passed as the first argument and the method is expected to be returned. If a
string is provided, the string is used to look up the method with the following rules:

- If the string starts with `X-`, then it is treated as the name of a header and that header
  is used for the method override. If the request contains the same header multiple times, the
  first occurrence is used.
- All other strings are treated as a property in `req.body`. If the property exists in `req.body`,
  it is read and the entry is deleted from `req.body` for seamless method overrides in the body.

#### options.methods

This allows the specification of what methods(s) the request *MUST* be in in order to check for
the method override value. This defaults to only `POST` methods, which is the only method the
override should arrive in. More methods may be specified here, but it may introduce security
issues and cause weird behavior when requests travel through caches. This value is an array
of methods in upper-case. `null` can be specified to allow all methods.

## Examples

### override in POST bodies

```js
var bodyParser     = require('body-parser')
var connect        = require('connect')
var methodOverride = require('method-override')

// override with the _method key within urlencoded bodies
app.use(bodyParser.urlencoded())
app.use(methodOverride('_method'))
```

### override using a header

```js
var connect        = require('connect')
var methodOverride = require('method-override')

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'))
```

### multiple format support

```js
var connect        = require('connect')
var methodOverride = require('method-override')

// override with different headers; last one takes precedence
app.use(methodOverride('X-HTTP-Method'))          // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override'))      // IBM
```

### custom logic

```js
var connect        = require('connect')
var methodOverride = require('method-override')

app.use(methodOverride(function(req){
  if (req.user) {
    // only logged-in users can override methods
    return req.headers['x-http-method-override']
  }
}))
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
