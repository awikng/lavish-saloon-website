const serviceGrid = document.getElementById('service-grid');
const serviceSelect = document.getElementById('service-select');
const bookingForm = document.getElementById('booking-form');
const successMessage = document.getElementById('success-message');
const successText = document.getElementById('success-text');
const bookAnotherButton = document.getElementById('book-another');
const themeToggle = document.getElementById('theme-toggle');
const openAdmin = document.getElementById('open-admin');
const closeAdmin = document.getElementById('close-admin');
const adminModal = document.getElementById('admin-modal');
const adminLoginView = document.getElementById('admin-login-view');
const adminDashboardView = document.getElementById('admin-dashboard-view');
const adminLoginForm = document.getElementById('admin-login-form');
const adminLoginMessage = document.getElementById('admin-login-message');
const passwordForm = document.getElementById('password-form');
const passwordMessage = document.getElementById('password-message');
const bookingsList = document.getElementById('bookings-list');
const bookingCount = document.getElementById('booking-count');
const serviceForm = document.getElementById('service-form');
const serviceList = document.getElementById('service-list');
const logoutAdmin = document.getElementById('logout-admin');
const year = document.getElementById('year');

const defaultServices = [
  { id: 1, title: 'Lavish Signature Deep Cleanse Facial', price: 65, duration: '45 mins', category: 'Facial', description: 'Customized deep cleansing and skin reset for a polished finish.' },
  { id: 2, title: '24K Gold Rejuvenating Facial', price: 90, duration: '60 mins', category: 'Facial', description: 'Luxury anti-aging treatment with gold infusion and peptide therapy.' },
  { id: 3, title: 'Executive Precision Haircut', price: 45, duration: '35 mins', category: 'Hair', description: 'Consultation-driven cut, fade, and premium styling.' },
  { id: 4, title: 'Hot Towel Beard Sculpture & Spa', price: 40, duration: '30 mins', category: 'Grooming', description: 'Beard shaping, steam, and hydration massage.' },
  { id: 5, title: 'The Lavish VIP Presidential Package', price: 150, duration: '105 mins', category: 'VIP Package', description: 'Full luxury treatment bundle designed for elevated comfort.' }
];

let services = JSON.parse(localStorage.getItem('lavishServices')) || defaultServices;
let bookings = JSON.parse(localStorage.getItem('lavishBookings')) || [];
let adminPasswordHash = localStorage.getItem('lavishAdminPasswordHash') || '';
let isAdminLoggedIn = sessionStorage.getItem('lavishAdminSession') === 'active';

async function hashPassword(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function ensureDefaultPassword() {
  if (!adminPasswordHash) {
    adminPasswordHash = await hashPassword('admin123');
    localStorage.setItem('lavishAdminPasswordHash', adminPasswordHash);
  }
}

function saveState() {
  localStorage.setItem('lavishServices', JSON.stringify(services));
  localStorage.setItem('lavishBookings', JSON.stringify(bookings));
  if (adminPasswordHash) {
    localStorage.setItem('lavishAdminPasswordHash', adminPasswordHash);
  }
}

function renderServices() {
  if (!serviceGrid) return;
  serviceGrid.innerHTML = '';
  serviceSelect.innerHTML = '<option value="">-- Select a service --</option>';

  services.forEach((service) => {
    const card = document.createElement('article');
    card.className = `service-card glass-panel ${service.category === 'VIP Package' ? 'featured' : ''}`;
    card.innerHTML = `
      <span class="badge">${service.category}</span>
      <div class="service-title-row">
        <h4>${service.title}</h4>
        <span class="price">$${service.price}</span>
      </div>
      <div class="service-meta">⏱ ${service.duration}</div>
      <p>${service.description}</p>
      <button class="btn btn-secondary full-width select-btn" data-service="${service.title}" type="button">Select Treatment</button>
    `;
    serviceGrid.appendChild(card);

    const option = document.createElement('option');
    option.value = service.title;
    option.textContent = `${service.title} ($${service.price})`;
    serviceSelect.appendChild(option);
  });

  document.querySelectorAll('.select-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-service');
      if (serviceSelect) serviceSelect.value = selected;
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderBookings() {
  if (!bookingsList) return;
  bookingsList.innerHTML = '';
  bookingCount.textContent = bookings.length;

  if (!bookings.length) {
    bookingsList.innerHTML = '<div class="stack-item"><p>No bookings yet.</p></div>';
    return;
  }

  bookings.forEach((booking) => {
    const item = document.createElement('div');
    item.className = 'stack-item';
    item.innerHTML = `<strong>${booking.name}</strong><p>${booking.service || 'Service'} • ${booking.date || 'Flexible date'} • ${booking.time || 'Flexible time'}</p>`;
    bookingsList.appendChild(item);
  });
}

function renderAdminServices() {
  if (!serviceList) return;
  serviceList.innerHTML = '';
  services.forEach((service) => {
    const item = document.createElement('div');
    item.className = 'stack-item';
    item.innerHTML = `<strong>${service.title}</strong><p>$${service.price} • ${service.duration} • ${service.category}</p>`;
    serviceList.appendChild(item);
  });
}

function setAdminView(isLoggedIn) {
  if (!adminLoginView || !adminDashboardView) return;
  adminLoginView.hidden = isLoggedIn;
  adminDashboardView.hidden = !isLoggedIn;
}

function openAdminPanel() {
  adminModal.classList.add('active');
  adminModal.setAttribute('aria-hidden', 'false');
  if (isAdminLoggedIn) {
    setAdminView(true);
    renderBookings();
    renderAdminServices();
  } else {
    setAdminView(false);
  }
}

function closeAdminPanel() {
  adminModal.classList.remove('active');
  adminModal.setAttribute('aria-hidden', 'true');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.textContent = isLight ? '☾' : '☀︎';
  });
}

if (openAdmin) openAdmin.addEventListener('click', openAdminPanel);
if (closeAdmin) closeAdmin.addEventListener('click', closeAdminPanel);
if (adminModal) adminModal.addEventListener('click', (event) => {
  if (event.target === adminModal) closeAdminPanel();
});

if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;
    await ensureDefaultPassword();
    const enteredHash = await hashPassword(password);
    if (username === 'admin' && enteredHash === adminPasswordHash) {
      isAdminLoggedIn = true;
      sessionStorage.setItem('lavishAdminSession', 'active');
      setAdminView(true);
      renderBookings();
      renderAdminServices();
      if (adminLoginMessage) adminLoginMessage.textContent = 'Welcome back, admin.';
    } else {
      if (adminLoginMessage) adminLoginMessage.textContent = 'Invalid credentials. Please try again.';
    }
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const current = document.getElementById('current-password').value;
    const next = document.getElementById('new-password').value;
    await ensureDefaultPassword();
    const currentHash = await hashPassword(current);
    if (currentHash !== adminPasswordHash) {
      passwordMessage.textContent = 'Current password is incorrect.';
      return;
    }
    if (!next || next.length < 4) {
      passwordMessage.textContent = 'New password must be at least 4 characters.';
      return;
    }
    adminPasswordHash = await hashPassword(next);
    saveState();
    passwordMessage.textContent = 'Password updated securely in your browser.';
    passwordForm.reset();
  });
}

if (serviceForm) {
  serviceForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = Number(document.getElementById('service-id').value || 0);
    const service = {
      id: id || Date.now(),
      title: document.getElementById('service-title').value.trim(),
      price: Number(document.getElementById('service-price').value),
      duration: document.getElementById('service-duration').value.trim(),
      category: document.getElementById('service-category').value.trim(),
      description: document.getElementById('service-description').value.trim()
    };
    if (!service.title || !service.description) return;
    const existingIndex = services.findIndex((entry) => entry.id === service.id);
    if (existingIndex >= 0) services[existingIndex] = service;
    else services.unshift(service);
    saveState();
    renderServices();
    renderAdminServices();
    serviceForm.reset();
  });
}

if (logoutAdmin) {
  logoutAdmin.addEventListener('click', () => {
    isAdminLoggedIn = false;
    sessionStorage.removeItem('lavishAdminSession');
    setAdminView(false);
  });
}

if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const service = serviceSelect.value;
    const date = document.getElementById('preferred-date').value;
    const time = document.getElementById('preferred-time').value;

    if (!name || !phone) return;

    bookings.unshift({ name, phone, service, date, time });
    saveState();
    renderBookings();
    successText.innerHTML = `Thank you <strong>${name}</strong>. We have reserved your request for <strong>${service || 'your service'}</strong> on <strong>${date || 'your date'}</strong> at <strong>${time || 'your time'}</strong>.`;
    bookingForm.style.display = 'none';
    successMessage.classList.add('active');
  });
}

if (bookAnotherButton) {
  bookAnotherButton.addEventListener('click', () => {
    bookingForm.reset();
    bookingForm.style.display = 'flex';
    successMessage.classList.remove('active');
    serviceSelect.value = '';
  });
}

if (year) year.textContent = new Date().getFullYear();

// Smooth section reveal animations for a premium, polished experience.
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
reveals.forEach((element) => observer.observe(element));

// Load services, bookings, and admin state from localStorage on startup.
renderServices();
renderBookings();
renderAdminServices();
setAdminView(isAdminLoggedIn);
