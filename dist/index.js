"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.configurationSchema = void 0;
var _passportTrustedHeader = require("passport-trusted-header");
const _excluded = ["userHeader"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const DEFAULTS = {
  disableRequestedAuthnContext: false
};
const configurationSchema = exports.configurationSchema = {
  type: 'object',
  properties: {
    userHeader: {
      title: 'User Header',
      description: 'HTTP header field to use for username',
      type: 'string'
    }
  },
  required: ['userHeader']
};
class AuthTrustedHeaderXoPlugin {
  constructor({
    staticConfig,
    xo
  }) {
    this._conf = null;
    this._strategyOptions = staticConfig.strategyOptions;
    this._unregisterPassportStrategy = undefined;
    this._xo = xo;
    this._userHeader = null;
  }
  configure(_ref, {
    loaded
  }) {
    var _this = this;
    return _asyncToGenerator(function* () {
      let userHeader = _ref.userHeader,
        conf = _objectWithoutProperties(_ref, _excluded);
      _this._userHeader = userHeader.toLowerCase();
      _this._conf = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, _this._strategyOptions), DEFAULTS), conf), {}, {
        headers: [_this._userHeader]
      });
      if (loaded) {
        yield _this.unload();
        yield _this.load();
      }
    })();
  }
  load() {
    var _this2 = this;
    const xo = this._xo;
    this._unregisterPassportStrategy = xo.registerPassportStrategy(new _passportTrustedHeader.Strategy(this._conf, function () {
      var _ref2 = _asyncToGenerator(function* (requestHeaders, done) {
        const userName = requestHeaders[_this2._userHeader];
        if (!userName) {
          console.warn('xo-server-auth-trustedheader:', requestHeaders);
          done('no username passed in http headers');
          return;
        }
        try {
          done(null, yield xo.registerUser2('trustedheader', {
            user: {
              id: userName,
              name: userName
            }
          }));
        } catch (error) {
          done(error.message);
        }
      });
      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }()));
  }
  unload() {
    this._unregisterPassportStrategy();
  }
}
var _default = opts => new AuthTrustedHeaderXoPlugin(opts);
exports.default = _default;
//# sourceMappingURL=index.js.map
