/** Where the pointer is on the whole window, from -1 to 1. Read every frame by the 3D avatar. */
export const pointer = { x: 0, y: 0 }

let listening = false

/** Starts tracking the pointer once; later calls do nothing. */
export function trackPointer() {
  if (listening) return
  listening = true
  window.addEventListener('pointermove', (event) => {
    pointer.x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1))
    pointer.y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1))
  })
}
