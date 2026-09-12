#version 300 es
precision highp float;

#define PI acos(-1.0)
#define TAU (PI * 2.0)

// ShaderAudioInput から渡される
uniform float uSampleRate;
uniform float uTimeOffset; // 単位はサンプル数

// transform feedback の出力。main.ts の varyings 指定と名前を合わせること
out vec2 oSample;

#define BPM 128.0

float timeToBeat(float t) {
    return t / 60.0 * BPM;
}

float beatToTime(float b) {
    return b / BPM * 60.0;
}

float sine(float phase) {
    return sin(TAU * fract(phase));
}

float saw(float phase) {
    return 2.0 * fract(phase) - 1.0;
}

float noteToFreq(float note) {
    return 440.0 * pow(2.0, (note - 69.0) / 12.0);
}

// ---- ここから下を書き換えて実験する ----

float kick(float t) {
    float amp = exp(-4.0 * t);
    float phase = 50.0 * t - 10.0 * exp(-70.0 * t);
    return amp * sine(phase);
}

vec2 bass(float t) {
    float freq = noteToFreq(36.0);
    return vec2(saw(freq * t) * exp(-3.0 * t) * 0.4);
}

vec2 mainSound(float time) {
    float beat = timeToBeat(time);

    vec2 ret = vec2(0.0);
    ret += 0.5 * kick(beatToTime(mod(beat, 1.0)));
    ret += 0.3 * bass(beatToTime(mod(beat, 0.5)));

    return ret * 0.5;
}

// ---- ここまで ----

void main() {
    float time = (float(gl_VertexID) + uTimeOffset) / uSampleRate;
    oSample = clamp(mainSound(time), -1.0, 1.0);
    gl_Position = vec4(0.0);
}
