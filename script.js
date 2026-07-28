const categoryButtons = document.querySelectorAll('.category-btn');
const serviceCards = document.querySelectorAll('.service-card');
const selectButtons = document.querySelectorAll('.select-btn');
const serviceSelect = document.getElementById('service-select');
const bookingForm = document.getElementById('booking-form');
const successMessage = document.getElementById('success-message');
const successText = document.getElementById('success-text');
const bookAnotherButton = document.getElementById('book-another');
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.textContent = isLight ? '☾' : '☀︎';
  });
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    categoryButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const category = button.getAttribute('data-category');

    serviceCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      const shouldShow = category === 'All' || cardCategory === category;
      card.style.display = shouldShow ? 'flex' : 'none';
    });
  });
});

selectButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedService = button.getAttribute('data-service');

    selectButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    if (serviceSelect && selectedService) {
      serviceSelect.value = selectedService;
    }

    document.querySelector('#booking').scrollIntoView({ behavior: 'smooth' });
  });
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('client-name').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const service = serviceSelect.value;
  const date = document.getElementById('preferred-date').value;
  const time = document.getElementById('preferred-time').value;

  if (!name || !phone) return;

  successText.innerHTML =
    'Thank you <strong>' +
    name +
    '</strong>. We have reserved your request for <strong>' +
    (service || 'your service') +
    '</strong> on <strong>' +
    (date || 'your date') +
    '</strong> at <strong>' +
    (time || 'your time') +
    '</strong>.';

  bookingForm.style.display = 'none';
  successMessage.classList.add('active');
});

bookAnotherButton.addEventListener('click', () => {
  bookingForm.reset();
  bookingForm.style.display = 'flex';
  successMessage.classList.remove('active');
  selectButtons.forEach((btn) => btn.classList.remove('active'));
  serviceSelect.value = '';
});
