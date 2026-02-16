/**
 * Simplex-like 3D noise implementation
 * Generates smooth, organic motion for particle clouds
 */

// Permutation table for noise
const p = new Uint8Array(512)
const permutation = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
  140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148,
  247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32,
  57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 144, 52, 61,
  33, 60, 70, 143, 251, 43, 48, 94, 12, 3, 84, 95, 97, 78, 214, 184,
  226, 47, 137, 29, 156, 32, 79, 109, 41, 109, 143, 216, 105, 50, 148, 134,
  137, 132, 65, 114, 38, 43, 76, 63, 204, 182, 120, 184, 87, 56, 18, 108,
  166, 253, 95, 132, 6, 154, 59, 67, 160, 219, 30, 129, 224, 155, 158, 233,
  42, 205, 12, 62, 75, 251, 109, 212, 171, 142, 65, 2, 174, 33, 169, 95,
  195, 99, 20, 194, 117, 116, 130, 91, 234, 250, 129, 182, 254, 201, 234, 38,
  178, 41, 181, 140, 210, 204, 197, 145, 76, 7, 129, 231, 68, 15, 124, 58,
  223, 211, 94, 69, 142, 48, 241, 121, 136, 147, 231, 192, 14, 214, 247, 49,
  57, 115, 228, 78, 242, 211, 212, 107, 163, 156, 17, 116, 142, 28, 252, 207,
  124, 233, 47, 108, 5, 242, 194, 87, 254, 40, 32, 252, 179, 155, 130, 66,
  197, 174, 142, 42, 56, 179, 184, 157, 182, 206, 188, 205, 201, 154, 230, 245,
  53, 36, 43, 209, 172, 146, 147, 152, 185, 82, 181, 130, 97, 180, 184, 132,
  182, 120, 229, 144, 184, 228, 42, 128, 123, 226, 99, 194, 108, 115, 231, 223,
  147, 120, 54, 135, 206, 118, 166, 42, 168, 77, 27, 36, 170, 47, 73, 61
]

// Duplicate permutation table
for (let i = 0; i < 256; i++) {
  p[i] = permutation[i]
  p[i + 256] = permutation[i]
}

const fade = (t: number): number => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (t: number, a: number, b: number): number => a + t * (b - a)

const grad = (hash: number, x: number, y: number, z: number): number => {
  const h = hash & 15
  const u = h < 8 ? x : y
  const v = h < 8 ? y : z
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
}

/**
 * 3D Perlin-like noise
 * Returns value between -1 and 1
 */
export const perlinNoise3D = (x: number, y: number, z: number): number => {
  const xi = Math.floor(x) & 255
  const yi = Math.floor(y) & 255
  const zi = Math.floor(z) & 255

  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)
  const zf = z - Math.floor(z)

  const u = fade(xf)
  const v = fade(yf)
  const w = fade(zf)

  const aa = p[p[xi] + yi] + zi
  const ab = p[p[xi] + yi + 1] + zi
  const ba = p[p[xi + 1] + yi] + zi
  const bb = p[p[xi + 1] + yi + 1] + zi

  const aaa = p[aa]
  const aba = p[ab]
  const baa = p[ba]
  const bba = p[bb]
  const aab = p[aa + 1]
  const abb = p[ab + 1]
  const bab = p[ba + 1]
  const bbb = p[bb + 1]

  const x1 = lerp(u, grad(aaa, xf, yf, zf), grad(baa, xf - 1, yf, zf))
  const x2 = lerp(u, grad(aba, xf, yf - 1, zf), grad(bba, xf - 1, yf - 1, zf))
  const y1 = lerp(v, x1, x2)

  const x3 = lerp(u, grad(aab, xf, yf, zf - 1), grad(bab, xf - 1, yf, zf - 1))
  const x4 = lerp(u, grad(abb, xf, yf - 1, zf - 1), grad(bbb, xf - 1, yf - 1, zf - 1))
  const y2 = lerp(v, x3, x4)

  return lerp(w, y1, y2)
}

/**
 * Curl noise — generates smooth 3D vector field
 * Based on domain warping of noise
 */
export const curlNoise = (x: number, y: number, z: number, strength: number = 1.0) => {
  const epsilon = 0.01

  // Sample noise at offset points to compute derivatives
  const n1 = perlinNoise3D(x, y + epsilon, z)
  const n2 = perlinNoise3D(x, y - epsilon, z)
  const n3 = perlinNoise3D(x + epsilon, y, z)
  const n4 = perlinNoise3D(x - epsilon, y, z)
  const n5 = perlinNoise3D(x, y, z + epsilon)
  const n6 = perlinNoise3D(x, y, z - epsilon)

  return {
    x: ((n5 - n6) - (n2 - n1)) * strength,
    y: ((n3 - n4) - (n5 - n6)) * strength,
    z: ((n2 - n1) - (n3 - n4)) * strength
  }
}

/**
 * Generate multiple octaves of noise for richer motion
 */
export const curlNoiseMultiOctave = (
  x: number,
  y: number,
  z: number,
  octaves: number = 3,
  strength: number = 1.0
): { x: number; y: number; z: number } => {
  let vx = 0,
    vy = 0,
    vz = 0
  let amplitude = 1
  let freq = 1
  let maxValue = 0

  for (let i = 0; i < octaves; i++) {
    const curl = curlNoise(x * freq, y * freq, z * freq, strength)
    vx += curl.x * amplitude
    vy += curl.y * amplitude
    vz += curl.z * amplitude

    maxValue += amplitude
    amplitude *= 0.5
    freq *= 2
  }

  return {
    x: vx / maxValue,
    y: vy / maxValue,
    z: vz / maxValue
  }
}
