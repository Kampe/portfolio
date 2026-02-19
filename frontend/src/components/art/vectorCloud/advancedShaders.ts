/**
 * ADVANCED GLSL SHADERS FOR UNREAL/TOUCHDESIGNER-LEVEL QUALITY
 * Volumetric rendering, complex mathematical surfaces, sophisticated particle rendering
 * Multiple passes for depth, glow, and advanced lighting effects
 */

import * as THREE from 'three'

/**
 * Main particle shader: sophisticated glow with depth-based color
 */
export const createAdvancedParticleMaterial = (
  primaryColor: THREE.Color,
  secondaryColor: THREE.Color,
  tertiaryColor: THREE.Color
): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uPrimaryColor: { value: primaryColor },
      uSecondaryColor: { value: secondaryColor },
      uTertiaryColor: { value: tertiaryColor },
      uTime: { value: 0 },
      uFade: { value: 1.0 },
      uDepthScale: { value: 200 },
      uMorphIntensity: { value: 0.5 },
    },
    vertexShader: `
      varying vec3 vColor;
      varying float vDepth;
      varying float vAlpha;

      uniform float uTime;
      uniform float uMorphIntensity;

      void main() {
        // Perspective-based point size with depth
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float depth = length(mvPosition.xyz);
        gl_PointSize = max(2.0, 40.0 / (1.0 + depth / 100.0));

        // Capture depth for fragment shader
        vDepth = depth;

        // Simple color assignment (will be enhanced in fragment)
        vColor = normalize(position);

        // Subtle morphing: position oscillates based on time
        vec3 morphed = position + normalize(position) * sin(uTime * 0.001 + length(position) * 0.01) * uMorphIntensity;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vDepth;
      varying float vAlpha;

      uniform vec3 uPrimaryColor;
      uniform vec3 uSecondaryColor;
      uniform vec3 uTertiaryColor;
      uniform float uFade;
      uniform float uDepthScale;

      void main() {
        // Create sophisticated particle shape: Gaussian falloff + mathematical softness
        vec2 centerDist = gl_PointCoord - 0.5;
        float dist = length(centerDist);

        // Gaussian falloff: very soft edges
        float gaussian = exp(-dist * dist * 8.0);

        // Add mathematical complexity: concentric rings
        float rings = sin(dist * 30.0) * 0.1 + 0.5;

        // Combine for sophisticated shape
        float softness = gaussian * (0.7 + rings * 0.3);

        // Only render inner circle
        if (dist > 0.5) discard;

        // Depth-based color interpolation: cyan → blue → magenta based on depth
        float depthNorm = smoothstep(0.0, uDepthScale, vDepth);
        vec3 color = mix(uPrimaryColor, uSecondaryColor, depthNorm);
        color = mix(color, uTertiaryColor, depthNorm * depthNorm);

        // Add color variation from position
        color += normalize(vColor) * 0.1;

        // Apply sophisticated blending
        gl_FragColor = vec4(color, softness * uFade);
      }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    depthTest: true,
  })
}

/**
 * Volumetric layer shader: atmospheric depth rendering
 */
export const createVolumetricMaterial = (): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uCameraPos: { value: new THREE.Vector3(0, 0, 150) },
      uFogDensity: { value: 0.02 },
      uFogColor: { value: new THREE.Color(0x001a33) },
      uIntensity: { value: 1.0 },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      varying float vDepth;

      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vDepth = length(mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPos;
      varying float vDepth;

      uniform float uTime;
      uniform vec3 uCameraPos;
      uniform float uFogDensity;
      uniform vec3 uFogColor;
      uniform float uIntensity;

      // Noise function (approximation)
      float noise(vec3 p) {
        return sin(p.x * 0.1) * cos(p.y * 0.1) * sin(p.z * 0.1) * 0.5 + 0.5;
      }

      void main() {
        // Calculate volumetric fog with depth
        float dist = vDepth;
        float fogFactor = 1.0 - exp(-dist * dist * uFogDensity);

        // Add animated noise for volumetric depth
        float volumeNoise = noise(vWorldPos + uTime * 0.001);
        fogFactor *= (0.7 + volumeNoise * 0.3);

        // Apply light shafts simulation
        float lightShaft = sin(vWorldPos.y * 0.01 + uTime * 0.0001) * 0.5 + 0.5;

        gl_FragColor = vec4(uFogColor, fogFactor * uIntensity * lightShaft);
      }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })
}

/**
 * Morphing geometry shader: deforming organic surface
 */
export const createMorphingGeometryMaterial = (color: THREE.Color): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uTime: { value: 0 },
      uMorphStrength: { value: 0.5 },
      uEmissiveIntensity: { value: 0.8 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vMorphAmount;

      uniform float uTime;
      uniform float uMorphStrength;

      // Simple noise approximation
      float noise(vec3 p) {
        return sin(p.x) * cos(p.y) * sin(p.z);
      }

      void main() {
        vec3 pos = position;
        vec3 normal = normalize(normalMatrix * normal);

        // Deform surface: move along normal based on time and position
        float deformation = sin(uTime * 0.0005 + length(position) * 0.1) * uMorphStrength;
        deformation += noise(position * 0.01 + uTime * 0.001) * uMorphStrength * 0.5;

        pos += normal * deformation;

        vNormal = normal;
        vPosition = pos;
        vMorphAmount = deformation;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vMorphAmount;

      uniform vec3 uColor;
      uniform float uEmissiveIntensity;

      void main() {
        // Fresnel effect: brighten at edges
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);

        // Add emissive glow
        vec3 emissive = uColor * (0.3 + fresnel * 0.7) * uEmissiveIntensity;

        // Combine with diffuse
        vec3 diffuse = uColor * max(0.3, dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))));
        vec3 finalColor = diffuse + emissive;

        gl_FragColor = vec4(finalColor, 0.8 + fresnel * 0.2);
      }
    `,
    transparent: true,
    wireframe: false,
  })
}

/**
 * Post-processing: Bloom shader for glow effects
 */
export const createBloomShader = (): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null },
      uBloomStrength: { value: 1.5 },
      uBloomThreshold: { value: 0.5 },
      uResolution: { value: new THREE.Vector2(1920, 1080) },
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;

      uniform sampler2D uTexture;
      uniform float uBloomStrength;
      uniform float uBloomThreshold;
      uniform vec2 uResolution;

      void main() {
        vec4 texColor = texture2D(uTexture, vUv);

        // Extract bright areas
        float brightness = dot(texColor.rgb, vec3(0.2126, 0.7152, 0.0722));

        if (brightness < uBloomThreshold) {
          gl_FragColor = texColor;
        } else {
          // Gaussian blur for bloom
          vec4 blur = vec4(0.0);
          float weight = 1.0 / 9.0;

          for (int x = -1; x <= 1; x++) {
            for (int y = -1; y <= 1; y++) {
              vec2 offset = vec2(float(x), float(y)) / uResolution;
              blur += texture2D(uTexture, vUv + offset) * weight;
            }
          }

          gl_FragColor = texColor + blur * (brightness - uBloomThreshold) * uBloomStrength;
        }
      }
    `,
    transparent: true,
  })
}

/**
 * Color grading shader: professional color treatment
 */
export const createColorGradingMaterial = (): THREE.ShaderMaterial => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null },
      uContrast: { value: 1.1 },
      uSaturation: { value: 1.2 },
      uBrightness: { value: 1.0 },
      uHueShift: { value: 0.0 },
      uLiftShadows: { value: new THREE.Color(0x001a33) },
      uLiftMidtones: { value: new THREE.Color(0x00d4ff) },
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;

      uniform sampler2D uTexture;
      uniform float uContrast;
      uniform float uSaturation;
      uniform float uBrightness;
      uniform float uHueShift;
      uniform vec3 uLiftShadows;
      uniform vec3 uLiftMidtones;

      vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
      }

      vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
      }

      void main() {
        vec4 texColor = texture2D(uTexture, vUv);
        vec3 col = texColor.rgb;

        // Brightness and contrast
        col = (col - 0.5) * uContrast + 0.5;
        col *= uBrightness;

        // Convert to HSV for saturation and hue shift
        vec3 hsv = rgb2hsv(col);
        hsv.x = mod(hsv.x + uHueShift, 1.0); // Hue shift
        hsv.y *= uSaturation; // Saturation
        col = hsv2rgb(hsv);

        // Lift shadows and midtones
        float brightness = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(col, uLiftShadows, smoothstep(0.0, 0.3, brightness) * 0.2);
        col = mix(col, uLiftMidtones, smoothstep(0.3, 0.7, brightness) * 0.15);

        gl_FragColor = vec4(col, texColor.a);
      }
    `,
    transparent: true,
  })
}
