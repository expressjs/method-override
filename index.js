/*!
 * Connect - methodOverride
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var methods = require('methods');

/**
 * Method Override:
 *
 * Provides faux HTTP method support.
 *
 * Pass an optional `getter` to use when checking for
 * a method override.
 *
 * A string is converted to a getter that will look for
 * the method in `req.body[getter]` and a function will be
 * called with `req` and expects the method to be returned.
 * If the string starts with `X-` then it will look in
 * `req.headers[getter]` instead.
 *
 * The original method is available via `req.originalMethod`.
 *
 * @param {string|function} [getter=_method]
 * @return {function}
 * @api public
 */

module.exports = function methodOverride(getter){
  var get = typeof getter === 'function'
    ? getter
    : createGetter(getter || '_method')

  return function methodOverride(req, res, next) {
    var method

    req.originalMethod = req.originalMethod || req.method
    method = get(req)

    // replace
    if (method !== undefined && supports(method)) {
      req.method = method.toUpperCase()
    }

    next()
  }
}

/**
 * Create a getter for the given string.
 */

function createGetter(str) {
  if (str.substr(0, 2).toUpperCase() === 'X-') {
    // header getter
    return createHeaderGetter(str)
  }

  return createBodyGetter(str)
}

/**
 * Create a getter for the given body key name.
 */

function createBodyGetter(key) {
  return function(req) {
    var method

    if (req.body && typeof req.body === 'object' && key in req.body) {
      method = req.body[key]
      delete req.body[key]
    }

    // return first value, for rich body types
    return Array.isArray(method)
      ? method[0]
      : method
  }
}

/**
 * Create a getter for the given header name.
 */

function createHeaderGetter(str) {
  var header = str.toLowerCase()

  return function(req) {
    // multiple headers get joined with comma by node.js core
    // return first value
    return (req.headers[header] || '').split(/ *, */)[0]
  }
}

/**
 * Check if node supports `method`.
 */

function supports(method) {
  return method
    && typeof method === 'string'
    && methods.indexOf(method.toLowerCase()) !== -1
}
