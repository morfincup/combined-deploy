const API_PREFIX = window.API_PREFIX || '';
const API = {
  adminLogin: `${API_PREFIX}/api/admin/login',
  users: `${API_PREFIX}/api/admin/users',
  setPremium: (id) => `/api/admin/users/${id}/premium`
};

function getToken() { return localStorage.getItem('admin_token'); }
function setToken(t) { localStorage.setItem('admin_token', t); }
function clearToken() { localStorage.removeItem('admin_token'); }

async function apiFetch(url, opts = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, Object.assign({}, opts, { headers }));
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

const adminAuth = document.getElementById('adminAuth');
const adminApp = document.getElementById('adminApp');
const adminMsg = document.getElementById('adminMsg');
const usersWrap = document.getElementById('usersTableWrap');

function setMsg(text, ok) {
  adminMsg.textContent = text || '';
  adminMsg.classList.remove('ok', 'err');
  if (text) adminMsg.classList.add(ok ? 'ok' : 'err');
}

function showApp(show) {
  adminAuth.classList.toggle('hidden', show);
  adminApp.classList.toggle('hidden', !show);
}

document.getElementById('adminLoginBtn').addEventListener('click', async () => {
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value;
  setMsg('');
  try {
    const data = await apiFetch(API.adminLogin, { method:'POST', body: JSON.stringify({ username, password })});
    setToken(data.token);
    showApp(true);
    await loadUsers();
    setMsg('Admin kirdi', true);
  } catch (e) {
    setMsg(e.message, false);
  }
});

document.getElementById('adminLogoutBtn').addEventListener('click', () => {
  clearToken();
  showApp(false);
  usersWrap.innerHTML = '';
});

document.getElementById('adminRefreshBtn').addEventListener('click', async () => {
  await loadUsers();
});

async function loadUsers() {
  usersWrap.innerHTML = '<p class="muted">Yuklanmoqda...</p>';
  try {
    const data = await apiFetch(API.users);
    if (!data.users.length) {
      usersWrap.innerHTML = '<p class="muted">Foydalanuvchi yo‘q.</p>';
      return;
    }

    const rows = data.users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${new Date(u.createdAt).toLocaleString()}</td>
        <td>${u.premium ? '<span class="badge ok">YES</span>' : '<span class="badge no">NO</span>'}</td>
        <td>
          <button class="secondary" data-action="toggle" data-id="${u.id}" data-premium="${u.premium ? 1 : 0}">
            Premium ${u.premium ? 'o‘chirish' : 'yoqish'}
          </button>
        </td>
      </tr>
    `).join('');

    usersWrap.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Ism</th><th>Email</th><th>Created</th><th>Premium</th><th>Action</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    usersWrap.querySelectorAll('button[data-action="toggle"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const current = Number(btn.getAttribute('data-premium')) === 1;
        btn.disabled = true;
        try {
          await apiFetch(API.setPremium(id), { method:'PATCH', body: JSON.stringify({ premium: !current })});
          await loadUsers();
        } catch (e) {
          alert(e.message);
        } finally {
          btn.disabled = false;
        }
      });
    });

  } catch (e) {
    usersWrap.innerHTML = `<p class="msg err">${e.message}</p>`;
  }
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
      showApp(true);
      await loadUsers();
    } catch (e) {
      clearToken();
      showApp(false);
    }
  }
})();