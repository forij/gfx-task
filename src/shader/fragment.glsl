varying vec2 vUv;
uniform vec2 uPointA;
uniform vec2 uPointB;
uniform vec2 uPointC;
uniform float uThickness;
uniform int uLineJoinType;
uniform vec3 uColor;

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

vec4 drawRound(){
  float distanceToAB = pointToSegmentDistance(vUv, uPointA, uPointB);
  float distanceToBC = pointToSegmentDistance(vUv, uPointB, uPointC);
  if (distanceToAB < uThickness / 2. || distanceToBC < uThickness / 2.) {
    return vec4(uColor, 1.0);  
  } else {
    return vec4(0., 0.2 , float(uLineJoinType), 0.3);
  }
}

vec4 drawBevel(){
  return vec4(0.0, 0.5, 0.5, 1.0);
}

vec4 drawMiter(){
   return vec4(0.5, 0.5, 0.0, 1.0);
}

void main() {
  if(uLineJoinType == 1){
      gl_FragColor = drawRound();
  } else if(uLineJoinType == 2) {
      gl_FragColor = drawMiter();
  } else {
      gl_FragColor = drawBevel();
  }
}