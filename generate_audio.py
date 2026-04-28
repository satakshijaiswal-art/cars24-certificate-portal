"""
Generate ~18 synthetic-but-distinct royalty-free audio tracks for Cars24 certificate platform.
Approach: harmonically-varied sine/sawtooth/noise synthesis per genre archetype.
Each track: 30s, mono, 44100 Hz, int16, normalized to ~-6 dBFS peak.

Tracks generated (synthetic, CC0/royalty-free by construction — no samples used):
  BOLLYWOOD / HINDI VIBE (8 tracks)
    bollywood-dhol-bhangra.wav    — Dhol kick pattern + sitar harmonics
    garba-celebration.wav          — Dandiya/garba 6/8 groove
    wedding-shehnai.wav            — Shehnai-mimicking sine melody
    bhangra-drop.wav               — Heavy dhol + punchy energy
    desi-pop-upbeat.wav            — Indo-Western pop groove
    holi-festival.wav              — Festive percussion + melody
    punjabi-beat.wav               — Tumbi-inspired lead + dhol
    bollywood-romance.wav          — Soft strings + piano (slow)

  ENGLISH / WESTERN (8 tracks)
    pop-upbeat.wav                 — Clean pop with 4-on-floor kick
    lo-fi-chill.wav               — Lo-fi hip hop (filtered, gentle)
    edm-build.wav                  — EDM sawtooth + filter sweep
    indie-acoustic.wav             — Strumming guitar arpeggios
    cinematic-trailer.wav          — Cinematic brass + tension
    corporate-uplift-new.wav       — Bright corporate motivational
    electro-pop.wav                — Synth pop with arpeggio
    upbeat-folk.wav                — Folk-pop strumming

  MOOD / CINEMATIC (5 tracks)
    emotional-piano.wav            — Sparse emotional piano
    soft-strings.wav               — Lush string pad
    inspirational-rise.wav         — Building, hopeful
    gentle-acoustic.wav            — Gentle fingerpicked feel
    hopeful-morning.wav            — Bright, airy, positive

  FESTIVE / CELEBRATION (5 tracks)
    party-anthem.wav               — High-energy party
    victory-fanfare.wav            — Short victory brass
    fireworks-celebration.wav      — Explosive energy
    new-year-anthem.wav            — Countdown anthem
    award-ceremony.wav             — Grand ceremony march
"""

import numpy as np
import struct
import os

SAMPLE_RATE = 44100
DURATION = 30
N = SAMPLE_RATE * DURATION
t = np.linspace(0, DURATION, N, endpoint=False)

OUT_DIR = "/Users/a28819/Desktop/Claude filer/certificate-platform/public/audio"
os.makedirs(OUT_DIR, exist_ok=True)


def write_wav(filename, data, rate=44100):
    """Write int16 mono WAV without scipy dependency."""
    data = np.clip(data, -1.0, 1.0)
    # Normalize to -6 dBFS peak
    peak = np.max(np.abs(data))
    if peak > 0.001:
        data = data / peak * 0.5
    samples = (data * 32767).astype(np.int16)
    filepath = os.path.join(OUT_DIR, filename)
    num_samples = len(samples)
    num_channels = 1
    bits_per_sample = 16
    byte_rate = rate * num_channels * bits_per_sample // 8
    block_align = num_channels * bits_per_sample // 8
    data_bytes = samples.tobytes()
    chunk_size = 36 + len(data_bytes)

    with open(filepath, 'wb') as f:
        f.write(b'RIFF')
        f.write(struct.pack('<I', chunk_size))
        f.write(b'WAVE')
        f.write(b'fmt ')
        f.write(struct.pack('<I', 16))
        f.write(struct.pack('<H', 1))       # PCM
        f.write(struct.pack('<H', num_channels))
        f.write(struct.pack('<I', rate))
        f.write(struct.pack('<I', byte_rate))
        f.write(struct.pack('<H', block_align))
        f.write(struct.pack('<H', bits_per_sample))
        f.write(b'data')
        f.write(struct.pack('<I', len(data_bytes)))
        f.write(data_bytes)
    print(f"  Written: {filename}")


def sine(freq, amp=1.0, phase=0.0):
    return amp * np.sin(2 * np.pi * freq * t + phase)


def sawtooth(freq, amp=1.0):
    period = SAMPLE_RATE / freq
    idx = np.arange(N)
    return amp * (2 * ((idx / period) % 1) - 1)


def square(freq, amp=1.0):
    return amp * np.sign(np.sin(2 * np.pi * freq * t))


def noise(amp=1.0):
    return amp * np.random.uniform(-1, 1, N)


def lpf(signal, cutoff, rate=44100):
    """Simple single-pole low-pass filter."""
    alpha = cutoff / (cutoff + rate / (2 * np.pi))
    out = np.zeros_like(signal)
    out[0] = signal[0]
    for i in range(1, len(signal)):
        out[i] = alpha * signal[i] + (1 - alpha) * out[i - 1]
    return out


def lpf_fast(signal, cutoff, rate=44100):
    """Fast approximation LPF via cumulative sum (works well for low cutoffs)."""
    # Use a simple moving average as an approximate LPF
    window = max(1, int(rate / (2 * np.pi * cutoff)))
    kernel = np.ones(window) / window
    return np.convolve(signal, kernel, mode='same')


def env_adsr(attack=0.05, decay=0.1, sustain=0.7, release=0.2, total=30.0):
    """Simple ADSR envelope over total duration."""
    sr = SAMPLE_RATE
    a_s = int(attack * sr)
    d_s = int(decay * sr)
    r_s = int(release * sr)
    s_s = max(0, N - a_s - d_s - r_s)
    env = np.concatenate([
        np.linspace(0, 1, a_s),
        np.linspace(1, sustain, d_s),
        np.full(s_s, sustain),
        np.linspace(sustain, 0, r_s),
    ])
    return env[:N]


def beat_kick(bpm, amp=0.9):
    """Synthesize a kick-like thump at given BPM."""
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    sig = np.zeros(N)
    for start in range(0, N, beat_period):
        dur = min(int(0.15 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 30, dur))
        freq_sweep = np.linspace(120, 40, dur)
        phase = 2 * np.pi * np.cumsum(freq_sweep) / SAMPLE_RATE
        sig[start:start+dur] += amp * env_i * np.sin(phase)
    return sig


def dhol_kick(bpm, amp=0.85):
    """Dhol-style thump (2 hits per beat — theka pattern)."""
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    half = beat_period // 2
    sig = np.zeros(N)
    for start in range(0, N, beat_period):
        for offset, a in [(0, amp), (half, amp * 0.65)]:
            pos = start + offset
            if pos >= N:
                break
            dur = min(int(0.12 * SAMPLE_RATE), N - pos)
            env_i = np.exp(-np.linspace(0, 25, dur))
            freq_sweep = np.linspace(100, 50, dur)
            phase = 2 * np.pi * np.cumsum(freq_sweep) / SAMPLE_RATE
            sig[pos:pos+dur] += a * env_i * np.sin(phase)
    return sig


def melody_loop(notes_hz, durations_beats, bpm, amp=0.4, waveform='sine'):
    """Build a repeating melody from note list."""
    beat_dur = 60.0 / bpm
    sig = np.zeros(N)
    pos = 0
    note_idx = 0
    while pos < N:
        freq = notes_hz[note_idx % len(notes_hz)]
        dur_beats = durations_beats[note_idx % len(durations_beats)]
        dur_samples = int(dur_beats * beat_dur * SAMPLE_RATE)
        dur_samples = min(dur_samples, N - pos)
        if dur_samples <= 0:
            break
        t_note = np.linspace(0, dur_samples / SAMPLE_RATE, dur_samples, endpoint=False)
        env = np.ones(dur_samples)
        rel = min(int(0.05 * SAMPLE_RATE), dur_samples)
        env[-rel:] = np.linspace(1, 0, rel)
        att = min(int(0.01 * SAMPLE_RATE), dur_samples)
        env[:att] = np.linspace(0, 1, att)
        if waveform == 'sine':
            wave = amp * np.sin(2 * np.pi * freq * t_note)
        elif waveform == 'sawtooth':
            wave = amp * (2 * ((t_note * freq) % 1) - 1)
        else:
            wave = amp * np.sin(2 * np.pi * freq * t_note)
        sig[pos:pos+dur_samples] += wave * env
        pos += dur_samples
        note_idx += 1
    return sig


print("Generating BOLLYWOOD / HINDI VIBE tracks...")

# 1. bollywood-dhol-bhangra.wav — 140 BPM, dhol + sitar harmonics
def gen_bollywood_dhol_bhangra():
    bpm = 140
    # Dhol pattern
    kick = dhol_kick(bpm, 0.85)
    # Sitar-mimicking: fundamental + 5 harmonics with different decay
    sitar_notes = [196, 220, 261, 294, 330, 196]  # G3,A3,C4,D4,E4,G3
    sitar_durs = [2, 2, 1, 1, 2, 2]
    sitar = melody_loop(sitar_notes, sitar_durs, bpm, amp=0.35, waveform='sine')
    # Add harmonics for sitar timbre
    sitar2 = melody_loop([f*2 for f in sitar_notes], sitar_durs, bpm, amp=0.12, waveform='sine')
    sitar3 = melody_loop([f*3 for f in sitar_notes], sitar_durs, bpm, amp=0.06, waveform='sine')
    # High-freq tick (khanjira)
    tick = np.zeros(N)
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    for start in range(0, N, beat_period // 2):
        dur = min(int(0.03 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 40, dur))
        tick[start:start+dur] += 0.3 * env_i * noise(1)[:dur]
    sig = kick + sitar + sitar2 + sitar3 + tick
    # Fade in/out
    fade = int(0.5 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("bollywood-dhol-bhangra.wav", sig)

gen_bollywood_dhol_bhangra()

# 2. garba-celebration.wav — 6/8 feel at 126 BPM
def gen_garba():
    bpm = 126
    # 6/8: accents on beat 1 and 4 of each bar
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    sig = np.zeros(N)
    # Clap on 1 and 4
    for start in range(0, N, beat_period * 6):
        for offset in [0, beat_period * 3]:
            pos = start + offset
            if pos >= N:
                break
            dur = min(int(0.08 * SAMPLE_RATE), N - pos)
            env_i = np.exp(-np.linspace(0, 20, dur))
            sig[pos:pos+dur] += 0.55 * env_i * noise(1)[:dur]
    # Melody — raag kafi style
    garba_notes = [261, 293, 329, 349, 293, 261, 220, 261]
    garba_durs = [1.5, 0.5, 1, 1, 1, 1, 2, 1]
    mel = melody_loop(garba_notes, garba_durs, bpm, amp=0.4, waveform='sine')
    mel2 = melody_loop([f*1.5 for f in garba_notes], garba_durs, bpm, amp=0.1, waveform='sine')
    # Bass drone (tanpura feel)
    drone = 0.12 * sine(65.4) + 0.06 * sine(130.8) + 0.04 * sine(196.0)
    sig = sig + mel + mel2 + drone
    fade = int(0.5 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("garba-celebration.wav", sig)

gen_garba()

# 3. wedding-shehnai.wav — 90 BPM, slow processional
def gen_wedding_shehnai():
    bpm = 90
    # Shehnai: bright nasal tone = fundamental + strong 2nd, 3rd harmonics
    shehnai_notes = [392, 440, 493, 523, 493, 440, 392, 349]
    shehnai_durs = [2, 2, 1, 2, 1, 2, 2, 4]
    mel = melody_loop(shehnai_notes, shehnai_durs, bpm, amp=0.3, waveform='sine')
    mel2 = melody_loop([f*2 for f in shehnai_notes], shehnai_durs, bpm, amp=0.15, waveform='sine')
    mel3 = melody_loop([f*3 for f in shehnai_notes], shehnai_durs, bpm, amp=0.08, waveform='sine')
    # Tabla — subtle
    tabla = np.zeros(N)
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    for start in range(0, N, beat_period):
        dur = min(int(0.1 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 15, dur))
        tabla[start:start+dur] += 0.25 * env_i * np.sin(np.linspace(0, np.pi*4, dur))
    # Drone
    drone = 0.1 * sine(130.8) + 0.05 * sine(196.0)
    sig = mel + mel2 + mel3 + tabla + drone
    fade = int(1.0 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("wedding-shehnai.wav", sig)

gen_wedding_shehnai()

# 4. bhangra-drop.wav — 148 BPM, heavy energy
def gen_bhangra_drop():
    bpm = 148
    kick = dhol_kick(bpm, 0.9)
    # Extra punchy sub
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    sub = np.zeros(N)
    for start in range(0, N, beat_period):
        dur = min(int(0.2 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 18, dur))
        sub[start:start+dur] += 0.5 * env_i * np.sin(np.linspace(0, np.pi * 8, dur))
    # Tumbi-like lead: bright single-string pluck
    tumbi_notes = [294, 330, 294, 262, 294, 392, 330, 294]
    tumbi_durs = [1, 0.5, 0.5, 1, 1, 0.5, 0.5, 1]
    lead = melody_loop(tumbi_notes, tumbi_durs, bpm, amp=0.4, waveform='sawtooth')
    lead_filt = lpf_fast(lead, 3000)
    # High-hat pattern
    hat_period = beat_period // 4
    hat = np.zeros(N)
    for start in range(0, N, hat_period):
        dur = min(int(0.02 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 50, dur))
        hat[start:start+dur] += 0.2 * env_i * noise(1)[:dur]
    sig = kick + sub + lead_filt + hat
    fade = int(0.3 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("bhangra-drop.wav", sig)

gen_bhangra_drop()

# 5. desi-pop-upbeat.wav — 120 BPM, indo-western
def gen_desi_pop():
    bpm = 120
    kick = beat_kick(bpm, 0.7)
    # Snare on 2 and 4
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    snare = np.zeros(N)
    for start in range(beat_period, N, beat_period * 2):
        dur = min(int(0.06 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 15, dur))
        snare[start:start+dur] += 0.5 * (env_i * noise(1)[:dur] + 0.2 * env_i * sine(200)[:dur])
    # Western pop chord stabs (I-IV-V-I in C major: C-F-G-C)
    chord_notes = [
        [261, 329, 392],  # C major
        [349, 440, 523],  # F major
        [392, 493, 587],  # G major
        [261, 329, 392],  # C major
    ]
    chord_sig = np.zeros(N)
    bar_len = beat_period * 4
    for i in range(N // bar_len + 1):
        chord = chord_notes[i % len(chord_notes)]
        for freq in chord:
            start = i * bar_len
            dur = min(bar_len, N - start)
            if dur <= 0:
                break
            t_c = np.linspace(0, dur / SAMPLE_RATE, dur, endpoint=False)
            env_c = np.ones(dur)
            att = min(int(0.01 * SAMPLE_RATE), dur)
            rel = min(int(0.1 * SAMPLE_RATE), dur)
            env_c[:att] = np.linspace(0, 1, att)
            env_c[-rel:] = np.linspace(1, 0, rel)
            chord_sig[start:start+dur] += 0.1 * np.sin(2 * np.pi * freq * t_c) * env_c
    # Sitar-ish counter-melody
    sitar_notes = [523, 493, 440, 392, 440, 493, 523, 587]
    sitar_durs = [1, 1, 1, 2, 1, 1, 1, 1]
    sitar = melody_loop(sitar_notes, sitar_durs, bpm, amp=0.25, waveform='sine')
    sig = kick + snare + chord_sig + sitar
    fade = int(0.4 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("desi-pop-upbeat.wav", sig)

gen_desi_pop()

# 6. holi-festival.wav — 132 BPM, colourful festive
def gen_holi():
    bpm = 132
    kick = dhol_kick(bpm, 0.8)
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    # Fast dholak pattern (16th notes noise bursts)
    perc = np.zeros(N)
    sub_period = beat_period // 4
    for i, start in enumerate(range(0, N, sub_period)):
        dur = min(int(0.025 * SAMPLE_RATE), N - start)
        if dur <= 0:
            break
        env_i = np.exp(-np.linspace(0, 30, dur))
        amp_i = 0.35 if i % 4 == 0 else 0.12
        perc[start:start+dur] += amp_i * env_i * noise(1)[:dur]
    # Playful melody
    holi_notes = [523, 587, 659, 523, 698, 659, 587, 523]
    holi_durs = [1, 1, 0.5, 0.5, 1, 0.5, 0.5, 1]
    mel = melody_loop(holi_notes, holi_durs, bpm, amp=0.35, waveform='sine')
    # Bass
    bass = melody_loop([130, 130, 174, 196], [4, 4, 4, 4], bpm, amp=0.25, waveform='sine')
    sig = kick + perc + mel + bass
    fade = int(0.3 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("holi-festival.wav", sig)

gen_holi()

# 7. punjabi-beat.wav — 136 BPM, tumbi lead
def gen_punjabi():
    bpm = 136
    kick = dhol_kick(bpm, 0.88)
    # Tumbi: bright plucked single-string, overtone-rich
    tumbi_notes = [392, 440, 392, 349, 392, 523, 440, 392]
    tumbi_durs = [0.5, 0.5, 1, 1, 0.5, 0.5, 1, 1]
    lead = melody_loop(tumbi_notes, tumbi_durs, bpm, amp=0.45, waveform='sawtooth')
    lead2 = melody_loop(tumbi_notes, tumbi_durs, bpm, amp=0.12, waveform='sine')  # blend
    lead_filt = lpf_fast(lead, 4000) + lead2
    # Call-and-response bass
    bass_notes = [98, 110, 98, 87]
    bass_durs = [4, 4, 4, 4]
    bass = melody_loop(bass_notes, bass_durs, bpm, amp=0.3, waveform='sine')
    sig = kick + lead_filt + bass
    fade = int(0.3 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("punjabi-beat.wav", sig)

gen_punjabi()

# 8. bollywood-romance.wav — 72 BPM, slow strings + piano
def gen_bollywood_romance():
    bpm = 72
    # Slow string pad: rich chord pads
    chord_freqs = [261, 329, 392, 523]  # C major
    pad = np.zeros(N)
    for i, freq in enumerate(chord_freqs):
        vib = 1 + 0.003 * np.sin(2 * np.pi * 5.5 * t)  # subtle vibrato
        pad += 0.1 * np.sin(2 * np.pi * freq * vib * t)
    pad2_freqs = [220, 277, 330, 440]  # A minor
    pad2 = np.zeros(N)
    # Alternate between C and Am every 4 bars
    bar = int(SAMPLE_RATE * 60 / bpm * 4)
    for i in range(N // bar + 1):
        freqs = chord_freqs if i % 2 == 0 else pad2_freqs
        start = i * bar
        dur = min(bar, N - start)
        if dur <= 0:
            break
        for freq in freqs:
            t_c = np.linspace(0, dur / SAMPLE_RATE, dur, endpoint=False)
            att = min(int(0.2 * SAMPLE_RATE), dur)
            rel = min(int(0.3 * SAMPLE_RATE), dur)
            env_c = np.ones(dur)
            env_c[:att] = np.linspace(0, 1, att)
            env_c[-rel:] = np.linspace(1, 0, rel)
            pad[start:start+dur] += 0.08 * np.sin(2 * np.pi * freq * t_c) * env_c
    # Piano melody
    piano_notes = [523, 493, 440, 392, 349, 392, 440, 523]
    piano_durs = [2, 1, 1, 2, 2, 2, 2, 4]
    piano = melody_loop(piano_notes, piano_durs, bpm, amp=0.3, waveform='sine')
    sig = pad + piano
    fade = int(1.5 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("bollywood-romance.wav", sig)

gen_bollywood_romance()

print("\nGenerating ENGLISH / WESTERN tracks...")

# 9. pop-upbeat.wav — 128 BPM, clean pop
def gen_pop_upbeat():
    bpm = 128
    kick = beat_kick(bpm, 0.75)
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    # Snare 2+4
    snare = np.zeros(N)
    for start in range(beat_period, N, beat_period * 2):
        dur = min(int(0.07 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 12, dur))
        snare[start:start+dur] += 0.55 * (0.6 * env_i * noise(1)[:dur] + 0.3 * env_i * np.sin(np.linspace(0, 6*np.pi, dur)))
    # Hi-hat 8th notes
    hat = np.zeros(N)
    for start in range(0, N, beat_period // 2):
        dur = min(int(0.015 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 60, dur))
        hat[start:start+dur] += 0.18 * env_i * noise(1)[:dur]
    # Synth lead
    pop_notes = [523, 659, 784, 659, 523, 440, 523, 659]
    pop_durs = [1, 1, 2, 1, 1, 2, 1, 3]
    lead = melody_loop(pop_notes, pop_durs, bpm, amp=0.35, waveform='sine')
    # Bass
    bass_notes = [130, 130, 174, 196]
    bass = melody_loop(bass_notes, [4, 4, 4, 4], bpm, amp=0.3, waveform='sine')
    sig = kick + snare + hat + lead + bass
    fade = int(0.3 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("pop-upbeat.wav", sig)

gen_pop_upbeat()

# 10. lo-fi-chill.wav — 80 BPM, filtered, gentle
def gen_lofi():
    bpm = 80
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    # Lazy kick (softer, slightly off-grid feel)
    kick = np.zeros(N)
    offsets = [0, int(beat_period * 2.5), beat_period * 4, int(beat_period * 6.5)]
    pattern_len = beat_period * 8
    for pat_start in range(0, N, pattern_len):
        for off in offsets:
            pos = pat_start + off
            if pos >= N:
                break
            dur = min(int(0.12 * SAMPLE_RATE), N - pos)
            env_i = np.exp(-np.linspace(0, 20, dur))
            freq_sweep = np.linspace(80, 40, dur)
            phase = 2 * np.pi * np.cumsum(freq_sweep) / SAMPLE_RATE
            kick[pos:pos+dur] += 0.6 * env_i * np.sin(phase)
    # Vinyl crackle
    crackle = lpf_fast(noise(0.04), 500)
    # Mellow chord stabs (jazz 7ths)
    chord_freqs_list = [
        [261, 329, 392, 466],   # Cmaj7
        [220, 277, 330, 415],   # Am7
        [174, 220, 261, 329],   # Fmaj7
        [196, 247, 294, 370],   # Gdom7
    ]
    chords = np.zeros(N)
    bar_len = beat_period * 4
    for i, cf in enumerate(chord_freqs_list * (N // (bar_len * len(chord_freqs_list)) + 1)):
        start = i * bar_len
        if start >= N:
            break
        dur = min(bar_len, N - start)
        t_c = np.linspace(0, dur / SAMPLE_RATE, dur, endpoint=False)
        att = min(int(0.05 * SAMPLE_RATE), dur)
        rel = min(int(0.2 * SAMPLE_RATE), dur)
        env_c = np.ones(dur)
        env_c[:att] = np.linspace(0, 1, att)
        env_c[-rel:] = np.linspace(1, 0, rel)
        for freq in cf:
            chords[start:start+dur] += 0.07 * np.sin(2 * np.pi * freq * t_c) * env_c
    # Lo-fi piano melody
    lofi_notes = [392, 349, 329, 261, 293, 329, 349, 392]
    lofi_durs = [2, 2, 1, 3, 2, 2, 2, 4]
    mel = melody_loop(lofi_notes, lofi_durs, bpm, amp=0.25, waveform='sine')
    # Heavy low-pass everything
    sig = kick + crackle + chords + mel
    sig = lpf_fast(sig, 6000)
    fade = int(1.0 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("lo-fi-chill.wav", sig)

gen_lofi()

# 11. edm-build.wav — 138 BPM, sawtooth + filter sweep
def gen_edm():
    bpm = 138
    kick = beat_kick(bpm, 0.85)
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    # Four-to-floor kick extra sub
    sub = np.zeros(N)
    for start in range(0, N, beat_period):
        dur = min(int(0.15 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 25, dur))
        sub[start:start+dur] += 0.4 * env_i * np.sin(np.linspace(0, np.pi * 6, dur))
    # Sawtooth synth lead with sweep
    # Frequency sweeps from low to high over 16-bar phrase (simulated filter opening)
    phrase_len = beat_period * 64
    lead_raw = sawtooth(440, amp=0.4) + sawtooth(880, amp=0.15) + sawtooth(220, amp=0.2)
    # Create a time-varying filter effect by multiplying with a slow-moving envelope
    phase_arr = np.array([(i % phrase_len) / phrase_len for i in range(N)])
    sweep_env_out = 1 - (1 - phase_arr) ** 3
    lead = lead_raw * (0.3 + 0.7 * sweep_env_out)
    # Chord stabs
    stab_freqs = [220, 277, 330]  # Am chord
    stab = np.zeros(N)
    stab_period = beat_period * 2
    for start in range(0, N, stab_period):
        dur = min(int(0.08 * SAMPLE_RATE), N - start)
        if dur <= 0:
            break
        t_s = np.linspace(0, dur / SAMPLE_RATE, dur, endpoint=False)
        env_s = np.exp(-np.linspace(0, 10, dur))
        for freq in stab_freqs:
            stab[start:start+dur] += 0.12 * env_s * (2 * ((t_s * freq) % 1) - 1)
    # Snare
    snare = np.zeros(N)
    for start in range(beat_period, N, beat_period * 2):
        dur = min(int(0.05 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 8, dur))
        snare[start:start+dur] += 0.6 * env_i * noise(1)[:dur]
    sig = kick + sub + lead + stab + snare
    fade = int(0.2 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("edm-build.wav", sig)

gen_edm()

# 12. indie-acoustic.wav — 96 BPM, arpeggio guitar feel
def gen_indie_acoustic():
    bpm = 96
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    # Fingerpicked arpeggio pattern
    arp_pattern = [
        # bar 1: C maj
        [261, 4], [329, 2], [392, 2], [523, 4], [392, 2], [329, 2],
        # bar 2: G maj
        [196, 4], [247, 2], [294, 2], [392, 4], [294, 2], [247, 2],
        # bar 3: Am
        [220, 4], [261, 2], [329, 2], [440, 4], [329, 2], [261, 2],
        # bar 4: F maj
        [174, 4], [220, 2], [261, 2], [349, 4], [261, 2], [220, 2],
    ]
    notes_hz = [p[0] for p in arp_pattern]
    notes_dur = [p[1] for p in arp_pattern]
    # Sixteenth notes at bpm
    subdiv_per_beat = 4
    arp = melody_loop(notes_hz, [d / subdiv_per_beat for d in notes_dur], bpm, amp=0.35, waveform='sine')
    # Pluck decay envelope per note — approximate via shaping the sine
    # Simple capo-like brightness by adding 2nd harmonic
    arp2 = melody_loop([h * 2 for h in notes_hz], [d / subdiv_per_beat for d in notes_dur], bpm, amp=0.08, waveform='sine')
    # Soft kick
    kick = beat_kick(bpm, 0.45)
    # Mellow pad behind
    pad_freqs = [261, 329, 392]
    pad = sum(0.04 * sine(f) for f in pad_freqs)
    sig = arp + arp2 + kick + pad
    fade = int(0.5 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("indie-acoustic.wav", sig)

gen_indie_acoustic()

# 13. cinematic-trailer.wav — 88 BPM, brass tension
def gen_cinematic_trailer():
    bpm = 88
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    # Staccato brass hits
    brass_notes = [196, 220, 246, 196, 174, 196]
    brass_durs = [2, 2, 4, 2, 2, 4]
    brass = melody_loop(brass_notes, brass_durs, bpm, amp=0.4, waveform='sawtooth')
    brass2 = melody_loop([f * 1.5 for f in brass_notes], brass_durs, bpm, amp=0.15, waveform='sawtooth')
    brass_filt = lpf_fast(brass + brass2, 3000)
    # Low rumble timpani
    timp = np.zeros(N)
    bar_len = beat_period * 4
    for start in range(0, N, bar_len):
        dur = min(int(0.5 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 5, dur))
        t_t = np.linspace(0, dur / SAMPLE_RATE, dur)
        timp[start:start+dur] += 0.4 * env_i * np.sin(2 * np.pi * 80 * t_t)
    # Building tension pad
    tension_freqs = [196, 233, 277, 330]  # minor-ish cluster
    pad = np.zeros(N)
    for i, freq in enumerate(tension_freqs):
        # Each voice comes in slightly offset
        offset = int(i * SAMPLE_RATE * 2)
        if offset < N:
            seg = N - offset
            t_p = np.linspace(0, seg / SAMPLE_RATE, seg, endpoint=False)
            env_p = np.minimum(np.linspace(0, 1, seg), 1.0)
            pad[offset:] += 0.08 * np.sin(2 * np.pi * freq * t_p) * env_p
    sig = brass_filt + timp + pad
    fade = int(1.0 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("cinematic-trailer.wav", sig)

gen_cinematic_trailer()

# 14. electro-pop.wav — 124 BPM, synth arpeggio
def gen_electro_pop():
    bpm = 124
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    kick = beat_kick(bpm, 0.7)
    # Arp synth (sixteenth note arpeggio)
    arp_notes = [523, 659, 784, 1046, 784, 659, 523, 440]
    arp_durs = [0.25] * 8
    arp = melody_loop(arp_notes, arp_durs, bpm, amp=0.3, waveform='sine')
    arp2 = melody_loop([f * 2 for f in arp_notes], arp_durs, bpm, amp=0.08, waveform='sine')
    # Chords
    chord_stack = [261, 329, 392, 523]
    chords = sum(0.06 * sine(f) for f in chord_stack)
    # Snare
    snare = np.zeros(N)
    for start in range(beat_period, N, beat_period * 2):
        dur = min(int(0.05 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 10, dur))
        snare[start:start+dur] += 0.5 * env_i * noise(1)[:dur]
    sig = kick + arp + arp2 + chords + snare
    fade = int(0.3 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("electro-pop.wav", sig)

gen_electro_pop()

# 15. upbeat-folk.wav — 104 BPM, folk strumming
def gen_upbeat_folk():
    bpm = 104
    beat_period = int(SAMPLE_RATE * 60.0 / bpm)
    # Strum pattern: down on 1,3 / up on 2,4 (simplified)
    strum_notes = [
        [196, 247, 294, 392],   # G major
        [261, 329, 392, 523],   # C major
        [293, 370, 440, 587],   # D major
        [261, 329, 392, 523],   # C major
    ]
    strum_sig = np.zeros(N)
    bar_len = beat_period * 4
    for i in range(N // bar_len + 2):
        chord = strum_notes[i % len(strum_notes)]
        for beat in range(4):
            pos = i * bar_len + beat * beat_period
            if pos >= N:
                break
            dur = min(beat_period, N - pos)
            t_s = np.linspace(0, dur / SAMPLE_RATE, dur, endpoint=False)
            env_s = np.ones(dur)
            rel = min(int(0.3 * beat_period), dur)
            env_s[-rel:] = np.linspace(1, 0, rel)
            for j, freq in enumerate(chord):
                delay = int(j * 0.008 * SAMPLE_RATE)  # strum spread
                start_j = pos + delay
                dur_j = min(dur - delay, N - start_j)
                if dur_j <= 0:
                    continue
                t_j = np.linspace(0, dur_j / SAMPLE_RATE, dur_j, endpoint=False)
                strum_sig[start_j:start_j+dur_j] += 0.08 * np.sin(2 * np.pi * freq * t_j) * env_s[:dur_j]
    kick = beat_kick(bpm, 0.5)
    sig = strum_sig + kick
    fade = int(0.4 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("upbeat-folk.wav", sig)

gen_upbeat_folk()

print("\nGenerating MOOD / CINEMATIC tracks...")

# 16. emotional-piano.wav — 60 BPM, sparse
def gen_emotional_piano():
    bpm = 60
    piano_notes = [261, 329, 392, 261, 220, 277, 329, 220, 196, 247, 294, 196]
    piano_durs = [2, 1, 1, 2, 2, 1, 1, 4, 2, 1, 1, 4]
    mel = melody_loop(piano_notes, piano_durs, bpm, amp=0.35, waveform='sine')
    # Harmonics (piano overtones)
    mel2 = melody_loop(piano_notes, piano_durs, bpm, amp=0.08, waveform='sine')
    mel2_shifted = np.roll(mel2, int(0.002 * SAMPLE_RATE))  # tiny timing shift for warmth
    # Low sustain pedal notes
    pedal = 0.06 * sine(65.4) + 0.04 * sine(98.0)
    # Gentle reverb approximation: delayed copy
    delay_samples = int(0.08 * SAMPLE_RATE)
    reverb = np.zeros(N)
    reverb[delay_samples:] = mel[:N - delay_samples] * 0.15
    sig = mel + mel2_shifted + pedal + reverb
    fade = int(1.5 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("emotional-piano.wav", sig)

gen_emotional_piano()

# 17. soft-strings.wav — 70 BPM, string pad
def gen_soft_strings():
    bpm = 70
    # String pad: slow attack, long sustain, multiple voices slightly detuned
    chord_progressions = [
        [261, 329, 392, 523],   # C major
        [220, 277, 330, 440],   # A minor
        [174, 220, 261, 349],   # F major
        [196, 247, 294, 392],   # G major
    ]
    beat_period = int(SAMPLE_RATE * 60 / bpm)
    bar_len = beat_period * 4
    sig = np.zeros(N)
    for i, chord in enumerate(chord_progressions * (N // (bar_len * len(chord_progressions)) + 1)):
        start = i * bar_len
        if start >= N:
            break
        dur = min(bar_len, N - start)
        t_c = np.linspace(0, dur / SAMPLE_RATE, dur, endpoint=False)
        att = min(int(0.4 * SAMPLE_RATE), dur)
        rel = min(int(0.5 * SAMPLE_RATE), dur)
        env_c = np.ones(dur)
        env_c[:att] = np.linspace(0, 1, att)
        env_c[-rel:] = np.linspace(1, 0, rel)
        for j, freq in enumerate(chord):
            # Slight detuning per voice for ensemble feel
            detune = 1 + (j - 1.5) * 0.003
            sig[start:start+dur] += 0.1 * np.sin(2 * np.pi * freq * detune * t_c) * env_c
    # Melody on top
    mel_notes = [523, 587, 659, 587, 523, 493, 440, 523]
    mel_durs = [2, 2, 4, 2, 2, 2, 2, 4]
    mel = melody_loop(mel_notes, mel_durs, bpm, amp=0.2, waveform='sine')
    sig = sig + mel
    fade = int(2.0 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("soft-strings.wav", sig)

gen_soft_strings()

# 18. inspirational-rise.wav — 80 BPM, building hopeful
def gen_inspirational_rise():
    bpm = 80
    beat_period = int(SAMPLE_RATE * 60 / bpm)
    # Start minimal, build up
    # Piano line
    piano_notes = [261, 329, 392, 440, 523, 587, 659, 784]
    piano_durs = [2, 2, 2, 2, 2, 2, 2, 4]
    piano = melody_loop(piano_notes, piano_durs, bpm, amp=0.3, waveform='sine')
    # Strings come in halfway
    halfway = N // 2
    strings = np.zeros(N)
    chord = [261, 329, 392, 523]
    for i, freq in enumerate(chord):
        t_s = np.linspace(0, DURATION, N, endpoint=False)
        att = int(3 * SAMPLE_RATE)
        strings[halfway:] += 0.08 * np.sin(2 * np.pi * freq * t_s[:N - halfway])
        if halfway < N:
            build = min(att, N - halfway)
            strings[halfway:halfway + build] *= np.linspace(0, 1, build)
    # Rising bass note
    bass = np.zeros(N)
    bass_freqs = [65, 73, 82, 87, 98, 110, 123, 130]
    for i, freq in enumerate(bass_freqs):
        start = i * (N // len(bass_freqs))
        dur_seg = N // len(bass_freqs)
        t_b = np.linspace(0, dur_seg / SAMPLE_RATE, dur_seg, endpoint=False)
        bass[start:start + dur_seg] += 0.15 * np.sin(2 * np.pi * freq * t_b)
    sig = piano + strings + bass
    fade = int(1.0 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("inspirational-rise.wav", sig)

gen_inspirational_rise()

# 19. hopeful-morning.wav — 84 BPM, bright airy
def gen_hopeful_morning():
    bpm = 84
    # Bright high-register melody
    mel_notes = [784, 880, 1046, 880, 784, 698, 784, 880]
    mel_durs = [2, 2, 4, 2, 2, 4, 2, 6]
    mel = melody_loop(mel_notes, mel_durs, bpm, amp=0.3, waveform='sine')
    mel2 = melody_loop([f * 1.5 for f in mel_notes], mel_durs, bpm, amp=0.07, waveform='sine')
    # Gentle chord pad
    pad = sum(0.05 * sine(f) for f in [261, 329, 392])
    # Light kick
    kick = beat_kick(bpm, 0.35)
    # Bell-like ping on beat 1 of each bar
    beat_period = int(SAMPLE_RATE * 60 / bpm)
    bell = np.zeros(N)
    for start in range(0, N, beat_period * 4):
        dur = min(int(0.3 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 8, dur))
        t_b = np.linspace(0, dur / SAMPLE_RATE, dur, endpoint=False)
        bell[start:start+dur] += 0.25 * env_i * np.sin(2 * np.pi * 1046 * t_b)
    sig = mel + mel2 + pad + kick + bell
    fade = int(0.8 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("hopeful-morning.wav", sig)

gen_hopeful_morning()

print("\nGenerating FESTIVE / CELEBRATION tracks...")

# 20. party-anthem.wav — 130 BPM, high energy party
def gen_party_anthem():
    bpm = 130
    kick = beat_kick(bpm, 0.85)
    beat_period = int(SAMPLE_RATE * 60 / bpm)
    # Claps on 2+4
    clap = np.zeros(N)
    for start in range(beat_period, N, beat_period * 2):
        dur = min(int(0.06 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 8, dur))
        clap[start:start+dur] += 0.6 * env_i * noise(1)[:dur]
    # Synth brass stabs
    stab_notes = [523, 659, 784, 659, 523, 440, 523, 784]
    stab_durs = [0.5, 0.5, 1, 0.5, 0.5, 1, 1, 3]
    stab = melody_loop(stab_notes, stab_durs, bpm, amp=0.4, waveform='sawtooth')
    stab_filt = lpf_fast(stab, 4000)
    # Bass
    bass_notes = [130, 174, 196, 174]
    bass = melody_loop(bass_notes, [4, 4, 4, 4], bpm, amp=0.3, waveform='sine')
    # Hi-hat
    hat = np.zeros(N)
    for start in range(0, N, beat_period // 4):
        dur = min(int(0.012 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 60, dur))
        hat[start:start+dur] += 0.15 * env_i * noise(1)[:dur]
    sig = kick + clap + stab_filt + bass + hat
    fade = int(0.2 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("party-anthem.wav", sig)

gen_party_anthem()

# 21. victory-fanfare.wav — 100 BPM, brass fanfare
def gen_victory_fanfare():
    bpm = 100
    # Heroic fanfare melody (classic da-da-da-DUM pattern)
    fanfare_notes = [392, 392, 392, 523, 392, 523, 659, 523, 392, 523]
    fanfare_durs = [0.5, 0.5, 0.5, 2, 0.5, 0.5, 2, 0.5, 0.5, 4]
    brass = melody_loop(fanfare_notes, fanfare_durs, bpm, amp=0.45, waveform='sawtooth')
    brass2 = melody_loop([f * 1.25 for f in fanfare_notes], fanfare_durs, bpm, amp=0.18, waveform='sawtooth')
    brass_filt = lpf_fast(brass + brass2, 5000)
    # Percussion / timpani
    beat_period = int(SAMPLE_RATE * 60 / bpm)
    timp = np.zeros(N)
    for start in range(0, N, beat_period):
        dur = min(int(0.3 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 6, dur))
        t_t = np.linspace(0, dur / SAMPLE_RATE, dur)
        timp[start:start+dur] += 0.35 * env_i * np.sin(2 * np.pi * 90 * t_t)
    sig = brass_filt + timp
    fade = int(0.5 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("victory-fanfare.wav", sig)

gen_victory_fanfare()

# 22. fireworks-celebration.wav — 128 BPM, explosive energy
def gen_fireworks():
    bpm = 128
    kick = beat_kick(bpm, 0.9)
    beat_period = int(SAMPLE_RATE * 60 / bpm)
    # Firework "whoosh" bursts — filtered noise that rises then pops
    bursts = np.zeros(N)
    burst_period = beat_period * 8
    for start in range(0, N, burst_period):
        whoosh_dur = int(0.4 * SAMPLE_RATE)
        if start + whoosh_dur > N:
            break
        t_w = np.linspace(0, 1, whoosh_dur)
        env_w = t_w ** 0.5 * np.exp(-t_w * 3)
        bursts[start:start+whoosh_dur] += 0.5 * env_w * noise(1)[:whoosh_dur]
        # Pop
        pop_start = start + whoosh_dur
        if pop_start < N:
            pop_dur = int(0.1 * SAMPLE_RATE)
            env_p = np.exp(-np.linspace(0, 20, min(pop_dur, N - pop_start)))
            bursts[pop_start:pop_start+len(env_p)] += 0.7 * env_p * noise(1)[:len(env_p)]
    # Melodic celebration riff
    riff_notes = [659, 784, 880, 1046, 880, 784, 659, 523]
    riff_durs = [1, 1, 1, 2, 1, 1, 1, 4]
    riff = melody_loop(riff_notes, riff_durs, bpm, amp=0.35, waveform='sine')
    # High-energy bass
    bass_notes = [130, 174, 196, 130]
    bass = melody_loop(bass_notes, [4, 4, 4, 4], bpm, amp=0.32, waveform='sine')
    sig = kick + bursts + riff + bass
    fade = int(0.2 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("fireworks-celebration.wav", sig)

gen_fireworks()

# 23. award-ceremony.wav — 96 BPM, grand march
def gen_award_ceremony():
    bpm = 96
    beat_period = int(SAMPLE_RATE * 60 / bpm)
    # March-like snare pattern
    snare = np.zeros(N)
    # Snare on 2 and 4 with a roll leading into each bar
    for bar_start in range(0, N, beat_period * 4):
        for beat in [1, 3]:  # 0-indexed: beat 2 and 4
            pos = bar_start + beat * beat_period
            if pos >= N:
                break
            dur = min(int(0.06 * SAMPLE_RATE), N - pos)
            env_i = np.exp(-np.linspace(0, 12, dur))
            snare[pos:pos+dur] += 0.55 * (0.5 * env_i * noise(1)[:dur] + 0.3 * env_i * np.sin(np.linspace(0, 8*np.pi, dur)))
    # Grand brass melody
    brass_notes = [261, 329, 392, 523, 659, 523, 392, 261]
    brass_durs = [2, 2, 2, 2, 4, 2, 2, 4]
    brass = melody_loop(brass_notes, brass_durs, bpm, amp=0.4, waveform='sawtooth')
    brass2 = melody_loop([f * 1.5 for f in brass_notes], brass_durs, bpm, amp=0.12, waveform='sawtooth')
    brass_filt = lpf_fast(brass + brass2, 4000)
    # Timpani
    kick = np.zeros(N)
    for start in range(0, N, beat_period):
        dur = min(int(0.25 * SAMPLE_RATE), N - start)
        env_i = np.exp(-np.linspace(0, 8, dur))
        t_k = np.linspace(0, dur / SAMPLE_RATE, dur)
        kick[start:start+dur] += 0.4 * env_i * np.sin(2 * np.pi * 75 * t_k)
    sig = snare + brass_filt + kick
    fade = int(0.5 * SAMPLE_RATE)
    sig[:fade] *= np.linspace(0, 1, fade)
    sig[-fade:] *= np.linspace(1, 0, fade)
    write_wav("award-ceremony.wav", sig)

gen_award_ceremony()

print("\nAll tracks generated successfully!")
print(f"Output directory: {OUT_DIR}")
