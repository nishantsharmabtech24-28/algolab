// Run with:  node test.js
const assert = require('assert');
const { ALGORITHMS, run, makeArray } = require('./algorithms');

const types = ['random', 'sorted', 'reversed', 'nearly'];
const sizes = [0, 1, 2, 3, 10, 57, 200];
let passed = 0;

for (const key of Object.keys(ALGORITHMS)) {
  for (const type of types) {
    for (const n of sizes) {
      const input = makeArray(n, type);
      const expected = input.slice().sort((a, b) => a - b);
      const { sorted } = run(key, input);
      assert.deepStrictEqual(sorted, expected, `${key} failed on ${type} n=${n}`);
      passed++;
    }
  }
  // duplicates
  const dup = Array.from({ length: 100 }, () => Math.floor(Math.random() * 10));
  assert.deepStrictEqual(run(key, dup).sorted, dup.slice().sort((a, b) => a - b), `${key} failed on duplicates`);
  passed++;
}

// Complexity sanity: bubble sort on reversed input does n(n-1)/2 comparisons
const n = 100;
assert.strictEqual(run('bubble', makeArray(n, 'reversed')).comparisons, (n * (n - 1)) / 2);
// Bubble sort best case (already sorted) is linear: n-1 comparisons
assert.strictEqual(run('bubble', makeArray(n, 'sorted')).comparisons, n - 1);
// Selection sort is always n(n-1)/2 comparisons
assert.strictEqual(run('selection', makeArray(n, 'random')).comparisons, (n * (n - 1)) / 2);
// Merge sort stays within n*ceil(log2 n)
const m = run('merge', makeArray(1024, 'random')).comparisons;
assert.ok(m <= 1024 * 10, 'merge sort exceeded n log n');
passed += 4;

console.log(`All ${passed} tests passed ✔`);
