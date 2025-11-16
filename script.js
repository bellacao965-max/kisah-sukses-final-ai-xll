// UI helpers
document.getElementById('year').textContent = new Date().getFullYear();

// Chat form
const form = document.getElementById('chatForm');
const input = document.getElementById('prompt');
const messages = document.getElementById('messages');

function appendMessage(txt, cls='ai') {
  const d = document.createElement('div');
  d.className = 'msg ' + cls;
  d.textContent = txt;
  messages.appendChild(d);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const v = input.value.trim();
  if (!v) return;
  appendMessage(v, 'user');
  appendMessage('...', 'ai');
  try {
    const res = await KSPai.askAI(v);
    const aiBubbles = messages.querySelectorAll('.msg.ai');
    if (aiBubbles.length) aiBubbles[aiBubbles.length-1].textContent = res;
  } catch (err) {
    const aiBubbles = messages.querySelectorAll('.msg.ai');
    if (aiBubbles.length) aiBubbles[aiBubbles.length-1].textContent = 'Could not reach AI server.';
  }
  input.value = '';
});

// Quotes carousel
const quotes = Array.from(document.querySelectorAll('#quotes .quote'));
let qIndex = 0;
function showQuote(i) {
  quotes.forEach((el, idx)=> el.style.display = idx===i ? 'block' : 'none');
}
showQuote(qIndex);
document.getElementById('nextQuote').addEventListener('click', ()=> {
  qIndex = (qIndex+1) % quotes.length;
  showQuote(qIndex);
});

// Game: number guessing
let secret = Math.floor(Math.random()*20)+1;
document.getElementById('guessBtn').addEventListener('click', ()=> {
  const val = Number(document.getElementById('guessInput').value);
  const r = document.getElementById('gameResult');
  const badge = document.getElementById('gameBadge');
  if (!val || val<1 || val>20) { r.textContent = 'Masukkan angka 1-20'; return; }
  if (val === secret) {
    r.textContent = 'Benar! Kamu menang!';
    badge.classList.remove('hidden');
  } else if (val < secret) {
    r.textContent = 'Terlalu kecil.';
  } else {
    r.textContent = 'Terlalu besar.';
  }
});
// Allow restart
document.getElementById('guessInput').addEventListener('dblclick', ()=> {
  secret = Math.floor(Math.random()*20)+1;
  document.getElementById('gameResult').textContent = 'Game di-reset.';
  document.getElementById('gameBadge').classList.add('hidden');
});
