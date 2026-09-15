 AFRAME.registerComponent("ncc-animate-png1", {
  init: function () {
    const loader = new THREE.TextureLoader();
    this.pngArray = [];

    // Load textures with an error callback so path errors show up in the console
    const loadTex = (path) => {
      return loader.load(
        path,
        (tex) => {
          if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
          tex.needsUpdate = true;
        },
        undefined,
        (err) => console.error(`[ncc-animate-png1] Failed to load path: ${path}`, err)
      );
    };

    // Push the sequence
    this.pngArray.push(loadTex("assets/ncclogo/ncclogo_01.png"));
    this.pngArray.push(loadTex("assets/ncclogo/ncclogo_02.png"));
    this.pngArray.push(loadTex("assets/ncclogo/ncclogo_03.png"));
    this.pngArray.push(loadTex("assets/ncclogo/ncclogo_02.png"));

    // Function to start the animation loop directly
    const startLoop = () => {
      const mesh = this.el.getObject3D("mesh");
      if (!mesh || !mesh.material) return;

      this.material = mesh.material;
      let i = 0;

      this.id = setInterval(() => {
        if (i >= this.pngArray.length) i = 0;
        this.material.map = this.pngArray[i++];
        this.material.needsUpdate = true;
      }, 500);
    };

    // If mesh already exists, start immediately; otherwise wait for object3dset
    if (this.el.getObject3D("mesh")) {
      startLoop();
    } else {
      this.el.addEventListener("object3dset", (evt) => {
        if (evt.detail.type === "mesh") startLoop();
      }, { once: true });
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