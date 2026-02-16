/**
 * Custom shaders for soft vector cloud rendering
 */

export const softPointVertexShader = `
attribute vec3 originalPosition;

varying float vDepth;
varying float vDistance;
varying vec3 vColor;

uniform vec3 uColorPrimary;
uniform vec3 uColorSecondary;
uniform vec3 uColorTertiary;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 10.0 * (100.0 / -mvPosition.z);

  // Store depth for gradient fade
  vDepth = normalize(mvPosition).z;

  // Distance from camera
  vDistance = length(mvPosition.xyz);

  // Interpolate colors based on depth for gradient effect
  float depthFactor = smoothstep(-50.0, 50.0, mvPosition.z);
  if (depthFactor < 0.5) {
    vColor = mix(uColorPrimary, uColorSecondary, depthFactor * 2.0);
  } else {
    vColor = mix(uColorSecondary, uColorTertiary, (depthFactor - 0.5) * 2.0);
  }

  gl_Position = projectionMatrix * mvPosition;
}
`

export const softPointFragmentShader = `
varying float vDepth;
varying float vDistance;
varying vec3 vColor;

uniform float uFade;

void main() {
  // Create ultra-soft circular disc
  vec2 uv = gl_PointCoord * 2.0 - 1.0;
  float dist = length(uv);

  // Very smooth falloff — Gaussian-like with extra softness
  float alpha = exp(-dist * dist * 5.0) * uFade;

  // Depth-based fade for layering and depth perception
  float depthFade = smoothstep(0.0, 1.0, -vDepth * 0.8 + 0.6);
  alpha *= depthFade;

  // Distance fade for atmospheric depth effect
  float distanceFade = smoothstep(150.0, 0.0, vDistance);
  alpha *= distanceFade;

  // Soft edge
  alpha *= smoothstep(1.2, 0.8, dist);

  gl_FragColor = vec4(vColor, alpha);
}
`

/**
 * Create shader material for soft particles
 */
import * as THREE from 'three'

export const createSoftPointMaterial = (
  primaryColor: string,
  secondaryColor: string,
  tertiaryColor: string
): THREE.ShaderMaterial => {
  const color1 = new THREE.Color(primaryColor)
  const color2 = new THREE.Color(secondaryColor)
  const color3 = new THREE.Color(tertiaryColor)

  return new THREE.ShaderMaterial({
    uniforms: {
      uColorPrimary: { value: color1 },
      uColorSecondary: { value: color2 },
      uColorTertiary: { value: color3 },
      uFade: { value: 1.0 }
    },
    vertexShader: softPointVertexShader,
    fragmentShader: softPointFragmentShader,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })
}
