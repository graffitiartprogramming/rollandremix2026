AFRAME.registerComponent("rb-animate-png2", {
  schema: {
    minDuration: { type: "number", default: 2000 },  
    maxDuration: { type: "number", default: 4000 },  
    spawnInterval: { type: "number", default: 800 }, 
    maxSimultaneous: { type: "number", default: 8 }  
  },

  init: function () {
    this.textures = [];
    this.activeMeshes = 0;

    const loader = new THREE.TextureLoader();
    let processedCount = 0;
    const totalImages = 20;

    this.geometry = new THREE.PlaneGeometry(1, 1);

    for (let i = 1; i <= totalImages; i++) {
      const num = String(i).padStart(2, "0");
      const path = `assets/RBfull/RBHexagons/RB_LOGOS_${num}.png`;

      loader.load(
        path,
        // Success Callback
        (texture) => {
          if (THREE.SRGBColorSpace) {
            texture.colorSpace = THREE.SRGBColorSpace;
          }
          this.textures.push(texture);
          processedCount++;
          this.checkReady(processedCount, totalImages);
        },
        // Progress Callback
        undefined,
        // Error Callback (Logs broken paths instead of locking up)
        (err) => {
          console.error(`[rb-animate-png1] Failed to load image at: ${path}`, err);
          processedCount++;
          this.checkReady(processedCount, totalImages);
        }
      );
    }
  },

  checkReady: function (processed, total) {
    if (processed === total && this.textures.length > 0 && !this.spawnTimer) {
      console.log(`[rb-animate-png1] Successfully loaded ${this.textures.length} textures. Starting spawner.`);
      this.startSpawner();
    }
  },

  startSpawner: function () {
    this.spawnTimer = setInterval(() => {
      if (this.activeMeshes < this.data.maxSimultaneous) {
        this.spawnRandomImage();
      }
    }, this.data.spawnInterval);
  },

  spawnRandomImage: function () {
    if (this.textures.length === 0) return;

    this.activeMeshes++;

    const randomIndex = Math.floor(Math.random() * this.textures.length);
    const selectedTexture = this.textures[randomIndex];

    const duration = Math.floor(
      Math.random() * (this.data.maxDuration - this.data.minDuration) + this.data.minDuration
    );

    const material = new THREE.MeshBasicMaterial({
      map: selectedTexture,
      transparent: true,
      alphaTest: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    material.needsUpdate = true;

    const mesh = new THREE.Mesh(this.geometry, material);

    const zOffset = (Math.random() - 0.0) * 0.0;
    mesh.position.set(0, 0, zOffset);

    this.el.object3D.add(mesh);

    setTimeout(() => {
      if (mesh.parent) {
        mesh.parent.remove(mesh);
      }
      material.dispose();
      this.activeMeshes--;
    }, duration);
  },

  remove: function () {
    if (this.spawnTimer) clearInterval(this.spawnTimer);
    if (this.geometry) this.geometry.dispose();
    if (this.textures) {
      this.textures.forEach((tex) => tex.dispose());
    }
  }
});