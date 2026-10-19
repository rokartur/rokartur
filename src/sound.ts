const SAMPLES = ["hover", "press"] as const;
type Sample = (typeof SAMPLES)[number];

let context: AudioContext | undefined;
const buffers = new Map<Sample, AudioBuffer>();

function audio() {
  if (context) return context;
  const ctx = new AudioContext();
  for (const name of SAMPLES) {
    void fetch(`/sounds/${name}.mp3`)
      .then((response) => response.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .then((buffer) => buffers.set(name, buffer));
  }
  context = ctx;
  return ctx;
}

function play(sample: Sample, volume: number) {
  const ctx = audio();
  const buffer = buffers.get(sample);
  if (!buffer) return;
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.value = volume;
  source.connect(gain).connect(ctx.destination);
  source.start();
}

// Audio stays suspended until the first click or key press. Hovers before it would queue up
// and all fire at once on resume, so they are dropped instead.
function canPlayHover() {
  return audio().state === "running";
}

export function playHover() {
  if (!canPlayHover()) return;
  play("hover", 0.35);
}

export function playPress() {
  void audio().resume();
  play("press", 0.8);
}
