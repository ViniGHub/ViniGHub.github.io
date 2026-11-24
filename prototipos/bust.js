// Placeholder bust shared by the three prototypes. The real site swaps it for the GLB of the person.
// The prototypes always open at the top, so each one starts with its intro animation.
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
// style: "clay" (smooth, warm), "lowpoly" (faceted, graphite) or "toon" (cel shading).
window.makeBust = function (THREE, style, palette) {
  const low = style === 'lowpoly';
  const seg = low ? [9, 7] : [48, 32];
  let gradient = null;
  if (style === 'toon') {
    gradient = new THREE.DataTexture(new Uint8Array([70, 150, 255]), 3, 1, THREE.LuminanceFormat);
    gradient.minFilter = gradient.magFilter = THREE.NearestFilter;
    gradient.needsUpdate = true;
  }
  const mat = (color, rough = 0.85) => style === 'toon'
    ? new THREE.MeshToonMaterial({ color, gradientMap: gradient })
    : new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, flatShading: low });

  const skin = mat(palette.skin), hair = mat(palette.hair, 0.95), shirt = mat(palette.shirt, 0.9), dark = mat(palette.eyes, 0.4);
  const root = new THREE.Group(); // placed by the page
  const inner = new THREE.Group(); // breathes, so the page's position is never overwritten
  const body = new THREE.Group();
  const head = new THREE.Group();
  root.add(inner);
  inner.add(body, head);

  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(1, seg[0], seg[1], 0, Math.PI * 2, 0, Math.PI / 2), shirt);
  shoulders.scale.set(1.45, 0.95, 0.75);
  shoulders.position.y = -1.65;
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.05, 8, low ? 10 : 32), shirt);
  collar.rotation.x = Math.PI / 2;
  collar.position.y = -0.74;
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.62, low ? 8 : 24), skin);
  neck.position.y = -0.45;
  body.add(shoulders, collar, neck);

  head.position.y = 0.35;
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.62, seg[0], seg[1]), skin);
  skull.scale.set(1, 1.12, 1.02);
  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.665, seg[0], seg[1], 0, Math.PI * 2, 0, Math.PI * 0.43), hair);
  hairCap.scale.set(1, 1.12, 1.04);
  hairCap.rotation.x = -0.22;
  hairCap.position.set(0, 0.03, -0.02);
  const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.3, low ? 7 : 24, low ? 5 : 16), hair);
  fringe.scale.set(1.5, 0.45, 0.8);
  fringe.position.set(0.12, 0.5, 0.42);
  fringe.rotation.z = -0.25;
  head.add(skull, hairCap, fringe);

  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.12, low ? 6 : 16, low ? 5 : 12), skin);
    ear.scale.set(0.5, 1, 0.8);
    ear.position.set(side * 0.61, -0.02, 0);
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.035, 0.04), hair);
    brow.position.set(side * 0.21, 0.19, 0.6);
    brow.rotation.z = side * -0.08;
    head.add(ear, brow);
  }
  const eyes = [-1, 1].map(side => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.055, low ? 6 : 16, low ? 5 : 12), dark);
    eye.position.set(side * 0.21, 0.07, 0.6);
    head.add(eye);
    return eye;
  });
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.085, low ? 6 : 16, low ? 5 : 12), skin);
  nose.scale.set(0.85, 1.1, 1);
  nose.position.set(0, -0.06, 0.66);
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 6, 20, Math.PI), dark);
  mouth.rotation.z = Math.PI;
  mouth.position.set(0, -0.25, 0.6);
  head.add(nose, mouth);

  // Animation state: the head follows a target, the body breathes, the eyes blink now and then.
  const target = { x: 0, y: 0 };
  let nextBlink = 2;
  root.userData.look = (nx, ny) => { target.x = nx; target.y = ny; };
  root.userData.update = (t) => {
    head.rotation.y += (target.x * 0.55 - head.rotation.y) * 0.08;
    head.rotation.x += (-target.y * 0.28 - head.rotation.x) * 0.08;
    body.rotation.y += (target.x * 0.12 - body.rotation.y) * 0.05;
    shoulders.scale.y = 0.95 + Math.sin(t * 1.7) * 0.012;
    inner.position.y = Math.sin(t * 1.7) * 0.012;
    if (t > nextBlink) {
      const k = Math.min(1, (t - nextBlink) / 0.14);
      const s = k < 0.5 ? 1 - k * 1.8 : 0.1 + (k - 0.5) * 1.8;
      eyes.forEach(e => (e.scale.y = Math.max(0.1, Math.min(1, s))));
      if (k >= 1) nextBlink = t + 2.5 + Math.random() * 3;
    }
  };
  return root;
};

// A canvas that renders the bust, sized to its container, with the head following the pointer.
window.mountBust = function (canvas, style, palette, lights, opts = {}) {
  const THREE = window.THREE;
  const distance = opts.distance ?? 5.4, lookY = opts.lookY ?? -0.25;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, lookY + 0.1, distance);
  camera.lookAt(0, lookY, 0);
  lights(THREE, scene);
  const bust = window.makeBust(THREE, style, palette);
  scene.add(bust);

  const resize = () => {
    const { width, height } = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas.parentElement);
  resize();
  window.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const nx = ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 2;
    const ny = ((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 2;
    bust.userData.look(Math.max(-1, Math.min(1, nx)), Math.max(-1, Math.min(1, ny)));
  });
  const clock = new THREE.Clock();
  (function loop() {
    bust.userData.update(clock.getElapsedTime());
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  })();
  return bust;
};
