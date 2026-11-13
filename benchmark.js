// Run with:  node benchmark.js
// Prints a comparison table of comparisons / writes / time for every algorithm.
const { ALGORITHMS, run, makeArray } = require('./algorithms');

const sizes = [100, 500, 1000, 2000];
const types = ['random', 'sorted', 'reversed'];

for (const type of types) {
  console.log(`\n=== Input: ${type.toUpperCase()} ===`);
  console.log('n'.padEnd(7) + 'Algorithm'.padEnd(16) + 'Comparisons'.padStart(14) + 'Writes'.padStart(12) + 'Time(ms)'.padStart(11));
  for (const n of sizes) {
    const input = makeArray(n, type);
    for (const key of Object.keys(ALGORITHMS)) {
      const r = run(key, input);
      console.log(
        String(n).padEnd(7) +
        ALGORITHMS[key].name.padEnd(16) +
        String(r.comparisons).padStart(14) +
        String(r.writes).padStart(12) +
        r.ms.toFixed(2).padStart(11)
      );
    }
    console.log('-'.repeat(60));
  }
}
