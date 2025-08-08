function includeHTML() {
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(el => {
    const file = el.getAttribute('data-include');
    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
        return res.text();
      })
      .then(data => {
        el.innerHTML = data;
      })
      .catch(err => {
        console.error('Include error:', err);
        el.innerHTML = `<div style="color:red;">Error loading ${file}</div>`;
      });
  });
}

document.addEventListener("DOMContentLoaded", includeHTML);
