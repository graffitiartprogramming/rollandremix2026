AFRAME.registerComponent("animate-png", {
  init: function () {
    // load the .pngs
    let loader = new THREE.TextureLoader();
    this.pngArray = [];
    this.pngArray.push(loader.load("assets/rollandremix1.png"));
    this.pngArray.push(loader.load("assets/rollandremix2.png"));


    this.el.addEventListener("loaded", (e) => {
      let mesh = this.el.getObject3D("mesh");
      this.material = mesh.material;

      // set the initial texture
      this.material.map = this.pngArray[0];

      var i = 1;
      this.id = setInterval((e) => {
        if (i >= this.pngArray.length) i = 0;
        this.material.map = this.pngArray[i++];
        this.material.needsUpdate = true;
      }, 100);
    });
  },
  remove: function () {
    clearInterval(this.id);
    // free the memory
    for (let i = 0; i < this.pngArray.length; i++) {
      this.pngArray[i].dispose();
    }
  },
});