// ─── CONFIGURATION EMAILJS ───────────────────────────────────────────────────
// Remplacez ces 3 valeurs après avoir créé votre compte sur emailjs.com
const EMAILJS_PUBLIC_KEY  = "VOTRE_PUBLIC_KEY";   // Onglet Account > Public Key
const EMAILJS_SERVICE_ID  = "VOTRE_SERVICE_ID";   // Onglet Email Services > Service ID
const EMAILJS_TEMPLATE_ID = "VOTRE_TEMPLATE_ID";  // Onglet Email Templates > Template ID
// ─────────────────────────────────────────────────────────────────────────────

emailjs.init(EMAILJS_PUBLIC_KEY);

// Date minimum = aujourd'hui (pas de rendez-vous dans le passé)
const dateInput = document.querySelector('input[name="date"]');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// Gestion du formulaire de rendez-vous
const form = document.getElementById('rdv-form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btnText    = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const btnSubmit  = document.getElementById('btn-submit');
    const success    = document.getElementById('form-success');
    const error      = document.getElementById('form-error');

    // État chargement
    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline';
    btnSubmit.disabled       = true;
    success.style.display    = 'none';
    error.style.display      = 'none';

    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      .then(() => {
        success.style.display = 'block';
        form.reset();
        // Réinitialiser la date min après reset
        if (dateInput) {
          dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
        }
      })
      .catch(() => {
        error.style.display = 'block';
      })
      .finally(() => {
        btnText.style.display    = 'inline';
        btnLoading.style.display = 'none';
        btnSubmit.disabled       = false;
      });
  });
}

// Navigation : surlignage du lien actif au scroll
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// Scroll fluide sur les liens de navigation
navLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
