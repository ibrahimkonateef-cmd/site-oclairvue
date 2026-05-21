// ─── CONFIGURATION EMAILJS ───────────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = "T8Ih9Y2Jyd3yX415T";
const EMAILJS_SERVICE_ID  = "service_7s591nk";
const EMAILJS_TEMPLATE_ID = "template_2navahk";

// ─── CONFIGURATION SUPABASE ──────────────────────────────────────────────────
// Project Settings > API  →  Project URL  +  anon public key
const SUPABASE_URL      = "VOTRE_SUPABASE_URL";   // ex: https://xxxx.supabase.co
const SUPABASE_ANON_KEY = "VOTRE_ANON_KEY";        // clé "anon public"
// ─────────────────────────────────────────────────────────────────────────────

emailjs.init(EMAILJS_PUBLIC_KEY);

// Date minimum = aujourd'hui
const dateInput = document.querySelector('input[name="date"]');
if (dateInput) {
  dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}

// Sauvegarde du rendez-vous dans Supabase
async function sauvegarderRendezVous(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rendez_vous`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      nom:      data.nom,
      telephone:data.telephone,
      email:    data.email,
      service:  data.service,
      date_rdv: data.date,
      creneau:  data.creneau,
      message:  data.message,
      statut:   'En attente'
    })
  });
  if (!res.ok) throw new Error(await res.text());
}

// Gestion du formulaire de rendez-vous
const form = document.getElementById('rdv-form');
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btnText    = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const btnSubmit  = document.getElementById('btn-submit');
    const success    = document.getElementById('form-success');
    const error      = document.getElementById('form-error');

    btnText.style.display    = 'none';
    btnLoading.style.display = 'inline';
    btnSubmit.disabled       = true;
    success.style.display    = 'none';
    error.style.display      = 'none';

    const data = {
      nom:      form.querySelector('[name="nom"]').value,
      telephone:form.querySelector('[name="telephone"]').value,
      email:    form.querySelector('[name="email"]').value,
      service:  form.querySelector('[name="service"]').value,
      date:     form.querySelector('[name="date"]').value,
      creneau:  form.querySelector('[name="creneau"]').value,
      message:  form.querySelector('[name="message"]').value,
    };

    try {
      // Sauvegarde BDD + email en parallèle
      await Promise.all([
        sauvegarderRendezVous(data),
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
      ]);
      success.style.display = 'block';
      form.reset();
      if (dateInput) dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    } catch (err) {
      console.error(err);
      error.style.display = 'block';
    } finally {
      btnText.style.display    = 'inline';
      btnLoading.style.display = 'none';
      btnSubmit.disabled       = false;
    }
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
