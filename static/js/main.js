// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.section, .service-card, .about-card, .contact-item');
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== EMAILJS CONFIG =====
const EMAILJS_SERVICE_ID  = "service_bt1fm64";
const EMAILJS_TEMPLATE_ID = "template_rxgnmf5";
const EMAILJS_PUBLIC_KEY  = "78tk6PiAO3ZMcdCcn";

// ===== EMAILJS INIT =====
emailjs.init({
  publicKey: EMAILJS_PUBLIC_KEY
});

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea');

    const textInputs = form.querySelectorAll('input[type="text"]');

    const name = textInputs[0]?.value.trim() || '';
    const email = form.querySelector('input[type="email"]')?.value.trim() || '';
    const subject = textInputs[1]?.value.trim() || 'New Message from Website';
    const message = form.querySelector('textarea')?.value.trim() || '';

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    inputs.forEach(i => i.disabled = true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: name,
          email: email,
          title: subject,
          message: message,
          to_name: 'CLC Team',
          to_email: 'contact@cairologistics.net'
        }
      );

      btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = '#136b2d';

      showToast(
        'Your message has been sent successfully! We will get back to you soon.',
        'success'
      );

      form.reset();

      setTimeout(() => {
        btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
        btn.disabled = false;
        inputs.forEach(i => i.disabled = false);
      }, 3000);

    } catch (err) {
      console.error('[EmailJS Error]', err);

      btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed — Try Again';
      btn.style.background = '#8b0000';

      showToast(
        err?.text || err?.message || 'Failed to send message.',
        'error'
      );

      setTimeout(() => {
        btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        btn.style.background = '';
        btn.disabled = false;
        inputs.forEach(i => i.disabled = false);
      }, 4000);
    }
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const existing = document.querySelector('.clc-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'clc-toast';
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'times-circle'}"></i>
    <span>${message}</span>
  `;

  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    background: type === 'success' ? '#1a8c3c' : '#8b0000',
    color: '#fff',
    padding: '16px 24px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: '0.95rem',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    zIndex: '9999',
    maxWidth: '380px',
    animation: 'clcSlideIn 0.3s ease'
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'clcSlideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 6000);
}

// ===== TOAST KEYFRAMES =====
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  @keyframes clcSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes clcSlideOut {
    from { opacity: 1; transform: translateY(0); }
    to   { opacity: 0; transform: translateY(20px); }
  }
`;
document.head.appendChild(toastStyle);

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });

  navItems.forEach(a => {
    a.style.color =
      a.getAttribute('href') === '#' + current
        ? 'var(--green-light)'
        : '';
  });
});