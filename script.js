/* İşletme WhatsApp numarası: 90 533 634 44 66 (ülke kodu dahil, boşluksuz). */
const WHATSAPP_NUMBER = "905336344466";

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const quoteForm = document.getElementById('quoteForm');
const formFeedback = document.getElementById('formFeedback');
const toast = document.getElementById('toast');
let toastTimer;

const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 5200);
}

function whatsappIsConfigured() {
  return /^90\d{10}$/.test(WHATSAPP_NUMBER) && !WHATSAPP_NUMBER.includes('X');
}

function openWhatsApp(message) {
  if (!whatsappIsConfigured()) {
    showToast('WhatsApp bağlantısını aktifleştirmek için script.js dosyasındaki WHATSAPP_NUMBER alanına işletme WhatsApp numaranızı 90 ile başlayacak şekilde yazın.');
    return false;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

function setFeedback(message, kind = '') {
  if (!formFeedback) return;
  formFeedback.textContent = message;
  formFeedback.className = `form-feedback ${kind}`.trim();
}

if (quoteForm) {
  // Dedicated product pages pass the selected insurance branch through ?branch=.
  const requestedBranch = new URLSearchParams(window.location.search).get('branch');
  if (requestedBranch) {
    const target = Array.from(quoteForm.elements.branch.options).find(item => item.text === requestedBranch || item.value === requestedBranch);
    if (target) quoteForm.elements.branch.value = target.value;
  }

  document.querySelectorAll('[data-branch]').forEach(link => {
    link.addEventListener('click', () => {
      const branch = link.getAttribute('data-branch');
      const branchSelect = quoteForm.elements.branch;
      const option = Array.from(branchSelect.options).find(item => item.text === branch || item.value === branch);
      if (option) branchSelect.value = option.value;
    });
  });

  quoteForm.addEventListener('submit', event => {
    event.preventDefault();
    setFeedback('');

    const fullName = quoteForm.elements.fullName.value.trim();
    const phone = quoteForm.elements.phone.value.trim();
    const branch = quoteForm.elements.branch.value;
    const note = quoteForm.elements.note.value.trim();
    const consent = quoteForm.elements.consent.checked;

    if (!fullName || !phone || !branch || !consent) {
      setFeedback('Lütfen yıldızlı alanları doldurun ve iletişim onayını işaretleyin.', 'error');
      return;
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setFeedback('Lütfen geçerli bir telefon numarası girin.', 'error');
      quoteForm.elements.phone.focus();
      return;
    }

    const message = [
      'Merhaba Recep Dinç Sigorta, teklif almak istiyorum.',
      '',
      `Ad Soyad: ${fullName}`,
      `Telefon: ${phone}`,
      `Sigorta Türü: ${branch}`,
      note ? `Not: ${note}` : ''
    ].filter(Boolean).join('\n');

    if (whatsappIsConfigured()) {
      setFeedback('WhatsApp mesajı yeni sekmede açılıyor. Gönderim işlemini WhatsApp üzerinden tamamlayın.', 'success');
      openWhatsApp(message);
    } else {
      setFeedback('Form hazır. WhatsApp ile göndermeyi açmak için site yöneticisinin script.js dosyasına işletme numarasını eklemesi gerekiyor.', 'error');
    }
  });
}

// Kartlardan ürün bilgisine gidildiğinde ilgili açıklamayı aynı sayfada aç.
document.querySelectorAll('a[href^="#detail-"]').forEach(link => {
  link.addEventListener('click', () => {
    const detail = document.querySelector(link.getAttribute('href'));
    if (detail && detail.tagName.toLowerCase() === 'details') detail.open = true;
  });
});

function openDetailFromHash() {
  if (!location.hash.startsWith('#detail-')) return;
  const detail = document.querySelector(location.hash);
  if (detail && detail.tagName.toLowerCase() === 'details') detail.open = true;
}
window.addEventListener('hashchange', openDetailFromHash);
openDetailFromHash();

const footerWhatsapp = document.getElementById('footerWhatsapp');
if (footerWhatsapp) {
  footerWhatsapp.addEventListener('click', () => {
    openWhatsApp('Merhaba Recep Dinç Sigorta, sigorta seçenekleri hakkında bilgi almak istiyorum.');
  });
}
