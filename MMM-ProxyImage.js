// eslint-disable-next-line no-undef
Module.register('MMM-ProxyImage', {
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

  start() {
    // Allows for multiple instances of the module
    this.config.instanceName = (this.config.name || this.name).replace(
      /\s+/g,
      ''
    );

    // send config to node helper
    this.sendSocketNotification('INIT', this.config);

    // Schedule update timer.
    this.scheduleUpdate(this.config.updateInterval);
  },

  scheduleUpdate(delay) {
    const self = this;
    let nextLoad = self.config.updateInterval;
    if (typeof delay !== 'undefined' && delay >= 0) {
      nextLoad = delay;
    }
    setTimeout(() => {
      self.updateDom();
      self.scheduleUpdate();
    }, nextLoad);
  },

  showModal(imageSrc) {
    const self = this;
    const { modalInterval, updateInterval } = self.config;
    const refreshInterval = modalInterval || updateInterval;
    this.sendNotification('OPEN_MODAL', {
      template: self.config.modalTemplate,
      data: {
        imageSrc
      },
      options: {
        callback(error) {
          if (error) {
            console.error('Modal rendering failed', error);
            return false;
          }
          const modalTimer = setInterval(() => {
            const modal = document.querySelector('.MMM-Modal');
            if (modal.style.opacity === '1') {
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

  getDom() {
    const self = this;
    const d = new Date();
    const wrapperId = `proxyDiv${self.config.instanceName}`;
    let wrapper = document.getElementById(wrapperId);
    const imgId = `proxyImage${self.config.instanceName}`;
    let img = document.getElementById(imgId);
    const imgId2 = `proxyImage2${self.config.instanceName}`;
    let img2 = document.getElementById(imgId2);
    const imageSrc = `/${self.name}/${self.config.instanceName}?${d.getTime()}`;

    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = wrapperId;
      wrapper.className = 'image-wrapper';
      wrapper.style.width = `${self.config.width}px`;
      wrapper.style.height = `${self.config.height}px`;
      wrapper.style.border = 'none';
      wrapper.style.display = 'block';
      wrapper.style.overflow = 'hidden';
      wrapper.style.backgroundColor = self.config.backgroundColor;
      wrapper.scrolling = 'no';
    }

    if (self.config.modalEnabled) {
      wrapper.onclick = () => {
        self.showModal(imageSrc);
      };
    }

    if (!img) {
      img = document.createElement('img');
      img.id = imgId;
      img.width = self.config.width;
      img.src = imageSrc;
      wrapper.appendChild(img);

      img2 = document.createElement('img');
      img2.id = imgId2;
      img2.width = self.config.width;
      img2.style.display = 'none';
      wrapper.appendChild(img2);
    } else if (img && img.style.display !== 'none') {
      // Give them a chance to load before swapping
      img2.src = imageSrc;
      setTimeout(() => {
        img2.style.display = 'block';
        img.style.display = 'none';
      }, 2000);
    } else if (img) {
      img.src = imageSrc;
      setTimeout(() => {
        img.style.display = 'block';
        img2.style.display = 'none';
      }, 2000);
    }

    return wrapper;
  },

  suspend() {
    const doms = document.getElementsByClassName('image-wrapper');
    if (doms.length > 0) {
      doms.forEach((dom) => {
        dom.style.display = 'none';
      });
    }
  },

  resume() {
    const doms = document.getElementsByClassName('image-wrapper');
    if (doms.length > 0) {
      doms.forEach((dom) => {
        dom.style.display = 'block';
      });
    }
  },

  getStyles() {
    return ['MMM-ProxyImage.css'];
  }
});
