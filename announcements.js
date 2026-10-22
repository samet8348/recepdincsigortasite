/* Public announcements: reads published items from duyurular.json on the live site. */
(function () {
  const DATA_URL = 'duyurular.json';
  const today = new Date(); today.setHours(0,0,0,0);

  function unpack(data) {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.announcements)) return data.announcements;
    return [];
  }
  function active(item) {
    if (item.published !== true && item.status !== 'published') return false;
    if (item.startDate) { const d = new Date(item.startDate + 'T00:00:00'); if (!Number.isNaN(d) && d > today) return false; }
    if (item.endDate) { const d = new Date(item.endDate + 'T23:59:59'); if (!Number.isNaN(d) && d < today) return false; }
    return Boolean(item.title && (item.summary || item.body));
  }
  function dateLabel(item) {
    const fmt = value => { if (!value) return ''; const d = new Date(value + 'T00:00:00'); return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('tr-TR',{day:'numeric',month:'short',year:'numeric'}); };
    const start = fmt(item.startDate), end = fmt(item.endDate);
    if (start && end) return `${start} – ${end}`;
    if (end) return `Son gün: ${end}`;
    if (start) return `${start} itibarıyla`;
    return item.type === 'Duyuru' ? 'Güncel duyuru' : 'Güncel bilgilendirme';
  }
  function element(tag, cls, content) { const node = document.createElement(tag); if (cls) node.className = cls; if (content !== undefined) node.textContent = content; return node; }
  function makeCard(item) {
    const card = element('article','announcement-card');
    const imageBox = element('div','announcement-image');
    if (item.image) {
      const image = document.createElement('img'); image.src = item.image; image.alt = item.title || 'Sigorta duyurusu'; image.loading = 'lazy'; imageBox.appendChild(image);
    } else {
      const fallback = element('div','announcement-image-fallback', item.type === 'İndirim' ? '%' : item.type === 'Kampanya' ? '✦' : 'i');
      imageBox.appendChild(fallback);
    }
    imageBox.appendChild(element('span','announcement-badge', item.type || 'Duyuru'));
    card.appendChild(imageBox);
    const content = element('div','announcement-content');
    content.appendChild(element('span','announcement-dates',dateLabel(item)));
    content.appendChild(element('h3','',item.title));
    content.appendChild(element('p','',item.summary || item.body || 'Detaylı bilgi için bize ulaşın.'));
    const msg = `Merhaba Recep Dinç Sigorta, “${item.title}” ${item.type || 'duyurusu'} hakkında bilgi almak istiyorum.`;
    const link = element('a','announcement-action','WhatsApp’tan bilgi alın');
    link.href = `https://wa.me/905336344466?text=${encodeURIComponent(msg)}`;
    link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.appendChild(element('span','', '↗'));
    content.appendChild(link);
    card.appendChild(content);
    return card;
  }
  async function loadItems() {
    try {
      const response = await fetch(`${DATA_URL}?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Duyuru dosyası bulunamadı');
      return unpack(await response.json()).filter(active).sort((a,b) => (b.startDate || b.createdAt || '').localeCompare(a.startDate || a.createdAt || ''));
    } catch (error) {
      return [];
    }
  }
  loadItems().then(items => {
    const homeSection = document.getElementById('homeAnnouncementsSection');
    const homeGrid = document.getElementById('homeAnnouncementsGrid');
    if (homeSection && homeGrid && items.length) {
      homeSection.hidden = false;
      items.slice(0,3).forEach(item => homeGrid.appendChild(makeCard(item)));
    }
    const pageGrid = document.getElementById('announcementPageGrid');
    const emptyState = document.getElementById('announcementEmpty');
    if (pageGrid) {
      if (items.length) {
        pageGrid.innerHTML = '';
        items.forEach(item => pageGrid.appendChild(makeCard(item)));
        if (emptyState) emptyState.hidden = true;
      } else if (emptyState) {
        emptyState.hidden = false;
      }
    }
  });
})();
