# AlgoLab – Sorting Algorithm Visualizer & Complexity Analyzer

**Design and Analysis of Algorithms (DAA) – Mini Project**

AlgoLab implements six classic sorting algorithms from scratch and lets you
**watch them run**, **count their operations**, and **compare them
empirically** against their theoretical time complexity.

## Features

- 6 algorithms implemented from scratch (no built-in `sort`): Bubble, Selection, Insertion, Merge, Quick, Heap
- Live bar-chart animation (yellow = comparison, red = write, green = sorted)
- Adjustable array size and animation speed
- 4 input types: random, nearly sorted, reversed (worst case for several algorithms), sorted (best case)
- Counts **comparisons** and **array writes** (machine-independent measures), plus CPU time
- One-click **benchmark** that runs all algorithms on an identical input
- Automated test suite and a command-line benchmark
- Zero dependencies – plain HTML, CSS and JavaScript

## How to run

**Visualizer:** open `AlgoLab.html` (or `index.html`) in any browser by double-clicking it.

**Tests:**
```bash
node test.js
```

**Command-line benchmark:**
```bash
node benchmark.js
```

## Project structure

```
algolab/
├── AlgoLab.html    # standalone single-file version (double-click to run)
├── index.html      # multi-file version: page layout
├── style.css       #   styling
├── algorithms.js   #   all 6 algorithms + analysis helpers (also used by the tests)
├── app.js          #   UI / animation logic
├── test.js         # correctness + complexity tests
├── benchmark.js    # CLI benchmark
└── README.md
```

`AlgoLab.html` is `index.html` + `style.css` + `algorithms.js` + `app.js` combined
into one file, so it can be opened or emailed on its own.

## Complexity summary

| Algorithm | Best | Average | Worst | Space | Stable | Paradigm |
|-----------|------|---------|-------|-------|--------|----------|
| Bubble    | O(n) | O(n²) | O(n²) | O(1) | Yes | Brute force |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | No | Brute force |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Yes | Decrease & conquer |
| Merge     | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | Divide & conquer |
| Quick     | O(n log n) | O(n log n) | O(n²) | O(log n) | No | Divide & conquer |
| Heap      | O(n log n) | O(n log n) | O(n log n) | O(1) | No | Transform & conquer |

## How it works

Each algorithm is a JavaScript **generator function** that sorts in place and
`yield`s an event every time it compares or writes. That single design gives
us three things from one implementation:

1. **Animation** – the UI consumes events one at a time with a delay.
2. **Operation counting** – the benchmark consumes events instantly and tallies them.
3. **Testability** – the same code is verified in Node against `Array.sort`.

## Key observations (from the benchmark)

- On **reversed** input, Bubble sort does exactly n(n−1)/2 comparisons (the O(n²) worst case); on **sorted** input, with its early-exit check, it does only n−1 (the O(n) best case).
- Selection sort does the same n(n−1)/2 comparisons on *every* input – it is not adaptive.
- Merge and Heap sort stay near n log n regardless of input order.
- Quick sort (last-element pivot) is fast on random data but degrades to O(n²) on already sorted or reversed data – the reason randomized or median-of-three pivots are used in practice.

## Possible extensions

- Add Counting / Radix sort for linear-time comparisons
- Randomized pivot for Quick sort
- Plot comparisons vs. n to fit growth curves
- Step-by-step pause / rewind controls

## Author

Nishant – B.Tech, LIET
