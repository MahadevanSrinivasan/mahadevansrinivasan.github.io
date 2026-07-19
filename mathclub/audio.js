// audio.js - Web Audio API Synthesizer for MathClub

class AudioManager {
    constructor() {
        this.ctx = null;
        this.isEnabled = localStorage.getItem("mathclub_sound") !== "false";
    }

    init() {
        if (this.ctx) return;
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContextClass();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser", e);
        }
    }

    setSoundEnabled(enabled) {
        this.isEnabled = enabled;
        localStorage.setItem("mathclub_sound", enabled ? "true" : "false");
    }

    playTick() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
    }

    playCorrect() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        const time = this.ctx.currentTime;

        // Play an arpeggiated neat double chime (C6, then E6)
        this._chime(523.25, time, 0.12); // C5
        this._chime(659.25, time + 0.08, 0.15); // E5
        this._chime(783.99, time + 0.16, 0.2); // G5
    }

    playIncorrect() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        // Buzzy low pitch slide
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        // Filter out very high annoying frequencies
        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.26);
    }

    playCombo(comboLevel) {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        // Pitch proportional to combo level!
        const baseFreq = 440 + (comboLevel * 40);
        const time = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(baseFreq, time);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, time + 0.15);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(time + 0.2);
    }

    playVictory() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        const time = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C major arpeggio
        notes.forEach((freq, index) => {
            this._chime(freq, time + (index * 0.08), 0.35, "triangle");
        });
    }

    playGameOver() {
        if (!this.isEnabled) return;
        this.init();
        if (!this.ctx) return;

        const time = this.ctx.currentTime;
        const notes = [293.66, 277.18, 261.63, 220.00]; // Descending sad tone
        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(freq, time + (index * 0.15));

            gain.gain.setValueAtTime(0.08, time + (index * 0.15));
            gain.gain.exponentialRampToValueAtTime(0.001, time + (index * 0.15) + 0.25);

            const filter = this.ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(500, time);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time + (index * 0.15));
            osc.stop(time + (index * 0.15) + 0.3);
        });
    }

    _chime(frequency, startTime, duration = 0.2, type = "sine") {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, startTime);

        gain.gain.setValueAtTime(0.0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
    }
}

// Export or attach
const audioManager = new AudioManager();
if (typeof module !== 'undefined' && module.exports) {
    module.exports = audioManager;
} else {
    window.audioManager = audioManager;
}
