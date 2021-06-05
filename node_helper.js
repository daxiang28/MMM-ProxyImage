const NodeHelper = require("node_helper")
const url = require('url');
const urllib = require('urllib');

module.exports = NodeHelper.create({
	start: function() {
		this.config = {};
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification == "INIT") {
	  		this.config[payload.instanceName] = payload;
			if (payload.slideInterval) {
				// Instance specific vars
				this.config[payload.instanceName]['cycles'] = Math.floor(payload.slideInterval / payload.updateInterval);
				this.config[payload.instanceName]['lastHostIndex'] = 0
				this.config[payload.instanceName]['cycleCount'] = 0
			}
	  		this.webserver();
		}
  	},

	webserver: function() {
		this.expressApp.get(`/${this.name}/:config`, async (req, res) => {
			let { host, user, pass, lastHostIndex, cycles, cycleCount, authType } = this.config[req.params.config];
			
			if (typeof host === 'object') {
				let nextIndex = lastHostIndex;				
				this.config[req.params.config].cycleCount = cycleCount + 1;

				if (cycleCount >= cycles) {
					nextIndex = (lastHostIndex + 1 >= host.length) ? 0 : lastHostIndex + 1;
					this.config[req.params.config].cycleCount = 0;
				}

				const { auth, href } = url.parse(host[nextIndex]);
				host = href;
				if (auth) {
					[user, pass] = auth.split(':');
				}

				this.config[req.params.config].lastHostIndex = nextIndex;
			}

			try {
				let authOptions = {};
				const authKey = authType === 'digest' ? 'digestAuth' : 'auth';
				if (user && pass) {
					authOptions[authKey] = `${user}:${pass}`;
				}
	
				const response = await urllib.request(host, {
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
})
