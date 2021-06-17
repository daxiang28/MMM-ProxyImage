
Module.register("MMM-ProxyImage",{
	defaults: { 
		modalEnabled: false,
		modalInterval: null,
		modalTemplate: 'modal_template.njk',
		updateInterval: 4000,
		slideInterval: 10000,
		port: 80,
		height: 400,
		width: 400,
		auth: 'basic' // basic|digest
	},

	start: function() {
		// Allows for multiple instances of the module
		this.config.instanceName = (this.config.name || this.name).replace(/\s+/g, '');
		let self = this;

		// send config to node helper
		this.sendSocketNotification("INIT", this.config)

		// Schedule update timer.
		this.scheduleUpdate(this.config.updateInterval);
	},

	scheduleUpdate: function(delay) {
		let self = this;
		let nextLoad = self.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		setTimeout(function() {
			self.updateDom();
			self.scheduleUpdate();
		}, nextLoad);
	},

	showModal: function(imageSrc) {
		let self = this;
		const refreshInterval = self.config.modalInterval || self.config.updateInterval;
		this.sendNotification("OPEN_MODAL", {
			template: self.config.modalTemplate,
			data: {
				imageSrc
			},
			options: {
				callback: function(error) {
					if (error) {
						console.error('Modal rendering failed', error);
						return false;
					}
					const modalTimer = setInterval(function() {
						const modal = document.querySelector('.MMM-Modal');
						if (modal.style.opacity == 1) {
							const img = modal.querySelector('#proxy-image-modal-image');
							img.src = imageSrc;
						} else {
							clearInterval(modalTimer);
						}
					}, refreshInterval);					
				}					
			}		
		});
	},

	getDom: function() {
		let self = this;
		const d = new Date();
		const wrapperId = "proxyDiv"+self.config.instanceName;
		let wrapper = document.getElementById(wrapperId);
		const imgId = "proxyImage"+self.config.instanceName;
		let img = document.getElementById(imgId);
		const imgId2 = "proxyImage2"+self.config.instanceName;
		let img2 = document.getElementById(imgId2);
		const imageSrc = `/${self.name}/${self.config.instanceName}?${d.getTime()}`;

		if (!wrapper) {
			wrapper = document.createElement("div");
			wrapper.id = wrapperId;
			wrapper.className = "image-wrapper"
			wrapper.style.width = self.config.width + 'px';
			wrapper.style.height = self.config.height + 'px';
			wrapper.style.border = "none";
			wrapper.style.display = "block";
			wrapper.style.overflow = "hidden";
			wrapper.style.backgroundColor = self.config.backgroundColor;
			wrapper.scrolling = "no";		
		}

		if (self.config.modalEnabled) {
			wrapper.onclick = function() { self.showModal(imageSrc) };
		}

		if (!img) {
			img = document.createElement("img");
			img.id = imgId;
			img.width = self.config.width;
			img.src = imageSrc;
			wrapper.appendChild(img);

			img2 = document.createElement("img");
			img2.id = imgId2;
			img2.width = self.config.width;
			img2.style.display = 'none';
			wrapper.appendChild(img2);			
		} else {
			// Give them a chance to load before swapping
			if (img.style.display !== 'none') {
				img2.src = imageSrc;
				setTimeout(() => { img2.style.display = 'block';img.style.display = 'none'; }, 2000);				
			} else {
				img.src = imageSrc;
				setTimeout(() => { img.style.display = 'block';img2.style.display = 'none'; }, 2000);
			}
		}

		return wrapper;
	},

	suspend: function() {
		const doms = document.getElementsByClassName("image-wrapper")
		if (doms.length > 0) {
			for (let dom of doms) {
				dom.style.display = "none";
			}
		}
	},

	resume: function() {
		const doms = document.getElementsByClassName("image-wrapper")
		if (doms.length > 0) {
			for (let dom of doms) {
				dom.style.display = "block";
			}
		}
	},

	getStyles: function() {
		return ["MMM-ProxyImage.css"];
	}
});
