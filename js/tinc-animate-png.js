AFRAME.registerComponent("tinc-animate-png", {
    schema: {
      fps: { type: "number", default: 10 }
    },

    init: function () {
      const loader = new THREE.TextureLoader();
      this.pngArray = [];
      this.currentIndex = 0;
      this.intervalTime = 1000 / this.data.fps;

      const prepareTexture = (path) => {
        const texture = loader.load(path);
        if (THREE.SRGBColorSpace) {
          texture.colorSpace = THREE.SRGBColorSpace;
        }
        return texture;
      };

      // Forward sequence (0 to 20)
      for (let i = 0; i <= 20; i++) {
        const num = String(i).padStart(5, "0");
        this.pngArray.push(prepareTexture(`assets/TINCfull/TINCfull_${num}.png`));
      }
      // Reverse sequence (19 down to 1)
      for (let i = 19; i >= 1; i--) {
        const num = String(i).padStart(5, "0");
        this.pngArray.push(prepareTexture(`assets/TINCfull/TINCfull_${num}.png`));
      }

      // Wait until A-Frame's material component is fully initialized and loaded
      if (this.el.components.material && this.el.components.material.material) {
        this.setupAnimation();
      } else {
        this.el.addEventListener("material-loaded", () => this.setupAnimation(), { once: true });
      }
    },

    setupAnimation: function () {
      // Access A-Frame's managed material directly
      const materialComp = this.el.components.material;
      if (!materialComp || !materialComp.material) return;

      this.material = materialComp.material;
      
      // Set initial frame
      this.material.map = this.pngArray[0];
      this.material.needsUpdate = true;

      // Start frame loop
      this.id = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.pngArray.length;
        this.material.map = this.pngArray[this.currentIndex];
        this.material.needsUpdate = true;
      }, this.intervalTime);
    },

    remove: function () {
      if (this.id) clearInterval(this.id);
      if (this.pngArray) {
        this.pngArray.forEach((texture) => texture.dispose());
      }
    }
  });