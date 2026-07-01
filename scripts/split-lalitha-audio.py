#!/usr/bin/env python3
"""Split Samavedam Guru Garu Lalitha Sahasranamam into 23 section MP3s.

Uses silence detection for the preamble and early name-slokas. Each sloka is
two lines; pauses fall between lines. Page boundaries (every 10 slokas) end at
bounds[2×N − 1] so the next sloka’s opening line stays on the following page.

Usage:
  python3 scripts/split-lalitha-audio.py [path/to/full-samavedam.mp3]
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "src/audio/lalitha/full-samavedam.mp3"
OUT = ROOT / "src/audio/lalitha"

PREAMBLE = [0.0, 25.3, 63.6, 96.4]
NAMES_START = 96.4
NAMES_END = 1744.3
# Each sloka is two lines; silence gaps mark line breaks, so sloka N ends at bounds[2×N].
LINES_PER_SLOKA = 2
DETECTED_SLOKAS = 30  # reliable through b[60]; later pauses are irregular
LONG_LINE_GAP_SEC = 12.0  # coarse gap holding multiple lines → split inside it
NEXT_LINE_TAIL_MIN = 6.0   # min speech after inner split before next coarse pause
NEXT_LINE_TAIL_MAX = 15.0
NUM_NAME_SECTIONS = 19
TOTAL_SECTIONS = 23


def probe_duration(path: Path) -> float:
    return float(
        subprocess.check_output(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(path),
            ],
            text=True,
        ).strip()
    )


def silence_boundaries(path: Path) -> list[float]:
    proc = subprocess.run(
        [
            "ffmpeg",
            "-i",
            str(path),
            "-af",
            "silencedetect=noise=-30dB:d=0.2",
            "-f",
            "null",
            "-",
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    region = [
        float(m.group(1))
        for m in re.finditer(r"silence_end: ([0-9.]+)", proc.stderr)
        if NAMES_START - 1 <= float(m.group(1)) <= NAMES_END + 15
    ]
    gaps = [region[i + 1] - region[i] for i in range(len(region) - 1)]
    bounds = [region[0]]
    for i, gap in enumerate(gaps):
        if gap > 3.0:
            bounds.append(region[i + 1])
    return bounds


def sloka_end_index(n: int) -> int:
    """Silence-boundary index where sloka n ends (both lines complete)."""
    return n * LINES_PER_SLOKA - 1


def fine_silence_ends(path: Path, start: float, end: float) -> list[float]:
    proc = subprocess.run(
        [
            "ffmpeg",
            "-i",
            str(path),
            "-af",
            "silencedetect=noise=-30dB:d=0.2",
            "-f",
            "null",
            "-",
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return [
        float(m.group(1))
        for m in re.finditer(r"silence_end: ([0-9.]+)", proc.stderr)
        if start < float(m.group(1)) < end
    ]


def split_in_long_gap(path: Path, start: float, end: float) -> float:
    """Pick a split inside a long coarse gap: after last sloka line, before the next."""
    fine = fine_silence_ends(path, start, end)
    if not fine:
        return (start + end) / 2
    target = 8.5  # ~one line of the next sloka before the coarse pause
    candidates = [
        t for t in fine if NEXT_LINE_TAIL_MIN <= end - t <= NEXT_LINE_TAIL_MAX
    ]
    if candidates:
        return min(candidates, key=lambda t: abs(end - t - target))
    return fine[-2] if len(fine) >= 2 else fine[-1]


def page_boundary_time(sloka_num: int, bounds: list[float], src: Path) -> float:
    idx = sloka_end_index(sloka_num)
    if idx >= len(bounds):
        return bounds[-1]
    coarse_end = bounds[idx]
    if idx > 0 and coarse_end - bounds[idx - 1] > LONG_LINE_GAP_SEC:
        return split_in_long_gap(src, bounds[idx - 1], coarse_end)
    return coarse_end


def sloka_end_times(bounds: list[float], src: Path) -> list[float]:
    max_detected = min(
        DETECTED_SLOKAS,
        (len(bounds) - 1) // LINES_PER_SLOKA,
    )
    anchor = page_boundary_time(max_detected, bounds, src) if max_detected else NAMES_START
    ends: list[float] = []
    for n in range(1, 184):
        idx = sloka_end_index(n)
        if n <= max_detected and idx < len(bounds):
            ends.append(bounds[idx])
        else:
            rem = 183 - max_detected
            ends.append(anchor + (NAMES_END - anchor) * (n - max_detected) / rem)
    return ends


def section_cuts(sloka_ends: list[float], bounds: list[float], src: Path, total: float) -> list[float]:
    cuts = list(PREAMBLE)
    for group in range(18):
        sloka_num = (group + 1) * 10
        if sloka_num <= DETECTED_SLOKAS:
            cuts.append(page_boundary_time(sloka_num, bounds, src))
        else:
            cuts.append(sloka_ends[sloka_num - 1])
    cuts.append(NAMES_END)
    cuts.append(total)
    return cuts


def cut_mp3(src: Path, start: float, end: float, dest: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(src),
            "-ss",
            f"{start:.3f}",
            "-to",
            f"{end:.3f}",
            "-c:a",
            "libmp3lame",
            "-q:a",
            "4",
            str(dest),
        ],
        capture_output=True,
        check=True,
    )


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Source MP3 not found: {SRC}")

    total = probe_duration(SRC)
    bounds = silence_boundaries(SRC)
    if len(bounds) <= DETECTED_SLOKAS * LINES_PER_SLOKA:
        raise SystemExit(
            f"Expected >{DETECTED_SLOKAS * LINES_PER_SLOKA} silence boundaries, got {len(bounds)}"
        )

    sloka_ends = sloka_end_times(bounds, SRC)
    cuts = section_cuts(sloka_ends, bounds, SRC, total)
    if len(cuts) - 1 != TOTAL_SECTIONS:
        raise SystemExit(f"Expected {TOTAL_SECTIONS} sections, got {len(cuts) - 1}")

    OUT.mkdir(parents=True, exist_ok=True)
    for i in range(len(cuts) - 1):
        n = i + 1
        cut_mp3(SRC, cuts[i], cuts[i + 1], OUT / f"{n:02d}.mp3")
        print(f"{n:02d}.mp3  {cuts[i]:7.1f}s – {cuts[i + 1]:7.1f}s  ({cuts[i + 1] - cuts[i]:5.1f}s)")

    print(f"\nWrote {TOTAL_SECTIONS} files to {OUT}")


if __name__ == "__main__":
    main()
