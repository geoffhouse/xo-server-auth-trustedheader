# xo-server-auth-trustedheader

> HTTP Trusted Header authentication plugin for XO-Server

## Usage

If your XO instance is proxied behind a TLS-enabled web server, this plugin can be used to authenticate users based on an HTTP header. 
The first time a user signs in, XO will create a new user with the passed identifier as the username.

> This plugin is based on [passport-trusted-header](https://github.com/ripjar/passport-trusted-header).
> More information can be found in [its README](https://github.com/ripjar/passport-trusted-header/blob/master/README.md) but usually no further configuration is necessary

Like all other xo-server plugins, it can be configured directly via
the web interface, see [the plugin documentation](https://xen-orchestra.com/docs/plugins.html).

## Security
The connection between your proxy web server and web app must be __secure__. The front-end web server must whitelist HTTP headers to send to the web app, 
and it must be impossible for external processes to reach the web app or interfere with connections between the web server and Node.js. 

This authentication method is __completely insecure__ if these conditions are not met!

## License

[AGPL-3.0-or-later](https://spdx.org/licenses/AGPL-3.0-or-later) 
