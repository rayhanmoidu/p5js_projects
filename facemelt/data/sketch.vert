attribute vec3 aPosition;

attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  // This converts the shape from normal space to webgl space
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;

  vTexCoord = aTexCoord;
}
