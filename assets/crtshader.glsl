precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main() {
    vec2 uv = outTexCoord;

    // Add screen curvature
    uv = uv * 2.0 - 1.0;
    uv *= vec2(1.1, 1.1); // scale a bit
    float r = dot(uv, uv);
    uv *= 1.0 + 0.2 * r;
    uv = (uv + 1.0) / 2.0;

    // Sample the color
    vec4 color = texture2D(uMainSampler, uv);

    // Add scanlines
    float scanline = sin(uv.y * resolution.y * 1.5) * 0.1;
    color.rgb -= scanline;

    // Slight chromatic offset
    color.r = texture2D(uMainSampler, uv + vec2(0.001, 0.0)).r;
    color.b = texture2D(uMainSampler, uv - vec2(0.001, 0.0)).b;

    gl_FragColor = color;
}