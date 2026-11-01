/**
 * Pure Web Audio API ambient cafe atmosphere synthesizer.
 * Creates a soft, warm coffee roastery acoustic backdrop with gentle vinyl crackle and warm tone.
 * Zero external audio file dependency.
 */

class CafeSoundtrack {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private toneOsc: OscillatorNode | null = null;

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 1.5);
      this.masterGain.connect(this.ctx.destination);

      // Warm acoustic pink-ish noise buffer
      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.08;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      // Filter for warm low-end roastery murmur
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.noiseNode.connect(filter);
      filter.connect(this.masterGain);
      this.noiseNode.start();

      // Soft harmonic warm tone (coffee bean hum)
      this.toneOsc = this.ctx.createOscillator();
      this.toneOsc.type = 'sine';
      this.toneOsc.frequency.setValueAtTime(110, this.ctx.currentTime); // A2 warm chord
      const toneGain = this.ctx.createGain();
      toneGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      this.toneOsc.connect(toneGain);
      toneGain.connect(this.masterGain);
      this.toneOsc.start();

      this.isPlaying = true;
    } catch {
      // Audio autoplay policy fallback
      this.isPlaying = false;
    }
  }

  public stop() {
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.noiseNode?.stop();
          this.toneOsc?.stop();
          this.ctx?.close();
          this.ctx = null;
          this.isPlaying = false;
        }, 500);
      } catch {
        this.isPlaying = false;
      }
    } else {
      this.isPlaying = false;
    }
  }
}

export const cafeAudio = new CafeSoundtrack();
