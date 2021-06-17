const NodeHelper = require('node_helper');
const url = require('url');
const urllib = require('urllib');

module.exports = NodeHelper.create({
  start() {
    this.config = {};
  },

  socketNotificationReceived(notification, payload) {
    if (notification === 'INIT') {
      this.config[payload.instanceName] = payload;
      if (payload.slideInterval) {
        // Instance specific vars
        this.config[payload.instanceName].cycles = Math.floor(
          payload.slideInterval / payload.updateInterval
        );
        this.config[payload.instanceName].lastHostIndex = 0;
        this.config[payload.instanceName].cycleCount = 0;
      }
      this.webserver();
    }
  },

  webserver() {
    this.expressApp.get(`/${this.name}/:config`, async (req, res) => {
      const config = this.config[req.params.config];
      const { lastHostIndex, cycles, cycleCount, authType } = config;
      let href;
      let { host, user, pass, port } = config;

      const parseUrl = (h) => {
        const { auth, href: parsedHref, port: parsedPort } = url.parse(h);
        let parsedUser;
        let parsedPass;
        if (auth) {
          [parsedUser, parsedPass] = auth.split(':');
        }
        return [parsedUser, parsedPass, parsedPort, parsedHref];
      };

      if (typeof host === 'object') {
        let nextIndex = lastHostIndex;
        this.config[req.params.config].cycleCount = cycleCount + 1;

        if (cycleCount >= cycles) {
          // TODO figure out how to handle index problem underined error
          nextIndex = lastHostIndex + 1 >= host.length ? 0 : lastHostIndex + 1;
          this.config[req.params.config].cycleCount = 0;
        }
        [user, pass, port, href] = parseUrl(host[nextIndex]);
        host = href;
        this.config[req.params.config].lastHostIndex = nextIndex;
      } else {
        const [parsedUser, parsedPass, parsedPort] = parseUrl(host);
        if (!user) user = parsedUser;
        if (!pass) pass = parsedPass;
        if (!port) port = parsedPort;
      }

      try {
        const authOptions = {};
        const authKey = authType === 'digest' ? 'digestAuth' : 'auth';
        if (user && pass) {
          authOptions[authKey] = `${user}:${pass}`;
        }

        const response = await urllib.request(`${host}`, {
          method: 'GET',
          ...authOptions
        });

        res.set('Content-Type', 'image/jpeg');
        res.set('Cache-Control', 'no-store');
        res.end(response.data, 'binary');
      } catch (e) {
        res.end(e.message);
      }
    });
  }
});
