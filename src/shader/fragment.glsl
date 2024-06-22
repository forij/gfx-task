varying vec2 vUv;
uniform vec2 uPointA;
uniform vec2 uPointB;
uniform vec2 uPointC;
uniform float uThickness;
uniform int uLineJoinType;
uniform vec3 uColor;

// https://en.wikibooks.org/wiki/Fractals/shadertoy
float pointToSegmentDistance(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);

  return length(pa - ba * h);
}

vec4 drawRound() {
  float distanceToAB = pointToSegmentDistance(vUv, uPointA, uPointB);
  float distanceToBC = pointToSegmentDistance(vUv, uPointB, uPointC);
  if(distanceToAB < uThickness / 2. || distanceToBC < uThickness / 2.) {
    return vec4(uColor, 1.0);
  } else {
    return vec4(0., 0.2, float(uLineJoinType), 0.3);
  }
}

bool isInsideSegmentRectangle(vec2 p, vec2 a, vec2 b, float thickness) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = dot(pa, ba) / dot(ba, ba); // not normalized projection to segment
  float len = length(pa - ba * clamp(h, 0.0, 1.0)); // distance to segment

  // if point projection is inside segment and distance to segment is less than half thickness 
  // then point is inside rectangle
  return h > 0.0 && h < 1.0 && len < thickness / 2.0;
}

float side(vec2 a, vec2 b, vec2 c) {
  return ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
}

bool isInsideTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
  bool sideAB = side(a, b, p) > 0.0;
  bool sideBC = side(b, c, p) > 0.0;
  bool sideCA = side(c, a, p) > 0.0;

  return sideAB == sideBC && sideBC == sideCA;
}

bool isInsideMiterJoint(vec2 p, vec2 a, vec2 b, vec2 c, float thickness) {
  vec2 ab = normalize(a - b);
  vec2 normalAB = vec2(-ab.y, ab.x);
  float directon = sign(side(a, b, c));
  vec2 b0 = b + directon * normalAB * thickness / 2.;

  vec2 bc = normalize(b - c);
  vec2 normalBC = vec2(-bc.y, bc.x);
  vec2 b3 = b + directon * normalBC * thickness / 2.;

  vec2 bb0 = normalize(b - b0);
  vec2 bb3 = normalize(b - b3);

  vec2 miter = normalize(bb0 + bb3);
  float miterLength = 0.5 * thickness / dot(miter, normalAB);

  vec2 m = b + miter * miterLength * directon;

  if(isInsideTriangle(p, b0, b3, m) || isInsideTriangle(p, b0, b3, b)) {
    return true;
  }

  return false;
}

vec4 drawMiter() {
  bool isInsideAB = isInsideSegmentRectangle(vUv, uPointA, uPointB, uThickness);
  bool isInsideBC = isInsideSegmentRectangle(vUv, uPointB, uPointC, uThickness);

  if(isInsideAB || isInsideBC) {
    return vec4(uColor, 1.0);
  }

  if(isInsideMiterJoint(vUv, uPointA, uPointB, uPointC, uThickness)) {
    return vec4(0.0, 0.0, 1.0, 1.0);
  }

  return vec4(0., 0.2, float(uLineJoinType), 0.3);
}

bool isInsideBevelJoint(vec2 p, vec2 a, vec2 b, vec2 c, float thickness) {
  vec2 ab = normalize(b - a);
  vec2 normalAB = vec2(ab.y, -ab.x);

  vec2 bc = normalize(c - b);
  vec2 normalBC = vec2(bc.y, -bc.x);

  float directon = sign(side(a, b, c));

  vec2 b1 = b + directon * normalAB * thickness / 2.; // get b0 or b1 point depending on direction
  vec2 b2 = b + directon * normalBC * thickness / 2.; // get b3 or b2 point depending on direction

  return isInsideTriangle(p, b, b2, b1);
}

vec4 drawBevel() {
  bool isInsideAB = isInsideSegmentRectangle(vUv, uPointA, uPointB, uThickness);
  bool isInsideBC = isInsideSegmentRectangle(vUv, uPointB, uPointC, uThickness);

  if(isInsideAB || isInsideBC) {
    return vec4(uColor, 1.0);
  }

  if(isInsideBevelJoint(vUv, uPointA, uPointB, uPointC, uThickness)) {
    return vec4(0.0, 0.0, 1.0, 1.0);
  }

  return vec4(0., 0.2, float(uLineJoinType), 0.3);
}
void main() {
  if(uLineJoinType == 1) {
    gl_FragColor = drawRound();
  } else if(uLineJoinType == 2) {
    gl_FragColor = drawMiter();
  } else {
    gl_FragColor = drawBevel();
  }
}