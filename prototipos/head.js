// A head sculpted in code: a direction on the unit sphere becomes a point on the face.
// Shared by the three avatar options in ideias-v2.html. With a real GLB, the same treatments
// (sculpture, point scan, contour lines) apply to the person's own face.
(function () {
  const g = (v, w) => Math.exp(-(v / w) * (v / w));

  /** Unit direction (x up=y, front=+z) -> point on the head surface. */
  function headPoint(x, y, z) {
    let px = x * 0.6, py = y * 0.76, pz = z * 0.68;
    const down = Math.max(0, -y);
    px *= 1 - 0.3 * down * down; // jaw narrows
    pz *= 1 - 0.1 * down * down;
    if (y > 0.55) py *= 1 - 0.06 * (y - 0.55); // softer crown
    const front = Math.max(0, z);
    pz += 0.19 * g(x, 0.1) * g(y + 0.04, 0.19) * front; // nose
    pz += 0.05 * g(y - 0.24, 0.06) * g(x, 0.42) * front; // brow ridge
    for (const s of [-1, 1]) pz -= 0.085 * g(x - s * 0.3, 0.12) * g(y - 0.12, 0.08) * front; // eye sockets
    for (const s of [-1, 1]) px += s * 0.035 * g(y + 0.05, 0.2) * g(z - 0.5, 0.3); // cheekbones
    pz += 0.045 * g(y + 0.47, 0.12) * g(x, 0.25) * front; // chin
    pz -= 0.03 * g(y + 0.3, 0.025) * g(x, 0.14) * front; // mouth line
    pz += 0.03 * g(y + 0.36, 0.04) * g(x, 0.12) * front; // lower lip
    for (const s of [-1, 1]) px += s * 0.11 * g(x - s, 0.12) * g(y - 0.05, 0.2) * g(z + 0.05, 0.22); // ears
    return [px, py + 0.35, pz];
  }

  /** How lit the head is at a direction (0 to 1), from the surface normal and a light up-front to the right. */
  const LIGHT = (() => { const l = [0.55, 0.45, 0.7]; const n = Math.hypot(...l); return l.map((v) => v / n); })();
  function shadeAt(x, y, z) {
    const len = Math.hypot(x, y, z); x /= len; y /= len; z /= len;
    let t1 = [z, 0, -x]; const l1 = Math.hypot(...t1) || 1; t1 = t1.map((v) => v / l1);
    const t2 = [y * t1[2] - z * t1[1], z * t1[0] - x * t1[2], x * t1[1] - y * t1[0]];
    const e = 0.01, p0 = headPoint(x, y, z);
    const at = (dx, dy, dz) => { const m = Math.hypot(dx, dy, dz); return headPoint(dx / m, dy / m, dz / m); };
    const p1 = at(x + e * t1[0], y + e * t1[1], z + e * t1[2]);
    const p2 = at(x + e * t2[0], y + e * t2[1], z + e * t2[2]);
    const a = p1.map((v, i) => v - p0[i]), b = p2.map((v, i) => v - p0[i]);
    let n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const nl = Math.hypot(...n) || 1; n = n.map((v) => v / nl);
    if (n[0] * p0[0] + n[1] * (p0[1] - 0.35) + n[2] * p0[2] < 0) n = n.map((v) => -v);
    return Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
  }

  /** A sphere mesh pushed onto the head shape (for the sculpture). */
  function headGeometry(THREE, segments) {
    const geo = new THREE.SphereGeometry(1, segments, segments);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3(p.getX(i), p.getY(i), p.getZ(i)).normalize();
      const [x, y, z] = headPoint(v.x, v.y, v.z);
      p.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  /** Evenly spread points over the head, neck, collar and shoulders, each with how lit it is: [x, y, z, shade]. */
  function bustPoints(count) {
    const out = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    const head = Math.floor(count * 0.6);
    for (let i = 0; i < head; i++) {
      const y = 1 - (i / (head - 1)) * 2, r = Math.sqrt(1 - y * y), t = golden * i;
      if (y < -0.82) continue; // the neck takes over under the chin
      const x = Math.cos(t) * r, z = Math.sin(t) * r;
      out.push([...headPoint(x, y, z), shadeAt(x, y, z)]);
    }
    const neck = Math.floor(count * 0.06);
    for (let i = 0; i < neck; i++) {
      const t = golden * i * 7, h = i / neck;
      out.push([Math.cos(t) * 0.26, -0.22 - h * 0.5, Math.sin(t) * 0.26, 0.25 + 0.5 * Math.max(0, Math.sin(t))]);
    }
    const collar = Math.floor(count * 0.06);
    for (let i = 0; i < collar; i++) { // the hood around the neck links head and body
      const u = golden * i * 13, v = (i / collar) * Math.PI * 2; // scattered over the tube, not a spiral
      const R = 0.42 + 0.12 * Math.cos(u);
      out.push([Math.cos(v) * R, -0.76 + 0.12 * Math.sin(u), Math.sin(v) * R - 0.05, 0.35 + 0.5 * Math.max(0, Math.sin(v))]);
    }
    const body = count - head - neck - collar;
    for (let i = 0; i < body; i++) {
      const y = 1 - (i / (body - 1)), r = Math.sqrt(1 - y * y), t = golden * i;
      out.push([Math.cos(t) * r * 1.5, -1.68 + y * 0.95, Math.sin(t) * r * 0.75, 0.2 + 0.6 * Math.max(0, Math.sin(t)) * y]);
    }
    return out;
  }

  /** Closed rings at fixed heights around the head (for the contour lines). */
  function contourRings(levels, perRing) {
    const rings = [];
    for (let l = 0; l < levels; l++) {
      const phi = -1.25 + (l / (levels - 1)) * 2.75; // from under the chin to the crown
      const ring = [];
      for (let k = 0; k <= perRing; k++) {
        const t = (k / perRing) * Math.PI * 2;
        const x = Math.cos(phi) * Math.sin(t), y = Math.sin(phi), z = Math.cos(phi) * Math.cos(t);
        ring.push([...headPoint(x, y, z), shadeAt(x, y, z)]);
      }
      rings.push(ring);
    }
    return rings;
  }

  window.HEAD = { headPoint, headGeometry, bustPoints, contourRings };
})();
