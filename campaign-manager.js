/* Browser-based announcement editor for a static site. Export duyurular.json to publish. */
(function(){
  const FORM = document.getElementById('announcementForm');
  if (!FORM) return;
  const STORE = 'recepDincCampaignDraft';
  const listNode = document.getElementById('managerList');
  const notice = document.getElementById('managerNotice');
  const imageUpload = document.getElementById('imageUpload');
  const imagePreviewWrap = document.getElementById('imagePreviewWrap');
  const imagePreview = document.getElementById('imagePreview');
  const imagePreviewLabel = document.getElementById('imagePreviewLabel');
  let items = [];
  const val = name => String(FORM.elements[name]?.value || '').trim();
  const field = name => FORM.elements[name];
  const escape = value => String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const unpack = data => Array.isArray(data) ? data : (data && Array.isArray(data.announcements) ? data.announcements : null);
  // Remove legacy code/coupon fields from older drafts or JSON files.
  function normalizeItem(item) {
    const clean = { ...item };
    delete clean.promoCode; delete clean.discountCode; delete clean.couponCode;
    return clean;
  }
  function showNotice(message, kind='warning') { notice.textContent = message; notice.className = `manager-notice ${kind}`; }
  function saveDraft() {
    try {
      localStorage.setItem(STORE, JSON.stringify(items.map(normalizeItem)));
      showNotice('Taslak bu tarayıcıya kaydedildi. Tüm ziyaretçilerin görmesi için “Yayın dosyasını indir” düğmesiyle duyurular.json dosyasını indirip hosting ana dizinine yükleyin.', 'success');
    } catch(e) {
      showNotice('Tarayıcı taslağı kaydedilemedi (depolama alanı dolmuş olabilir). Yayın dosyasını indirerek çalışmanıza devam edin.', 'warning');
    }
    renderList();
  }
  function resetImagePreview() {
    if (imagePreview) imagePreview.removeAttribute('src');
    if (imagePreviewWrap) imagePreviewWrap.hidden = true;
    if (imageUpload) imageUpload.value = '';
  }
  function setImagePreview(src, label='Seçilen görsel') {
    if (!src || !imagePreview || !imagePreviewWrap) { resetImagePreview(); return; }
    imagePreview.src = src;
    imagePreviewLabel.textContent = label;
    imagePreviewWrap.hidden = false;
  }
  function resetForm() {
    FORM.reset();
    field('id').value='';
    field('imageData').value='';
    field('published').checked=true;
    document.getElementById('formTitle').textContent='Yeni duyuru ekle';
    document.getElementById('saveAnnouncement').textContent='Taslağa kaydet';
    resetImagePreview();
  }
  function fillForm(item) {
    item = normalizeItem(item);
    field('id').value=item.id || '';
    field('title').value=item.title || '';
    field('type').value=item.type || 'Kampanya';
    field('startDate').value=item.startDate || '';
    field('endDate').value=item.endDate || '';
    field('summary').value=item.summary || '';
    field('body').value=item.body || '';
    field('published').checked=Boolean(item.published);
    field('imageData').value='';
    const imageSelect = field('image');
    if (item.image && item.image.startsWith('data:image/')) {
      imageSelect.value='';
      field('imageData').value=item.image;
      setImagePreview(item.image, 'Kampanyaya yüklenmiş görsel');
    } else {
      imageSelect.value=item.image || '';
      if (item.image) setImagePreview(item.image, 'Seçilen hazır görsel'); else resetImagePreview();
    }
    document.getElementById('formTitle').textContent='Duyuruyu düzenle';
    document.getElementById('saveAnnouncement').textContent='Değişiklikleri kaydet';
    FORM.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function renderList() {
    listNode.innerHTML='';
    if (!items.length) { const empty=document.createElement('div'); empty.className='manager-empty'; empty.textContent='Henüz duyuru eklenmedi. Yukarıdaki formdan ilk duyuruyu oluşturabilirsiniz.'; listNode.appendChild(empty); return; }
    items.forEach(item=>{
      item = normalizeItem(item);
      const row=document.createElement('article'); row.className='manager-item';
      if (item.image) { const img=document.createElement('img'); img.src=item.image; img.alt=''; img.loading='lazy'; row.appendChild(img); }
      const content=document.createElement('div'); content.className='manager-item-copy';
      const title=document.createElement('strong'); title.textContent=item.title || 'Başlıksız'; content.appendChild(title);
      const desc=document.createElement('p'); desc.textContent=item.summary || item.body || 'Açıklama eklenmedi.'; content.appendChild(desc);
      const meta=document.createElement('div'); meta.className='manager-item-meta';
      const type=document.createElement('span'); type.className='manager-chip'; type.textContent=item.type || 'Duyuru'; meta.appendChild(type);
      const status=document.createElement('span'); status.className='manager-chip'+(item.published?'':' status-off'); status.textContent=item.published?'Yayında işaretli':'Taslak'; meta.appendChild(status);
      const date=document.createElement('span'); date.className='manager-chip'; date.textContent=[item.startDate,item.endDate].filter(Boolean).join(' – ') || 'Tarih belirtilmedi'; meta.appendChild(date);
      content.appendChild(meta); row.appendChild(content);
      const actions=document.createElement('div'); actions.className='manager-item-actions';
      const edit=document.createElement('button'); edit.className='manager-button'; edit.type='button'; edit.textContent='Düzenle'; edit.addEventListener('click',()=>fillForm(item)); actions.appendChild(edit);
      const del=document.createElement('button'); del.className='manager-button manager-button-danger'; del.type='button'; del.textContent='Sil'; del.addEventListener('click',()=>{ if (confirm(`“${item.title}” duyurusu taslaktan silinsin mi?`)) { items=items.filter(x=>x.id!==item.id); saveDraft(); resetForm(); } }); actions.appendChild(del);
      row.appendChild(actions); listNode.appendChild(row);
    });
  }
  async function loadPublishedJson() { try { const r=await fetch(`duyurular.json?v=${Date.now()}`,{cache:'no-store'}); if(!r.ok)throw Error(); const data=unpack(await r.json()); if(!data)throw Error(); return data.map(normalizeItem); } catch(e) { return null; } }
  async function boot() {
    const published=await loadPublishedJson();
    if (published) items=published;
    else { try { const saved=unpack(JSON.parse(localStorage.getItem(STORE)||'null')); if(saved)items=saved.map(normalizeItem); else items=[]; } catch(e) { items=[]; } }
    try { localStorage.setItem(STORE,JSON.stringify(items)); } catch(e){}
    renderList();
  }
  // Compress uploaded campaign images so the exported JSON remains manageable.
  function optimizeImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) return reject(new Error('Lütfen geçerli bir görsel dosyası seçin.'));
      if (file.size > 12 * 1024 * 1024) return reject(new Error('Görsel 12 MB altında olmalı.'));
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Görsel dosyası okunamadı.'));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error('Görsel açılamadı.'));
        image.onload = () => {
          const maxW=1400, maxH=900, scale=Math.min(1,maxW/image.width,maxH/image.height);
          const canvas=document.createElement('canvas');
          canvas.width=Math.max(1,Math.round(image.width*scale)); canvas.height=Math.max(1,Math.round(image.height*scale));
          const ctx=canvas.getContext('2d');
          if (!ctx) return reject(new Error('Görsel işlenemedi.'));
          ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.drawImage(image,0,0,canvas.width,canvas.height);
          resolve(canvas.toDataURL('image/jpeg',0.78));
        };
        image.src=reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  if (imageUpload) imageUpload.addEventListener('change', async () => {
    const file=imageUpload.files && imageUpload.files[0]; if(!file)return;
    showNotice('Görsel hazırlanıyor…','warning');
    try {
      const data=await optimizeImage(file);
      field('imageData').value=data;
      field('image').value='';
      setImagePreview(data, file.name);
      showNotice('Görsel eklendi. Kaydettiğinizde duyuru dosyasına dahil edilecek.','success');
    } catch(error) { showNotice(error.message || 'Görsel eklenemedi.','warning'); imageUpload.value=''; }
  });
  const removeImageButton=document.getElementById('removeImage');
  if (removeImageButton) removeImageButton.addEventListener('click',()=>{ field('imageData').value=''; field('image').value=''; resetImagePreview(); });
  field('image').addEventListener('change',()=>{
    field('imageData').value='';
    const path=field('image').value;
    if(path) setImagePreview(path,'Seçilen hazır görsel'); else resetImagePreview();
  });
  FORM.addEventListener('submit',event=>{
    event.preventDefault();
    const start=val('startDate'), end=val('endDate');
    if(start && end && end < start) { showNotice('Bitiş tarihi başlangıç tarihinden önce olamaz.','warning'); field('endDate').focus(); return; }
    const existingId=field('id').value;
    const selectedImage=field('imageData').value || val('image');
    const item={id:existingId || (globalThis.crypto && crypto.randomUUID ? crypto.randomUUID() : `ann-${Date.now()}`), title:val('title'), type:val('type'), startDate:start, endDate:end, image:selectedImage, summary:val('summary'), body:val('body'), published:field('published').checked, createdAt:new Date().toISOString()};
    const idx=items.findIndex(x=>x.id===existingId);
    if(idx>=0) items[idx]=item; else items.unshift(item);
    saveDraft(); resetForm();
  });
  document.getElementById('clearForm').addEventListener('click',resetForm);
  document.getElementById('exportJson').addEventListener('click',()=>{
    const payload={updatedAt:new Date().toISOString(),announcements:items.map(normalizeItem)};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob); const link=document.createElement('a'); link.href=url; link.download='duyurular.json'; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    showNotice('duyurular.json indirildi. Duyuruları tüm ziyaretçilere açmak için dosyayı hosting dosya yöneticisinden web sitesinin ana dizinine yükleyin ve mevcut dosyanın üzerine yazın.','success');
  });
  document.getElementById('importJson').addEventListener('change',async ev=>{
    const file=ev.target.files && ev.target.files[0]; if(!file)return;
    try { const parsed=JSON.parse(await file.text()); const data=unpack(parsed); if(!data)throw Error('Dosyada duyurular listesi bulunamadı.'); items=data.map(normalizeItem); saveDraft(); resetForm(); showNotice('JSON dosyası içe aktarıldı ve taslak olarak kaydedildi. Yayın dosyasını indirip sunucuya yükleyebilirsiniz.','success'); }
    catch(e){ showNotice('Dosya okunamadı. Geçerli bir duyurular.json dosyası seçin.','warning'); }
    ev.target.value='';
  });
  boot();
})();
