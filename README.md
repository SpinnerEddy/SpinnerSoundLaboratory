# SpinnerSoundLaboratory
Spinner Eddy Sound Shader Workspace

[glspinner](https://github.com/SpinnerEddy/glspinner) の transform feedback を使って、
GLSL で音を書いて鳴らすための試作リポジトリ。

## セットアップ

```bash
npm install
npm run dev
```

`npm install` 時に glspinner の `prepare`(ビルド + 型生成)が走るため、初回は1分ほどかかる。

http://127.0.0.1:33333 を開くと、右上の lil-gui から Play / Stop / SaveWav が使える。

## 使い方

`src/shader/audio.vert` の `mainSound(time)` を書き換えて、ブラウザをリロードする。

- 出力は `oSample`(vec2, L/R)。`src/main.ts` の `loadShaderFromSource` に渡す varyings 名と一致させること。
- `uSampleRate` と `uTimeOffset`(単位はサンプル数)が uniform として渡ってくる。
- 生成の所要時間は起動時にコンソールへ出る。`AUDIO_DURATION` を伸ばすとここが伸びる。

## ライブラリの参照

`package.json` では glspinner をコミットハッシュ固定の git 依存で引いている。
ライブラリ側を同時にいじるときは、glspinner のディレクトリで `npm link`、
このリポジトリで `npm link glspinner` に切り替える。

`lil-gui` と `jszip` は glspinner の optional peerDependency だが、
`glspinner/tools` のバンドルが両方を直接 import しているため、利用側で入れる必要がある。

## 現状の制約

- 再生は先頭からのみ。seek とループは未対応(glspinner 側の課題)。
- シェーダーを書き換えたら都度リロードが必要。
- 音量の上限が無いので、書き損じると大きな音が出る。最初はボリュームを絞って確認する。
