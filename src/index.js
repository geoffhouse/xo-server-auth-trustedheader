import { Strategy } from 'passport-trusted-header'

// ===================================================================

const DEFAULTS = {
  disableRequestedAuthnContext: false
}

export const configurationSchema = {
  type: 'object',
  properties: {
    userHeader: {
      title: 'User Header',
      description: 'HTTP header field to use for username',
      type: 'string'
    }
  },
  required: ['userHeader']
}

// ===================================================================

class AuthTrustedHeaderXoPlugin {
  constructor({ staticConfig, xo }) {
    this._conf = null
    this._strategyOptions = staticConfig.strategyOptions
    this._unregisterPassportStrategy = undefined
    this._xo = xo
    this._userHeader = null
  }

  async configure({ userHeader, ...conf }, { loaded }) {
    this._userHeader = userHeader.toLowerCase()
    this._conf = {
      ...this._strategyOptions,
      ...DEFAULTS,
      ...conf,
      headers: [ this._userHeader ]
    }

    if (loaded) {
      await this.unload()
      await this.load()
    }
  }

  load() {
    const xo = this._xo

    this._unregisterPassportStrategy = xo.registerPassportStrategy(
      new Strategy(this._conf, async (requestHeaders, done) => {

        const userName = requestHeaders[this._userHeader];
        if (!userName) {
          console.warn('xo-server-auth-trustedheader:', requestHeaders)
          done('no username passed in http headers')
          return
        }

        try {
          done(null, await xo.registerUser2('trustedheader', { user: { id: userName, name: userName }}))
        } catch (error) {
          done(error.message)
        }
      })
    )
  }

  unload() {
    this._unregisterPassportStrategy()
  }
}

// ===================================================================

export default opts => new AuthTrustedHeaderXoPlugin(opts)
