"""Generate two-note intervals as mono 44.1 kHz signed, little-endian PCM."""
from math import pi, sin
from pathlib import Path
from struct import pack

RATE = 44100
def note(hz):
    length = int(0.44 * RATE)
    samples = []
    for i in range(length):
        gain = min(1.0, i / 440, (length - i) / 1400)
        samples.append(pack("<h", round(11000 * gain * sin(2 * pi * hz * i / RATE))))
    return b"".join(samples)

for index, semitones in enumerate([4, 5, 7, 12]):
    gap = bytes(2 * int(0.12 * RATE))
    sound = note(440) + gap + note(440 * 2 ** (semitones / 12))
    (Path(__file__).resolve().parents[1] / "src/sounds" / f"pair{index}.snd").write_bytes(sound)
