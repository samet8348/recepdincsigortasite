// Site-wide theme selector. Light is the first-visit default; visitor preference persists across pages.
(function initThemeSelector(){
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');
  const getSavedTheme = () => { try { return localStorage.getItem('recepDincTheme'); } catch (error) { return null; } };
  const initialTheme = getSavedTheme() === 'dark' ? 'dark' : 'light';
  root.setAttribute('data-theme', initialTheme);
  function applyTheme(theme, save = true) {
    root.setAttribute('data-theme', theme);
    if (save) { try { localStorage.setItem('recepDincTheme', theme); } catch (error) { /* Continue when storage is unavailable. */ } }
    const isDark = theme === 'dark';
    document.querySelectorAll('.brand:not(.brand-footer) .brand-logo').forEach(img => {
      const target = isDark ? img.getAttribute('data-logo-dark') : img.getAttribute('data-logo-light');
      if (target && img.getAttribute('src') !== target) img.setAttribute('src', target);
    });
    if (button) {
      const icon = button.querySelector('.theme-toggle-icon');
      const label = button.querySelector('.theme-toggle-label');
      if (icon) icon.textContent = isDark ? '☼' : '☾';
      if (label) label.textContent = isDark ? 'Açık tema' : 'Koyu tema';
      button.setAttribute('aria-label', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
      button.setAttribute('aria-pressed', String(isDark));
      button.title = isDark ? 'Açık temaya geç' : 'Koyu temaya geç';
    }
  }
  applyTheme(initialTheme, false);
  if (button) button.addEventListener('click', () => applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
})();

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
    showToast('WhatsApp bağlantısı yapılandırılamadı. Lütfen bizi 0533 634 44 66 numarasından arayın.');
    return false;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  // This function is called directly from a user click/submit. Open in a new tab where possible.
  let popup = null;
  try { popup = window.open(url, '_blank'); } catch (error) { popup = null; }
  if (popup) {
    try { popup.opener = null; } catch (error) { /* Some browsers protect this property. */ }
    return true;
  }
  // If the browser blocks popups, keep the request usable by navigating this tab instead.
  window.location.assign(url);
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
      setFeedback('WhatsApp açılıyor. Talebinizi iletmek için WhatsApp ekranında Gönder tuşuna basın.', 'success');
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


const quickWhatsAppRequest = document.getElementById('quickWhatsAppRequest');
if (quickWhatsAppRequest && quoteForm) {
  quickWhatsAppRequest.addEventListener('click', () => {
    const fullName = quoteForm.elements.fullName.value.trim();
    const phone = quoteForm.elements.phone.value.trim();
    const branch = quoteForm.elements.branch.value;
    const note = quoteForm.elements.note.value.trim();
    const consent = quoteForm.elements.consent.checked;
    const includesPersonalData = Boolean(fullName || phone || note);

    // Don't put personally entered details into WhatsApp unless the visitor has checked the consent box.
    if (includesPersonalData && !consent) {
      setFeedback('Yazdığınız kişisel bilgileri WhatsApp mesajına eklemek için iletişim onayını işaretleyin.', 'error');
      quoteForm.elements.consent.focus();
      return;
    }

    const hasDetails = Boolean(fullName || phone || branch || note);
    const message = hasDetails ? [
      'Merhaba Recep Dinç Sigorta, sigorta talebimi iletmek istiyorum.',
      '',
      fullName ? `Ad Soyad: ${fullName}` : '',
      phone ? `Telefon: ${phone}` : '',
      branch ? `Sigorta Türü: ${branch}` : '',
      note ? `Talep Detayım: ${note}` : ''
    ].filter(Boolean).join('\n') :
      'Merhaba Recep Dinç Sigorta, sigorta ihtiyacım hakkında bilgi almak ve teklif talebimi iletmek istiyorum. Bana yardımcı olabilir misiniz?';

    if (openWhatsApp(message)) {
      setFeedback('WhatsApp açılıyor. Talebinizin iletilmesi için WhatsApp ekranında Gönder tuşuna basın.', 'success');
    }
  });
}

const footerWhatsapp = document.getElementById('footerWhatsapp');
if (footerWhatsapp) {
  footerWhatsapp.addEventListener('click', () => {
    openWhatsApp('Merhaba Recep Dinç Sigorta, sigorta seçenekleri hakkında bilgi almak istiyorum.');
  });
}
