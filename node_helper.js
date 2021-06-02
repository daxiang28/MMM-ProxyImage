const axios = require('axios');
const NodeHelper = require("node_helper")

module.exports = NodeHelper.create({
	start: function() {
		this.config = {};
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification == "INIT") {
	  		this.config[payload.instanceName] = payload;
	  		this.webserver();
		}
  	},

	webserver: function() {
		this.expressApp.get(`/${this.name}/:config`, async (req, res) => {
			const config = this.config[req.params.config];
			const response = await axios.get(config.host, {
				auth: {
					username: config.user,
					password: config.pass
				},
				responseType: 'arraybuffer'
			});
			res.set('Content-Type', 'image/jpeg');
			res.set('Cache-Control', 'no-store');
			res.end(response.data, 'binary');
    	});
	}
})
