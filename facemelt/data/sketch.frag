precision mediump float;

uniform sampler2D tex0;
varying vec2 vTexCoord;
uniform vec2 texSize; 

vec2 modI(vec2 a, float b) {
    vec2 m = a - floor((a + 0.5) / b) * b;
    return floor(m + 0.5);
}

void main() {
    vec2 uv = vTexCoord;
    uv.y = 1.0 - uv.y;

    vec2 pixel = floor(uv * texSize);
    // vec2 coords = pixel + modI(pixel, 4.0);

    // vec4 rgba = vec4(coords.y - 3.0, coords.y - 2.0, coords.y - 1.0, coords.y);
    // rgba = (rgba + 0.5) / texSize.y;

    pixel.x = (pixel.x) / texSize.x;
    pixel.y = (pixel.y) / texSize.y;

    // pixel = pixel / texSize.y;

    vec4 pix0 = texture2D(tex0, vec2(pixel.x, pixel.y));

    gl_FragColor = vec4(pix0.r, pix0.g, pix0.b, pix0.a);



    // gl_FragColor = rgba;


    // float offset = mod( pixel.y, 4.0 );

    // vec4 rgba = vec4(coords.y - 3.0, coords.y - 2.0, coords.y - 1.0, coords.y);
    // rgba = (rgba + 0.5) / texSize.y;
    // pixel = (pixel + 0.5) / texSize.x;

    // vec4 pix0 = texture2D(tex0, vec2(pixel.x, rgba.r));
    // vec4 pix1 = texture2D(tex0, vec2(pixel.x, rgba.g));
    // vec4 pix2 = texture2D(tex0, vec2(pixel.x, rgba.b));
    // vec4 pix3 = texture2D(tex0, vec2(pixel.x, rgba.a));

    // int i = 0;
    // if (i == 0) {
    //     gl_FragColor = vec4(pix0.r, pix1.g, pix2.b, pix3.a);
    // } else if ( i == 1 ) {
    //     gl_FragColor = vec4(pix0.g, pix1.b, pix2.a, pix3.r);
    // } else if ( i == 2 ) {
    //     gl_FragColor = vec4(pix0.b, pix1.a, pix2.r, pix3.g);
    // } else {
    //     gl_FragColor = vec4(pix0.a, pix1.r, pix2.g, pix3.b);
    // }
}
