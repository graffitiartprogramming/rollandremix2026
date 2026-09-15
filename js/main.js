<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://assets.codepen.io/15817543/aframe.min.js"></script>
    <script src="https://assets.codepen.io/15817543/mindar-image-aframe.prod.js"></script>

    <script>
      // Top-level data for quotes and cached photo asset ids.
      const TRC_QUOTES = [
        "Commit to reducing the number of Indigenous children in care by changing legislation...",
        "Require all governments to publicly report every year on the exact number of Indigenous children...",
        "Fully implement Jordan’s Principle—a law ensuring Indigenous children receive public services immediately...",
        "Enact child-welfare legislation confirming the right of Indigenous governments to establish standards...",
        "Fund culturally appropriate early childhood education and parenting programs for Indigenous families.",
        "Repeal section 43 of the Criminal Code to ensure Indigenous children are protected from violence.",
        "Develop a culturally appropriate curriculum on Indigenous languages, culture, and history (K-12).",
        "Ensure funding for schools on reserves is equal to or better than provincial school funding.",
        "Provide dedicated funding for post-secondary education for Indigenous students.",
        "Develop and implement strategies to improve graduation rates for Indigenous students.",
        "Make reconciliation education mandatory for all future teachers and education staff.",
        "Develop and share an annual report on the progress of reconciliation and education in Canada.",
        "Acknowledge Indigenous rights include language rights and enact an Aboriginal Languages Act.",
        "Fund the creation of Indigenous language and culture programs, including immersion programs.",
        "Appoint an Indigenous Languages Commissioner to monitor protection efforts."
      ];

      const PHOTO_IDS = ['#IMG1', '#IMG2', '#IMG3', '#IMG4', '#IMG5', '#IMG6', '#IMG7', '#IMG8', '#IMG9', '#IMG10'];

      // Display one random TRC quote per mural target.
      AFRAME.registerComponent('mural-quote', {
        init: function () {
          const selected = TRC_QUOTES[Math.floor(Math.random() * TRC_QUOTES.length)];
          this.el.setAttribute('text', {
            value: selected,
            align: 'left',
            width: 1,
            wrapCount: 25,
            color: 'white',
            shader: 'msdf',
            outlineWidth: 0.15,
            outlineColor: 'black',
            negate: true,
            opacity: 1,
            alphaTest: 0.5
          });
        }
      });

      // Pre-instantiate image entities, then toggle and reposition them on target events.
      AFRAME.registerComponent('random-photo', {
        init: function () {
          const el = this.el;
          this.photoContainer = document.createElement('a-entity');
          el.appendChild(this.photoContainer);

          this.photos = [];
          for (let i = 0; i < 4; i++) {
            const photo = document.createElement('a-image');
            photo.setAttribute('crossorigin', 'anonymous');
            photo.setAttribute('transparent', 'true');
            photo.setAttribute('visible', 'false');
            this.photoContainer.appendChild(photo);
            this.photos.push(photo);
          }

          const randomizePhoto = (photo) => {
            const randomImg = PHOTO_IDS[Math.floor(Math.random() * PHOTO_IDS.length)];
            photo.setAttribute('src', randomImg);
            const s = 0.35 + Math.random() * 0.3;
            photo.setAttribute('scale', `${s} ${s} ${s}`);
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.9 + Math.random() * 0.4;
            photo.setAttribute('position', `${Math.cos(angle) * radius} ${Math.sin(angle) * radius} ${0.1 + Math.random() * 0.3}`);
          };

          el.addEventListener('targetFound', () => {
            this.photoContainer.setAttribute('animation', {
              property: 'rotation',
              to: '0 0 360',
              dur: 20000,
              easing: 'linear',
              loop: true
            });

            this.photos.forEach(photo => {
              randomizePhoto(photo);
              photo.setAttribute('visible', 'true');
            });
          });

          el.addEventListener('targetLost', () => {
            this.photoContainer.removeAttribute('animation');
            this.photos.forEach(photo => photo.setAttribute('visible', 'false'));
          });
        }
      });

      // Generate repeated targets 1 through 11 after DOM load.
      document.addEventListener('DOMContentLoaded', () => {
        const scene = document.querySelector('a-scene');
        for (let i = 1; i <= 11; i++) {
          const target = document.createElement('a-entity');
          target.setAttribute('mindar-image-target', `targetIndex: ${i}`);
          target.setAttribute('random-photo', '');

          target.innerHTML = `
            <a-entity animation="property: position; dir: alternate; from: 0 0 0; to: 0 0.15 0; loop: true; dur: 5000; easing: easeInOutCubic;">
              <a-entity mural-quote position="0 0 0" scale="0.5 0.5 0.5"></a-entity>
            </a-entity>
          `;

          scene.appendChild(target);
        }
      });
    </script>
</head>

<body>
    <a-scene
      mindar-image="imageTargetSrc: https://assets.codepen.io/15817543/GrantParktargets.mind; maxTrack: 2; filterMinCF: 0.0001; filterBeta: 0.001; warmupTolerance: 5; missTolerance: 10;"
      color-space="sRGB"
      renderer="colorManagement: true, physicallyCorrectLights"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false">
      
      <a-assets>
        <img id="IMG1" src="https://assets.codepen.io/15817543/IMG_01.JPG" crossorigin="anonymous">
        <img id="IMG2" src="https://assets.codepen.io/15817543/IMG_02.JPG" crossorigin="anonymous">
        <img id="IMG3" src="https://assets.codepen.io/15817543/IMG_03.JPG" crossorigin="anonymous">
        <img id="IMG4" src="https://assets.codepen.io/15817543/IMG_04.JPG" crossorigin="anonymous">
        <img id="IMG5" src="https://assets.codepen.io/15817543/IMG_05.JPG" crossorigin="anonymous">
        <img id="IMG6" src="https://assets.codepen.io/15817543/IMG_06.JPG" crossorigin="anonymous">
        <img id="IMG7" src="https://assets.codepen.io/15817543/IMG_07.JPG" crossorigin="anonymous">
        <img id="IMG8" src="https://assets.codepen.io/15817543/IMG_08.JPG" crossorigin="anonymous">
        <img id="IMG9" src="https://assets.codepen.io/15817543/IMG_09.JPG" crossorigin="anonymous">
        <img id="IMG10" src="https://assets.codepen.io/15817543/IMG_10.JPG" crossorigin="anonymous">
      </a-assets>

      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      <!-- Target 0: Featured Card Layout -->
      <a-entity mindar-image-target="targetIndex: 0">
        <a-entity position="0 0 0">
          <a-plane width="2.2" height="1.2" color="black" material="opacity: 0.9; transparent: true" position="0 0 -0.01"></a-plane>
          <a-entity mural-quote position="-0.4 0 0.01"></a-entity>
          <a-entity random-photo position="0.6 0 0.01"></a-entity>
        </a-entity>
      </a-entity>

      <!-- Targets 1 through 11 are dynamically injected here via DOMContentLoaded JavaScript -->

    </a-scene>
</body>
</html>