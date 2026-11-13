/**
 * AlgoLab - sorting algorithms written as generators.
 * Each algorithm sorts the array IN PLACE and yields events so the UI can
 * animate it and so we can count operations (machine-independent analysis):
 *   { t: 'cmp',   i, j }   -> two elements were compared
 *   { t: 'write', idx: [] } -> one or more array positions were written
 */
(function (root) {
  const cmp = (i, j) => ({ t: 'cmp', i, j });
  const wr = (...idx) => ({ t: 'write', idx });

  // ---------- 1. Bubble Sort : O(n^2) ----------
  function* bubble(a) {
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - 1 - i; j++) {
        yield cmp(j, j + 1);
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swapped = true;
          yield wr(j, j + 1);
        }
      }
      if (!swapped) break; // already sorted -> best case O(n)
    }
  }

  // ---------- 2. Selection Sort : O(n^2) ----------
  function* selection(a) {
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      for (let j = i + 1; j < n; j++) {
        yield cmp(j, min);
        if (a[j] < a[min]) min = j;
      }
      if (min !== i) {
        [a[i], a[min]] = [a[min], a[i]];
        yield wr(i, min);
      }
    }
  }

  // ---------- 3. Insertion Sort : O(n^2), best O(n) ----------
  function* insertion(a) {
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      while (j >= 0) {
        yield cmp(j, i);
        if (a[j] > key) {
          a[j + 1] = a[j];
          yield wr(j + 1);
          j--;
        } else break;
      }
      a[j + 1] = key;
      yield wr(j + 1);
    }
  }

  // ---------- 4. Merge Sort : O(n log n) (Divide & Conquer) ----------
  function* mergeSortRec(a, l, r, aux) {
    if (l >= r) return;
    const m = (l + r) >> 1;
    yield* mergeSortRec(a, l, m, aux);
    yield* mergeSortRec(a, m + 1, r, aux);
    for (let x = l; x <= r; x++) aux[x] = a[x];
    let i = l, j = m + 1, k = l;
    while (i <= m && j <= r) {
      yield cmp(i, j);
      if (aux[i] <= aux[j]) a[k] = aux[i++];
      else a[k] = aux[j++];
      yield wr(k++);
    }
    while (i <= m) { a[k] = aux[i++]; yield wr(k++); }
    while (j <= r) { a[k] = aux[j++]; yield wr(k++); }
  }
  function* merge(a) {
    yield* mergeSortRec(a, 0, a.length - 1, a.slice());
  }

  // ---------- 5. Quick Sort : avg O(n log n), worst O(n^2) ----------
  // Iterative (explicit stack) so worst-case O(n) recursion depth does not
  // create a deep chain of nested generators.
  function* quick(a) {
    const stack = [[0, a.length - 1]];
    while (stack.length) {
      const [lo, hi] = stack.pop();
      if (lo >= hi) continue;
      const pivot = a[hi];
      let i = lo;
      for (let j = lo; j < hi; j++) {
        yield cmp(j, hi);
        if (a[j] < pivot) {
          [a[i], a[j]] = [a[j], a[i]];
          yield wr(i, j);
          i++;
        }
      }
      [a[i], a[hi]] = [a[hi], a[i]];
      yield wr(i, hi);
      stack.push([i + 1, hi], [lo, i - 1]);
    }
  }

  // ---------- 6. Heap Sort : O(n log n) ----------
  function* siftDown(a, i, n) {
    while (true) {
      let largest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n) { yield cmp(l, largest); if (a[l] > a[largest]) largest = l; }
      if (r < n) { yield cmp(r, largest); if (a[r] > a[largest]) largest = r; }
      if (largest === i) return;
      [a[i], a[largest]] = [a[largest], a[i]];
      yield wr(i, largest);
      i = largest;
    }
  }
  function* heap(a) {
    const n = a.length;
    for (let i = (n >> 1) - 1; i >= 0; i--) yield* siftDown(a, i, n);
    for (let end = n - 1; end > 0; end--) {
      [a[0], a[end]] = [a[end], a[0]];
      yield wr(0, end);
      yield* siftDown(a, 0, end);
    }
  }

  // ---------- Metadata used by the UI / README ----------
  const ALGORITHMS = {
    bubble:    { name: 'Bubble Sort',    fn: bubble,    best: 'O(n)',       avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)',    stable: 'Yes', paradigm: 'Brute force' },
    selection: { name: 'Selection Sort', fn: selection, best: 'O(n²)',      avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)',    stable: 'No',  paradigm: 'Brute force' },
    insertion: { name: 'Insertion Sort', fn: insertion, best: 'O(n)',       avg: 'O(n²)',      worst: 'O(n²)',      space: 'O(1)',    stable: 'Yes', paradigm: 'Decrease & conquer' },
    merge:     { name: 'Merge Sort',     fn: merge,     best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)',    stable: 'Yes', paradigm: 'Divide & conquer' },
    quick:     { name: 'Quick Sort',     fn: quick,     best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)',      space: 'O(log n)', stable: 'No', paradigm: 'Divide & conquer' },
    heap:      { name: 'Heap Sort',      fn: heap,      best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)',    stable: 'No',  paradigm: 'Transform & conquer' },
  };

  /** Run an algorithm to completion on a copy of `input`; returns stats + sorted array. */
  function run(key, input) {
    const a = input.slice();
    let comparisons = 0, writes = 0;
    const t0 = (typeof performance !== 'undefined' ? performance : Date).now();
    for (const ev of ALGORITHMS[key].fn(a)) {
      if (ev.t === 'cmp') comparisons++;
      else writes += ev.idx.length;
    }
    const ms = (typeof performance !== 'undefined' ? performance : Date).now() - t0;
    return { comparisons, writes, ms, sorted: a };
  }

  /** Generate test data: random | sorted | reversed | nearly */
  function makeArray(n, type) {
    const a = Array.from({ length: n }, (_, i) => i + 1);
    if (type === 'sorted') return a;
    if (type === 'reversed') return a.reverse();
    // shuffle (Fisher-Yates)
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (type === 'nearly') {
      a.sort((x, y) => x - y);
      for (let k = 0; k < Math.max(1, n / 20); k++) {
        const i = Math.floor(Math.random() * n), j = Math.floor(Math.random() * n);
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
    return a;
  }

  const api = { ALGORITHMS, run, makeArray };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AlgoLab = api;
})(typeof window !== 'undefined' ? window : globalThis);
