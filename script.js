(function(){
  "use strict";

  /* ---------------- Supabase setup ---------------- */
  const SUPABASE_URL = "https://qbsgrrqgvpbnmhizzipm.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFic2dycnFndnBibm1oaXp6aXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0NTI5MzQsImV4cCI6MjEwNTAyODkzNH0.u3kiYvMWKEvvtii_VTgkwtgWP2cBDDyOweo5lAvP3fk";
  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const TAGS = ["Tenang","Buat Kerja","Estetik","Indoor","Rame","Outdoor","Semi Outdoor","Open Space","Garden Cafe","Rooftop Cafe","Pet Friendly","Not Pet Friendly","Live Music","Budget Friendly","Halal","Non Halal","VIP Room","AC Room","No Smoke","Smoking Area","WFC Spot"];
  const SWATCHES = [
    ["#8FB39C","#5F7E6C"], // sage
    ["#8FB6C2","#5C8A96"], // teal
    ["#93A6C9","#6B80A8"], // blue
    ["#A9B689","#7C8E5C"], // moss
    ["#B3A794","#8A7B63"], // stone
    ["#7FB0A0","#4A7E6C"]  // deep mint
  ];

  function cid(){ return 'c' + Math.random().toString(36).slice(2,10); }

  /* ---------------- DB <-> app data mapping ---------------- */
  function dbToCafe(row){
    return {
      id: row.id,
      name: row.name,
      location: row.location,
      rating: row.rating || 0,
      reviewCount: row.review_count || 0,
      price: row.price || '',
      openTime: row.open_time || '',
      closeTime: row.close_time || '',
      swatch: row.swatch || 0,
      photo: row.photo || '',
      tags: Array.isArray(row.tags) ? row.tags : [],
      notes: row.notes || ''
    };
  }

  function cafeToDb(c){
    return {
      id: c.id,
      name: c.name,
      location: c.location,
      rating: c.rating,
      review_count: c.reviewCount,
      price: c.price,
      open_time: c.openTime || null,
      close_time: c.closeTime || null,
      swatch: c.swatch,
      photo: c.photo,
      tags: c.tags,
      notes: c.notes
    };
  }

  async function fetchCafes(){
    const { data, error } = await db.from('cafes').select('*').order('created_at', { ascending:false });
    if(error){ console.error('Gagal ambil data dari Supabase:', error); return []; }
    return data.map(dbToCafe);
  }

  async function insertCafe(cafe){
    const { data, error } = await db.from('cafes').insert([cafeToDb(cafe)]).select();
    if(error){ console.error('Gagal simpan cafe:', error); throw error; }
    return dbToCafe(data[0]);
  }

  async function updateCafeDB(cafe){
    const { error } = await db.from('cafes').update(cafeToDb(cafe)).eq('id', cafe.id);
    if(error){ console.error('Gagal update cafe:', error); throw error; }
  }

  async function deleteCafeDB(id){
    const { error } = await db.from('cafes').delete().eq('id', id);
    if(error){ console.error('Gagal hapus cafe:', error); throw error; }
  }

  let cafes = [];

  let editingId = null;
  let deletingId = null;
  let selectedRating = 0;
  let selectedSwatch = 0;
  let selectedTags = [];

  const grid = document.getElementById('grid');
  const emptyState = document.getElementById('empty');
  const search = document.getElementById('search');
  const filterTag = document.getElementById('filterTag');
  const sortBy = document.getElementById('sortBy');

  TAGS.forEach(t=>{
    const o = document.createElement('option');
    o.value = t; o.textContent = t;
    filterTag.appendChild(o);
  });

  function starsSVG(filled){
    return `<svg viewBox="0 0 24 24" fill="${filled? 'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="m12 2 2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.3l7.1-.7L12 2Z"/></svg>`;
  }

  function clockSVG(){
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>`;
  }

  function moneySVG(){
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9v0M17.5 15v0"/></svg>`;
  }

  function isOpenNow(open, close, now){
    if(!open || !close) return null;
    const [oh, om] = open.split(':').map(Number);
    const [ch, cm] = close.split(':').map(Number);
    if(Number.isNaN(oh) || Number.isNaN(ch)) return null;
    const openM = oh*60 + om;
    const closeM = ch*60 + cm;
    const nowM = now.getHours()*60 + now.getMinutes();
    if(openM === closeM) return true;
    if(openM < closeM) return nowM >= openM && nowM < closeM;
    return nowM >= openM || nowM < closeM;
  }

  function updateOpenStatuses(){
    document.querySelectorAll('.hours-badge').forEach(el=>{
      const open = el.dataset.open;
      const close = el.dataset.close;
      const statusEl = el.querySelector('.status-text');
      if(!statusEl) return;
      const state = isOpenNow(open, close, new Date());
      if(state === null){
        statusEl.textContent = '';
        el.classList.remove('is-open','is-closed');
      } else if(state){
        statusEl.textContent = 'Buka';
        el.classList.add('is-open');
        el.classList.remove('is-closed');
      } else {
        statusEl.textContent = 'Tutup';
        el.classList.add('is-closed');
        el.classList.remove('is-open');
      }
    });
  }

  setInterval(updateOpenStatuses, 30000);

  function renderStars(rating){
    let html = '<span class="stars">';
    for(let i=1;i<=5;i++){
      html += `<span class="${i<=rating?'star-fill':'star-empty'}">${starsSVG(i<=rating)}</span>`;
    }
    return html + '</span>';
  }

  function updateStats(){
    document.getElementById('statTotal').textContent = cafes.length;
    const avg = cafes.length ? (cafes.reduce((s,c)=>s+c.rating,0)/cafes.length).toFixed(1) : '0';
    document.getElementById('statAvg').textContent = avg;
    const tagCount = {};
    cafes.forEach(c=>c.tags.forEach(t=> tagCount[t] = (tagCount[t]||0)+1));
    const top = Object.entries(tagCount).sort((a,b)=>b[1]-a[1])[0];
    document.getElementById('statTop').textContent = top ? top[0] : '–';
  }

  function render(){
    const q = search.value.trim().toLowerCase();
    const tagF = filterTag.value;
    const sort = sortBy.value;

    let list = cafes.filter(c=>{
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q);
      const matchTag = !tagF || c.tags.includes(tagF);
      return matchQ && matchTag;
    });

    if(sort === 'rating') list.sort((a,b)=> b.rating - a.rating);
    else if(sort === 'name') list.sort((a,b)=> a.name.localeCompare(b.name));
    // default: urutan sesuai penambahan (cafe terbaru ada di paling atas)

    grid.innerHTML = '';
    emptyState.classList.toggle('hidden', list.length !== 0);

    list.forEach((c, idx)=>{
      const [c1,c2] = SWATCHES[c.swatch % SWATCHES.length];
      const card = document.createElement('article');
      card.className = 'card';
      card.style.animationDelay = (idx * 45) + 'ms';
      card.dataset.id = c.id;
      const bg = c.photo
        ? `background:#DDE5DF url('${escapeAttr(c.photo)}') center/cover no-repeat;`
        : `background:linear-gradient(135deg, ${c1}, ${c2});`;
      card.innerHTML = `
        <div class="swatch" style="${bg}">
          <div class="card-actions">
            <button class="icon-btn" data-action="edit" title="Edit" aria-label="Edit ${escapeHtml(c.name)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>
            </button>
            <button class="icon-btn danger" data-action="delete" title="Hapus" aria-label="Hapus ${escapeHtml(c.name)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>
            </button>
          </div>
          ${c.photo ? '' : `<span class="initial">${escapeHtml(c.name.charAt(0).toUpperCase())}</span>`}
        </div>
        <div class="card-body">
          <h3>${escapeHtml(c.name)}</h3>
          <div class="loc-row">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/></svg>
            ${escapeHtml(c.location)}
          </div>
          <div class="rating-price-row">
            <span class="rating-group">
              ${renderStars(c.rating)}
              ${c.reviewCount ? `<span class="review-count">(${escapeHtml(String(c.reviewCount))} ulasan)</span>` : ''}
            </span>
            <span class="hours-badge" data-open="${c.openTime||''}" data-close="${c.closeTime||''}">
              ${clockSVG()}
              <span class="hours-text">${c.openTime && c.closeTime ? `${c.openTime}–${c.closeTime}` : 'Jam belum diisi'}</span>
              <span class="status-text"></span>
            </span>
          </div>
          ${c.price ? `<div class="price-row"><span class="price-tag">${moneySVG()}${escapeHtml(c.price)}</span></div>` : ''}
          <div class="tag-row">${c.tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
          ${c.notes ? `<p class="notes">${escapeHtml(c.notes)}</p>` : ''}
        </div>
      `;
      grid.appendChild(card);
    });

    updateStats();
    updateOpenStatuses();
  }

  function escapeHtml(str){
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function escapeAttr(str){
    return String(str).replace(/'/g, "%27").replace(/"/g, "%22");
  }

  grid.addEventListener('click', (e)=>{
    const btn = e.target.closest('.icon-btn');
    if(!btn) return;
    const card = e.target.closest('.card');
    const id = card.dataset.id;
    if(btn.dataset.action === 'edit') openForm(id);
    if(btn.dataset.action === 'delete') openConfirm(id);
  });

  search.addEventListener('input', render);
  filterTag.addEventListener('change', render);
  sortBy.addEventListener('change', render);

  /* ---------------- Form modal ---------------- */
  const formBackdrop = document.getElementById('formBackdrop');
  const cafeForm = document.getElementById('cafeForm');
  const starPicker = document.getElementById('starPicker');
  const swatchPicker = document.getElementById('swatchPicker');
  const tagPicker = document.getElementById('tagPicker');

  for(let i=1;i<=5;i++){
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.val = i;
    b.innerHTML = starsSVG(true);
    b.addEventListener('click', ()=>{ selectedRating = i; paintStars(); });
    starPicker.appendChild(b);
  }
  function paintStars(){
    [...starPicker.children].forEach((b,i)=> b.classList.toggle('active', i < selectedRating));
  }

  SWATCHES.forEach((pair, i)=>{
    const dot = document.createElement('div');
    dot.className = 'swatch-dot';
    dot.style.background = `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
    dot.addEventListener('click', ()=>{ selectedSwatch = i; paintSwatches(); });
    dot.dataset.idx = i;
    swatchPicker.appendChild(dot);
  });
  function paintSwatches(){
    [...swatchPicker.children].forEach((d,i)=> d.classList.toggle('selected', i === selectedSwatch));
  }

  TAGS.forEach(t=>{
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'tag-choice';
    chip.textContent = t;
    chip.addEventListener('click', ()=>{
      if(selectedTags.includes(t)) selectedTags = selectedTags.filter(x=>x!==t);
      else selectedTags.push(t);
      paintTags();
    });
    tagPicker.appendChild(chip);
  });
  function paintTags(){
    [...tagPicker.children].forEach(chip=> chip.classList.toggle('selected', selectedTags.includes(chip.textContent)));
  }

  function openForm(id){
    editingId = id || null;
    const c = id ? cafes.find(x=>x.id===id) : null;
    document.getElementById('formTitle').textContent = c ? 'Edit cafe' : 'Tambah cafe';
    document.getElementById('formSub').textContent = c ? 'Perbarui detail kunjungan kamu.' : 'Simpan detail tempat ngopi barumu.';
    document.getElementById('submitForm').textContent = c ? 'Simpan perubahan' : 'Simpan cafe';

    document.getElementById('fName').value = c ? c.name : '';
    document.getElementById('fLocation').value = c ? c.location : '';
    document.getElementById('fPhoto').value = c ? (c.photo || '') : '';
    document.getElementById('fReviewCount').value = c && c.reviewCount ? c.reviewCount : '';
    document.getElementById('fPrice').value = c ? (c.price || '') : '';
    document.getElementById('fOpenTime').value = c ? (c.openTime || '') : '';
    document.getElementById('fCloseTime').value = c ? (c.closeTime || '') : '';
    document.getElementById('fNotes').value = c ? c.notes : '';
    selectedRating = c ? c.rating : 0;
    selectedSwatch = c ? c.swatch : Math.floor(Math.random()*SWATCHES.length);
    selectedTags = c ? [...c.tags] : [];
    paintStars(); paintSwatches(); paintTags();

    formBackdrop.classList.remove('hidden');
    setTimeout(()=> document.getElementById('fName').focus(), 60);
  }

  function closeForm(){
    formBackdrop.classList.add('hidden');
    editingId = null;
  }

  document.getElementById('addBtn').addEventListener('click', ()=> openForm(null));
  document.getElementById('closeForm').addEventListener('click', closeForm);
  document.getElementById('cancelForm').addEventListener('click', closeForm);
  formBackdrop.addEventListener('click', (e)=>{ if(e.target === formBackdrop) closeForm(); });

  cafeForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = document.getElementById('fName').value.trim();
    const location = document.getElementById('fLocation').value.trim();
    const photo = document.getElementById('fPhoto').value.trim();
    const reviewCountRaw = document.getElementById('fReviewCount').value.trim();
    const reviewCount = reviewCountRaw ? parseInt(reviewCountRaw, 10) || 0 : 0;
    const price = document.getElementById('fPrice').value.trim();
    const openTime = document.getElementById('fOpenTime').value;
    const closeTime = document.getElementById('fCloseTime').value;
    const notes = document.getElementById('fNotes').value.trim();
    if(!name || !location){ return; }

    const submitBtn = document.getElementById('submitForm');
    submitBtn.disabled = true;

    try{
      if(editingId){
        const c = cafes.find(x=>x.id===editingId);
        const updated = {...c, name, location, photo, reviewCount, price, openTime, closeTime, notes, rating: selectedRating, swatch: selectedSwatch, tags:[...selectedTags]};
        await updateCafeDB(updated);
        Object.assign(c, updated);
        showToast('Perubahan disimpan ✓');
      } else {
        const newCafe = {id: cid(), name, location, photo, reviewCount, price, openTime, closeTime, notes, rating: selectedRating, swatch: selectedSwatch, tags:[...selectedTags]};
        const saved = await insertCafe(newCafe);
        cafes.unshift(saved);
        showToast('Cafe baru ditambahkan ✓');
      }
      closeForm();
      render();
    }catch(err){
      showToast('Gagal simpan, cek koneksi internet');
    }finally{
      submitBtn.disabled = false;
    }
  });

  /* ---------------- Confirm delete modal ---------------- */
  const confirmBackdrop = document.getElementById('confirmBackdrop');

  function openConfirm(id){
    deletingId = id;
    const c = cafes.find(x=>x.id===id);
    document.getElementById('confirmText').textContent = `"${c.name}" akan dihapus dari daftar kamu secara permanen.`;
    confirmBackdrop.classList.remove('hidden');
  }
  function closeConfirm(){
    confirmBackdrop.classList.add('hidden');
    deletingId = null;
  }

  document.getElementById('cancelDelete').addEventListener('click', closeConfirm);
  confirmBackdrop.addEventListener('click', (e)=>{ if(e.target === confirmBackdrop) closeConfirm(); });

  document.getElementById('confirmDelete').addEventListener('click', async ()=>{
    const cardEl = grid.querySelector(`.card[data-id="${deletingId}"]`);
    const idToRemove = deletingId;
    closeConfirm();
    try{
      await deleteCafeDB(idToRemove);
      const finish = ()=>{
        cafes = cafes.filter(c=>c.id !== idToRemove);
        render();
        showToast('Cafe dihapus');
      };
      if(cardEl){
        cardEl.classList.add('removing');
        cardEl.addEventListener('animationend', finish, {once:true});
      } else {
        finish();
      }
    }catch(err){
      showToast('Gagal hapus, cek koneksi internet');
    }
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      if(!formBackdrop.classList.contains('hidden')) closeForm();
      if(!confirmBackdrop.classList.contains('hidden')) closeConfirm();
    }
  });

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    t.style.animation = 'none';
    void t.offsetWidth;
    t.style.animation = '';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=> t.classList.add('hidden'), 2400);
  }

  /* ---------------- Backup: export / import ---------------- */
  const exportBtn = document.getElementById('exportBtn');
  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importFile');

  if(exportBtn){
    exportBtn.addEventListener('click', ()=>{
      const blob = new Blob([JSON.stringify(cafes, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cafe-log-backup.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Backup diunduh ✓');
    });
  }

  if(importBtn){
    importBtn.addEventListener('click', ()=> importFile.click());
  }

  if(importFile){
    importFile.addEventListener('change', async (e)=>{
      const file = e.target.files[0];
      if(!file) return;
      try{
        const text = await file.text();
        const parsed = JSON.parse(text);
        if(!Array.isArray(parsed)) throw new Error('Format file salah');
        showToast('Memulihkan data...');
        for(const item of parsed){
          const cafeToRestore = {
            id: item.id || cid(),
            name: item.name || 'Tanpa nama',
            location: item.location || '',
            photo: item.photo || '',
            reviewCount: item.reviewCount || 0,
            price: item.price || '',
            openTime: item.openTime || '',
            closeTime: item.closeTime || '',
            notes: item.notes || '',
            rating: item.rating || 0,
            swatch: item.swatch || 0,
            tags: Array.isArray(item.tags) ? item.tags : []
          };
          try{
            const saved = await insertCafe(cafeToRestore);
            cafes.unshift(saved);
          }catch(err){ /* lewati item yang gagal (mis. id bentrok) */ }
        }
        render();
        showToast('Data berhasil dipulihkan ✓');
      }catch(err){
        showToast('Gagal baca file backup');
      }
      importFile.value = '';
    });
  }

  /* ---------------- Init ---------------- */
  async function init(){
    cafes = await fetchCafes();
    render();
  }
  init();
})();
