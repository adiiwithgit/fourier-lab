# Fourier Lab

An interactive Fourier series demo that runs in the browser. Spinning circles (epicycles) add up to build **square**, **sawtooth** and **triangle** waves. Add more circles and watch the corners sharpen, then turn on sound and hear the wave get brighter.

**Live demo:** https://adiiwithgit.github.io/fourier-lab/

## Features
- Epicycle view with a streaming waveform trace
- Choose Square, Sawtooth or Triangle
- 1 to 24 circles, with a live amplitude bar chart (click a bar to jump to that many circles)
- Sound playback built from the same harmonics (Web Audio `PeriodicWave`)
- Pause, speed control, hide or show circles
- Light and dark mode, reduced-motion friendly, keyboard accessible

## The maths
Each wave is a sum of sines, `f(t) = Σ aₙ sin(n t)`:

| Wave | Coefficient aₙ |
| --- | --- |
| Square | 4 / (π n) for odd n, else 0 |
| Sawtooth | (−1)ⁿ⁺¹ · 2 / (π n) |
| Triangle | ±8 / (π² n²) for odd n, else 0 |

Each term is drawn as a circle of radius |aₙ| turning at n times the base rate. The height of the last circle's tip is the wave value. The overshoot near the square wave's corners is the **Gibbs phenomenon**.

## Run locally
No build step and no dependencies. Open `index.html` in a browser.

## Deploy on GitHub Pages
Settings → Pages → Deploy from a branch → `main` / `(root)`.

## Project structure
```
index.html   page structure
style.css    layout, theming (light and dark)
script.js    maths, canvas drawing, audio, controls
```

## Ideas to extend
- Draw your own shape and let the circles trace it
- Live FFT of microphone input
- Phase sliders per harmonic

## License
MIT
