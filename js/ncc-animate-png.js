AFRAME.registerComponent("ncc-animate-png", {
  init: function () {
    const loader = new THREE.TextureLoader();
    this.pngArray = [];

    // Helper to load textures safely
    const loadTex = (path) => {
      return loader.load(
        path,
        (tex) => {
          if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
          tex.needsUpdate = true;
        },
        undefined,
        (err) => console.error(`[ncc-animate-png] Failed to load path: ${path}`, err)
      );
    };

    // 1. Forward sequence: nccfull_01.png to nccfull_33.png
    for (let i = 1; i <= 33; i++) {
      const num = String(i).padStart(2, "0");
      this.pngArray.push(loadTex(`assets/nccfull2/nccfull_${num}.png`));
    }

    // 2. Reverse sequence: nccfull_32.png down to nccfull_02.png
    // Starts at 32 and stops at 02 to prevent duplicating frame 33 and frame 01 during the ping-pong loop
    for (let i = 32; i >= 2; i--) {
      const num = String(i).padStart(2, "0");
      this.pngArray.push(loadTex(`assets/nccfull2/nccfull_${num}.png`));
    }

    // Start loop when mesh is ready
    const startLoop = () => {
      const mesh = this.el.getObject3D("mesh");
      if (!mesh || !mesh.material) return;

      this.material = mesh.material;
      let i = 0;

      this.id = setInterval(() => {
        if (i >= this.pngArray.length) i = 0;
        this.material.map = this.pngArray[i++];
        this.material.needsUpdate = true;
      }, 100); // Set to 100ms (~10fps) for smooth multi-frame animation
    };

    if (this.el.getObject3D("mesh")) {
      startLoop();
    } else {
      this.el.addEventListener(
        "object3dset",
        (evt) => {
          if (evt.detail.type === "mesh") startLoop();
        },
        { once: true }
      );
    }
  },

  remove: function () {
    if (this.id) clearInterval(this.id);
    if (this.pngArray) {
      for (let i = 0; i < this.pngArray.length; i++) {
        this.pngArray[i].dispose();
      }
    }
  }
});