import * as GLSpinner from 'glspinner';
import * as GLSpinnerTools from 'glspinner/tools';
import audioVert from './shader/audio.vert';
import audioFrag from './shader/audio.frag';

// 試作用なので短めにしておく。長くするほど1回の生成待ちが伸びて試行回数が落ちる。
const AUDIO_DURATION = 30.0;

class SoundLaboratory extends GLSpinner.BaseApplication {
    private audioInput!: GLSpinner.ShaderAudioInput;

    async preload(): Promise<void> {
        await super.preload();

        // varyings に 'oSample' を渡さないと transform feedback のリンクが張られない
        this.shaderLoader.loadShaderFromSource('audio', audioVert, audioFrag, ['oSample']);

        this.audioInput = new GLSpinner.ShaderAudioInput(this.gl, this.shaderLoader, AUDIO_DURATION);

        const begin = performance.now();
        await this.audioInput.load('audio', this.audioOutput.getAudioContext());
        const elapsed = performance.now() - begin;
        console.log(`[audio] generated ${AUDIO_DURATION.toFixed(1)}s in ${elapsed.toFixed(1)}ms`);
    }

    setup(): void {
        this.audioOutput.setInput(this.audioInput);

        GLSpinnerTools.AudioGuiController.initialize(
            () => this.audioOutput.playAudio(),
            () => this.audioOutput.stopAudio()
        );

        GLSpinnerTools.GuiUtility.addFolder('Export');
        GLSpinnerTools.GuiUtility.addAction(() => this.audioInput.saveToWav(), 'SaveWav');
        GLSpinnerTools.GuiUtility.resetFolder();
    }

    update(): void {}

    draw(): void {}
}

const scene = new GLSpinner.Scene();
const app = new SoundLaboratory(scene);
await app.start();
