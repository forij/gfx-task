varying vec2 vUv;
uniform vec2 uPointA;
uniform vec2 uPointB;
uniform vec2 uPointC;
uniform float uThickness;
uniform int uLineJoinType;

float pointToSegmentDistance(vec2 P, vec2 P0, vec2 P1) {
    vec2 v = P1 - P0;
    vec2 w = P - P0;

    float c1 = dot(w, v);
    float c2 = dot(v, v);

    float t = c1 / c2;

    if (t < 0.0) {
        t = 0.0;
    } else if (t > 1.0) {
        t = 1.0;
    }

    vec2 closestPoint = P0 + t * v;

    return length(P - closestPoint);
}

void main() {
  float distanceToAB = pointToSegmentDistance(vUv, uPointA, uPointB);
  float distanceToBC = pointToSegmentDistance(vUv, uPointB, uPointC);
  if (distanceToAB < uThickness / 2. || distanceToBC < uThickness / 2.) {
    gl_FragColor = vec4(1., 0., 0., 1.0);  
  } else {
    gl_FragColor = vec4(0., 0.2 , 0.2, 0.3);
  }
}