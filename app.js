// UI logic: connects the generator-based algorithms to the DOM.
const { ALGORITHMS, run, makeArray } = window.AlgoLab;

const $ = (id) => document.getElementById(id);
const barsEl = $('bars');
let array = [];
let running = false;
let stopRequested = false;

// ---- populate algorithm dropdown ----
for (const [key, a] of Object.entries(ALGORITHMS)) {
  const o = document.createElement('option');
  o.value = key; o.textContent = a.name;
  $('algo').appendChild(o);
}

function render(highlight = {}) {
  const max = Math.max(...array, 1);
  if (barsEl.children.length !== array.length) {
    barsEl.innerHTML = '';
    array.forEach(() => { const d = document.createElement('div'); d.className = 'bar'; barsEl.appendChild(d); });
  }
  [...barsEl.children].forEach((el, i) => {
    el.style.height = (array[i] / max) * 100 + '%';
    el.className = 'bar' + (highlight[i] ? ' ' + highlight[i] : '');
  });
}

function showInfo() {
  const a = ALGORITHMS[$('algo').value];
  $('info').querySelector('tbody').innerHTML =
    `<tr><td>${a.paradigm}</td><td>${a.best}</td><td>${a.avg}</td><td>${a.worst}</td><td>${a.space}</td><td>${a.stable}</td></tr>`;
}

function newArray() {
  array = makeArray(+$('size').value, $('type').value);
  $('sComp').textContent = 0; $('sWrite').textContent = 0;
  $('sTime').textContent = '0.00'; $('sStatus').textContent = 'Ready';
  render();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const delay = () => Math.round(200 / Math.pow(1.06, +$('speed').value)); // 1..100 -> slow..fast

async function start() {
  if (running) return;
  running = true; stopRequested = false;
  $('start').disabled = true; $('generate').disabled = true;
  $('sStatus').textContent = 'Sorting…';
  let comparisons = 0, writes = 0;
  const t0 = performance.now();
  const a = array.slice();
  const gen = ALGORITHMS[$('algo').value].fn(a);

  // Sort a working copy; display it as the generator mutates it.
  array = a;
  for (const ev of gen) {
    if (stopRequested) break;
    const hl = {};
    if (ev.t === 'cmp') { comparisons++; hl[ev.i] = 'cmp'; hl[ev.j] = 'cmp'; }
    else { writes += ev.idx.length; ev.idx.forEach((i) => (hl[i] = 'write')); }
    render(hl);
    $('sComp').textContent = comparisons;
    $('sWrite').textContent = writes;
    $('sTime').textContent = (performance.now() - t0).toFixed(2);
    await sleep(delay());
  }

  if (stopRequested) {
    $('sStatus').textContent = 'Stopped';
  } else {
    const all = {};
    array.forEach((_, i) => (all[i] = 'done'));
    render(all);
    $('sStatus').textContent = 'Sorted ✔';
  }
  running = false;
  $('start').disabled = false; $('generate').disabled = false;
}

function benchmark() {
  const base = array.slice();
  const results = Object.keys(ALGORITHMS).map((k) => ({ k, ...run(k, base) }));
  const minC = Math.min(...results.map((r) => r.comparisons)) || 1;
  const maxC = Math.max(...results.map((r) => r.comparisons)) || 1;
  const tbody = $('benchTable').querySelector('tbody');
  tbody.innerHTML = '';
  results.sort((a, b) => a.comparisons - b.comparisons).forEach((r) => {
    const tr = document.createElement('tr');
    const fastest = r.comparisons === minC ? ' class="fastest"' : '';
    tr.innerHTML =
      `<td${fastest}>${ALGORITHMS[r.k].name}</td>` +
      `<td>${r.comparisons.toLocaleString()}</td>` +
      `<td>${r.writes.toLocaleString()}</td>` +
      `<td>${r.ms.toFixed(2)}</td>` +
      `<td><div class="relbar" style="width:${Math.max(1, (r.comparisons / maxC) * 100)}%"></div></td>`;
    tbody.appendChild(tr);
  });
}

$('generate').onclick = newArray;
$('start').onclick = start;
$('stop').onclick = () => (stopRequested = true);
$('bench').onclick = benchmark;
$('algo').onchange = showInfo;
$('type').onchange = () => !running && newArray();
$('size').oninput = () => { $('sizeVal').textContent = $('size').value; if (!running) newArray(); };

showInfo();
newArray();
