// SPA with hash-based navigation
const app = document.getElementById('app');
const progressDialog = document.getElementById('progressDialog');
const progressBtn = document.getElementById('progressBtn');
const homeLink = document.getElementById('homeLink');

const COURSES = [3,4,5,6];
const AREAS = [
  { id: 'lectura', name: 'Lectura', color: 'blue' },
  { id: 'escritura', name: 'Escritura', color: 'green' },
  { id: 'calculo', name: 'Cálculo', color: 'purple' },
];

// Two activities per area per course
// Activities are deliberately simple; feel free to expand.
const ACTIVITIES = {
  lectura: [
    {
      id: '1',
      title: 'Comprensión breve',
      prompt: 'Lee el siguiente texto y responde: "El zorro ágil cruzó el río para ayudar a su familia a encontrar alimento". ¿Qué buscaba el zorro?',
      type: 'choice',
      options: ['Refugio', 'Alimento', 'Agua'],
      answer: 1
    },
    {
      id: '2',
      title: 'Idea principal',
      prompt: 'En la oración: "Las abejas trabajan en equipo para construir panales", ¿cuál es la idea principal?',
      type: 'choice',
      options: [
        'Las abejas descansan todo el día',
        'Las abejas construyen panales trabajando en equipo',
        'Las abejas viven solas'
      ],
      answer: 1
    }
  ],
  escritura: [
    {
      id: '1',
      title: 'Ordena la oración',
      prompt: 'Ordena correctamente: "la / carta / escribió / Camila". Escribe la oración final.',
      type: 'text',
      answerText: 'Camila escribió la carta'
    },
    {
      id: '2',
      title: 'Signos de puntuación',
      prompt: 'Agrega la coma correctamente: "Pedro María y José fueron al parque". Escribe la versión correcta.',
      type: 'text',
      answerText: 'Pedro, María y José fueron al parque'
    }
  ],
  calculo: [
    {
      id: '1',
      title: 'Suma y resta',
      prompt: 'Calcula: 48 + 27 − 15 = ?',
      type: 'text',
      numeric: true,
      answerText: '60'
    },
    {
      id: '2',
      title: 'Multiplicación',
      prompt: 'Calcula: 8 × 7 = ?',
      type: 'text',
      numeric: true,
      answerText: '56'
    }
  ]
};

// Local storage helpers
const LS_KEY = 'educa_site_progress_v1';
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {};
  } catch { return {}; }
}
function saveProgress(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}
function markCompleted(course, area, activityId, correct) {
  const data = loadProgress();
  data[course] = data[course] || {};
  data[course][area] = data[course][area] || {};
  data[course][area][activityId] = data[course][area][activityId] || {};
  data[course][area][activityId].completed = true;
  data[course][area][activityId].correct = !!correct;
  saveProgress(data);
}
function saveRating(course, area, activityId, rating) {
  const data = loadProgress();
  data[course] = data[course] || {};
  data[course][area] = data[course][area] || {};
  data[course][area][activityId] = data[course][area][activityId] || {};
  data[course][area][activityId].rating = rating;
  saveProgress(data);
}

// Routing
function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  if (!hash) return renderHome();
  const parts = hash.split('/'); // curso/3/area/lectura/act/1
  if (parts[0] === 'curso' && parts[2] === 'area') {
    const course = parseInt(parts[1], 10);
    const area = parts[3];
    if (parts[4] === 'act' && parts[5]) {
      return renderActivity(course, area, parts[5]);
    }
    return renderArea(course, area);
  }
  if (parts[0] === 'curso' && parts[1]) {
    return renderCourse(parseInt(parts[1], 10));
  }
  return renderHome();
}

function renderHome() {
  app.innerHTML = `
    <div>
      <p class="breadcrumbs">Inicio</p>
      <h2 class="section-title">Elige un curso</h2>
      <div class="grid">
        ${COURSES.map(c => `
          <a class="card" href="#/curso/${c}">
            <h3>${c}° Básico</h3>
            <p>Actividades por áreas: Lectura, Escritura y Cálculo.</p>
            <span class="pill">Entrar</span>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCourse(course) {
  if (!COURSES.includes(course)) return renderHome();
  app.innerHTML = `
    <div>
      <p class="breadcrumbs"><a href="#">Inicio</a> · ${course}° Básico</p>
      <h2 class="section-title">Áreas del curso</h2>
      <div class="grid">
        ${AREAS.map(a => `
          <a class="card" href="#/curso/${course}/area/${a.id}">
            <h3>${a.name}</h3>
            <p>2 actividades autoevaluables.</p>
            <span class="pill">${course}° Básico</span>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

function renderArea(course, area) {
  const areaMeta = AREAS.find(a => a.id === area);
  if (!areaMeta) return renderCourse(course);
  const list = ACTIVITIES[area];
  app.innerHTML = `
    <div>
      <p class="breadcrumbs"><a href="#">Inicio</a> · <a href="#/curso/${course}">${course}°</a> · ${areaMeta.name}</p>
      <h2 class="section-title">${areaMeta.name} — ${course}° Básico</h2>
      <div class="grid">
        ${list.map((act, idx) => {
          const prog = ((loadProgress()[course]||{})[area]||{})[act.id]||{};
          const status = prog.completed ? (prog.correct ? '✅ Correcta' : '🟡 Completa') : '⏳ Pendiente';
          return `
            <a class="card" href="#/curso/${course}/area/${area}/act/${act.id}">
              <h3>Actividad ${idx+1}: ${act.title}</h3>
              <p>${act.prompt.slice(0, 80)}...</p>
              <span class="pill">${status}</span>
            </a>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderActivity(course, area, activityId) {
  const areaMeta = AREAS.find(a => a.id === area);
  const list = ACTIVITIES[area] || [];
  const act = list.find(a => a.id === activityId);
  if (!act) return renderArea(course, area);

  const prog = ((loadProgress()[course]||{})[area]||{})[activityId]||{};
  const rating = prog.rating || 0;

  let body = '';
  if (act.type === 'choice') {
    body = `
      <div class="options">
        ${act.options.map((opt, i) => `
          <label><input type="radio" name="q" value="${i}"> <span>${opt}</span></label>
        `).join('')}
      </div>
    `;
  } else if (act.type === 'text') {
    body = `
      <input id="textAnswer" class="btn-input" placeholder="Escribe tu respuesta" style="width:100%; padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.03); color: var(--text);" />
    `;
  }

  app.innerHTML = `
    <div>
      <p class="breadcrumbs">
        <a href="#">Inicio</a> · <a href="#/curso/${course}">${course}°</a> ·
        <a href="#/curso/${course}/area/${area}">${areaMeta.name}</a> · Actividad ${activityId}
      </p>
      <div class="activity">
        <h2>${act.title}</h2>
        <div class="question">
          <p>${act.prompt}</p>
          ${body}
        </div>
        <div>
          <button id="checkBtn" class="btn">Revisar</button>
          <a class="btn secondary" href="#/curso/${course}/area/${area}">Volver</a>
        </div>
        <div id="feedback" class="feedback"></div>
        <div id="survey" class="survey" style="display:none;">
          <p>¿Qué te pareció esta actividad? Califícala:</p>
          <div id="starMount"></div>
          <button id="saveRating" class="btn" disabled>Enviar valoración</button>
        </div>
      </div>
    </div>
  `;

  // Check answer handler
  document.getElementById('checkBtn').addEventListener('click', () => {
    let correct = false;
    if (act.type === 'choice') {
      const sel = app.querySelector('input[name="q"]:checked');
      if (!sel) { setFeedback('Selecciona una opción.'); return; }
      correct = parseInt(sel.value, 10) === act.answer;
    } else {
      const txt = (document.getElementById('textAnswer').value || '').trim();
      if (!txt) { setFeedback('Escribe tu respuesta.'); return; }
      if (act.numeric) {
        correct = Number(txt.replace(',', '.')) == Number(act.answerText);
      } else {
        correct = normalize(txt) === normalize(act.answerText);
      }
    }
    markCompleted(course, area, activityId, correct);
    setFeedback(correct ? '¡Muy bien! ✅ Respuesta correcta.' : 'Respuesta registrada. Revisa y vuelve a intentarlo si quieres.');
    // show survey
    document.getElementById('survey').style.display = 'block';
    mountStars('starMount', rating || 0, (value) => {
      tempRating = value;
      document.getElementById('saveRating').disabled = !value;
    });
  });

  let tempRating = 0;
  document.getElementById('saveRating').addEventListener('click', () => {
    const val = tempRating || rating;
    if (!val) return;
    saveRating(course, area, activityId, val);
    setFeedback('¡Gracias por tu valoración! ⭐');
    document.getElementById('saveRating').disabled = true;
  });

  function setFeedback(msg) {
    document.getElementById('feedback').textContent = msg;
  }
}

function normalize(s) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().replace(/\s+/g,' ').trim();
}

// Stars component
function mountStars(elementId, initial = 0, onChange = ()=>{}) {
  const host = document.getElementById(elementId);
  host.innerHTML = '';
  const tpl = document.getElementById('star-template');
  const node = tpl.content.cloneNode(true);
  host.appendChild(node);
  const stars = Array.from(host.querySelectorAll('.star'));
  function paint(n) {
    stars.forEach((el, i) => el.classList.toggle('active', i < n));
  }
  paint(initial);
  stars.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = Number(btn.dataset.value);
      paint(val);
      onChange(val);
    });
  });
}

// Progress dialog
progressBtn.addEventListener('click', () => {
  const data = loadProgress();
  const container = document.getElementById('progressContent');
  if (!Object.keys(data).length) {
    container.innerHTML = '<p>No hay progreso todavía.</p>';
  } else {
    let html = '';
    for (const course of Object.keys(data).sort()) {
      html += `<h4>${course}° Básico</h4><ul>`;
      for (const area of Object.keys(data[course])) {
        const acts = data[course][area];
        const total = Object.keys(acts).length;
        const completed = Object.values(acts).filter(a => a.completed).length;
        html += `<li>${capitalize(area)}: ${completed}/2 actividades completadas.</li>`;
      }
      html += '</ul>';
    }
    container.innerHTML = html;
  }
  progressDialog.showModal();
});

document.getElementById('resetProgress').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem(LS_KEY);
  document.getElementById('progressContent').innerHTML = '<p>Progreso borrado.</p>';
});

homeLink.addEventListener('click', (e) => {
  e.preventDefault();
  location.hash = '';
  route();
});

function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
