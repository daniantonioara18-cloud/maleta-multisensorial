const app = document.getElementById('app');

function renderHome(){
  app.innerHTML = `
    <h2>Elige un curso</h2>
    <div class="grid">
      <a href="#3" class="card">3° Básico</a>
      <a href="#4" class="card">4° Básico</a>
      <a href="#5" class="card">5° Básico</a>
      <a href="#6" class="card">6° Básico</a>
    </div>`;
}

window.addEventListener('hashchange', renderHome);
window.addEventListener('DOMContentLoaded', renderHome);
