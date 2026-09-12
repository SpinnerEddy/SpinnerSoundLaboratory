#version 300 es
precision highp float;

// RASTERIZER_DISCARD で捨てられるので中身は使われないが、
// プログラムのリンクにフラグメントシェーダーが必要なので置いている
out vec4 fragColor;

void main() {
    fragColor = vec4(0.0);
}
