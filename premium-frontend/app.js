const API_PREFIX = window.API_PREFIX || '';
const API = {
  register: `${API_PREFIX}$1`,
  login: `${API_PREFIX}$1`,
  me: `${API_PREFIX}$1`,
  topics: `${API_PREFIX}$1`,
  quiz: (topicId) => `${API_PREFIX}` + `$1`,
  submit: `${API_PREFIX}$1`,
  history: `${API_PREFIX}$1`
};

function getToken() { return localStorage.getItem('user_token'); }
function setToken(t) { localStorage.setItem('user_token', t); }
function clearToken() { localStorage.removeItem('user_token'); }

async function apiFetch(url, opts = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, Object.assign({}, opts, { headers }));
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const authSection = document.getElementById('authSection');
const appSection = document.getElementById('appSection');
const userInfo = document.getElementById('userInfo');
const premiumBox = document.getElementById('premiumBox');
const nonPremiumBox = document.getElementById('nonPremiumBox');

const topicSelect = document.getElementById('topicSelect');
const quizArea = document.getElementById('quizArea');
const resultArea = document.getElementById('resultArea');
const historyArea = document.getElementById('historyArea');

function setMsg(el, text, ok) {
  el.textContent = text || '';
  el.classList.remove('ok', 'err');
  if (text) el.classList.add(ok ? 'ok' : 'err');
}

async function loadTopics() {
  const data = await apiFetch(API.topics);
  topicSelect.innerHTML = '';
  for (const t of data.topics) {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.name;
    topicSelect.appendChild(opt);
  }
}

function showApp(show) {
  authSection.classList.toggle('hidden', show);
  appSection.classList.toggle('hidden', !show);
}

async function refreshMe() {
  const data = await apiFetch(API.me);
  const u = data.user;
  userInfo.textContent = `${u.name} (${u.email}) | Premium: ${u.premium ? 'YES' : 'NO'}`;
  premiumBox.classList.toggle('hidden', !u.premium);
  nonPremiumBox.classList.toggle('hidden', !!u.premium);
  await loadTopics();
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const el = document.getElementById('loginMsg');
  setMsg(el, '');
  try {
    const data = await apiFetch(API.login, { method:'POST', body: JSON.stringify({ email, password })});
    setToken(data.token);
    await refreshMe();
    showApp(true);
    setMsg(el, 'Muvaffaqiyatli kirdingiz', true);
  } catch (e) {
    setMsg(el, e.message, false);
  }
});

document.getElementById('registerBtn').addEventListener('click', async () => {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const el = document.getElementById('registerMsg');
  setMsg(el, '');
  try {
    const data = await apiFetch(API.register, { method:'POST', body: JSON.stringify({ name, email, password })});
    setToken(data.token);
    await refreshMe();
    showApp(true);
    setMsg(el, 'Ro‘yxatdan o‘tdingiz', true);
  } catch (e) {
    setMsg(el, e.message, false);
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  clearToken();
  showApp(false);
  quizArea.classList.add('hidden');
  resultArea.classList.add('hidden');
  historyArea.classList.add('hidden');
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
  await refreshMe();
});

document.getElementById('startQuizBtn').addEventListener('click', async () => {
  quizArea.innerHTML = '';
  resultArea.classList.add('hidden');
  historyArea.classList.add('hidden');

  const topicId = topicSelect.value;
  try {
    const data = await apiFetch(API.quiz(topicId));
    renderQuiz(data.topic, data.questions);
  } catch (e) {
    quizArea.classList.remove('hidden');
    quizArea.innerHTML = `<p class="msg err">${e.message}</p>`;
  }
});

document.getElementById('historyBtn').addEventListener('click', async () => {
  quizArea.classList.add('hidden');
  resultArea.classList.add('hidden');
  historyArea.classList.remove('hidden');
  historyArea.innerHTML = '<p class="muted">Yuklanmoqda...</p>';

  try {
    const data = await apiFetch(API.history);
    if (!data.attempts.length) {
      historyArea.innerHTML = '<p class="muted">Hozircha urinish yo‘q.</p>';
      return;
    }
    const rows = data.attempts.map(a => `
      <tr>
        <td>${new Date(a.createdAt).toLocaleString()}</td>
        <td>${a.topicName}</td>
        <td>${a.score}/${a.total}</td>
      </tr>
    `).join('');
    historyArea.innerHTML = `
      <h4>So‘nggi 20 urinish</h4>
      <table>
        <thead><tr><th>Vaqt</th><th>Mavzu</th><th>Natija</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch (e) {
    historyArea.innerHTML = `<p class="msg err">${e.message}</p>`;
  }
});

function renderQuiz(topic, questions) {
  quizArea.classList.remove('hidden');
  quizArea.innerHTML = `
    <h4>${topic.name} — 20 ta random savol</h4>
    <p class="muted">Javoblarni tanlang va yakunda “Yuborish” tugmasini bosing.</p>
  `;

  const form = document.createElement('div');

  for (let idx = 0; idx < questions.length; idx++) {
    const q = questions[idx];
    const box = document.createElement('div');
    box.className = 'q';
    box.innerHTML = `<h4>${idx+1}. ${escapeHtml(q.question)}</h4>`;
    q.options.forEach((opt, optIdx) => {
      const id = `q${q.id}_o${optIdx}`;
      const line = document.createElement('label');
      line.className = 'opt';
      line.innerHTML = `
        <input type="radio" name="q_${q.id}" id="${id}" value="${optIdx}">
        <span>${escapeHtml(opt)}</span>
      `;
      box.appendChild(line);
    });
    form.appendChild(box);
  }

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Yuborish';
  submitBtn.addEventListener('click', async () => {
    const answers = questions.map(q => {
      const chosen = document.querySelector(`input[name="q_${q.id}"]:checked`);
      return { questionId: q.id, chosenIndex: chosen ? Number(chosen.value) : -1 };
    }).filter(a => a.chosenIndex >= 0);

    if (answers.length === 0) {
      resultArea.classList.remove('hidden');
      resultArea.innerHTML = `<p class="msg err">Hech bo‘lmasa 1 ta javob tanlang.</p>`;
      return;
    }

    try {
      const data = await apiFetch(API.submit, { method:'POST', body: JSON.stringify({ topicId: topic.id, answers })});
      showResult(data);
    } catch (e) {
      resultArea.classList.remove('hidden');
      resultArea.innerHTML = `<p class="msg err">${e.message}</p>`;
    }
  });

  form.appendChild(submitBtn);
  quizArea.appendChild(form);
}

function showResult(data) {
  resultArea.classList.remove('hidden');
  const score = data.score;
  const total = data.total;

  const rows = data.answers.map((a, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${a.questionId}</td>
      <td>${a.chosenIndex}</td>
      <td>${a.correctIndex}</td>
      <td>${a.isCorrect ? '<span class="badge ok">To‘g‘ri</span>' : '<span class="badge no">Noto‘g‘ri</span>'}</td>
    </tr>
  `).join('');

  resultArea.innerHTML = `
    <h4>Natija</h4>
    <p><span class="badge ok">Score: ${score}/${total}</span> <span class="muted">Attempt ID: ${data.attemptId}</span></p>
    <details>
      <summary class="muted">Tafsilotlar (questionId va indekslar)</summary>
      <table>
        <thead><tr><th>#</th><th>questionId</th><th>chosenIndex</th><th>correctIndex</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="muted">Eslatma: Correct javoblar backendda saqlangan (questions.correctIndex) va har urinish attempt_answers jadvalida ham yoziladi.</p>
    </details>
  `;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[s]));
}

// Boot
(async function init() {
  const token = getToken();
  if (token) {
    try {
      await refreshMe();
      showApp(true);
    } catch (e) {
      clearToken();
      showApp(false);
    }
  }
})();