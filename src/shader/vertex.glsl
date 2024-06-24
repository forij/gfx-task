varying vec2 vUv;
varying vec3 vColor;

void main() {
  vUv = uv;

  vColor = instanceColor;
  gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position,1.0);
}