:root{
    --bg: #F0F4F1;
    --bg-soft: #E5ECE6;
    --card: #FFFFFF;
    --ink: #202B25;
    --ink-soft: #5C6B62;
    --ink-faint: #93A29A;
    --sage: #5F7E6C;
    --sage-deep: #3E5747;
    --sage-line: #CFDBD1;
    --mint: #A9CBB4;
    --teal: #6E96A0;
    --blue: #7C93B0;
    --moss: #8A9B6E;
    --stone: #94897C;
    --warn: #BE6B54;
    --radius-lg: 22px;
    --radius-md: 14px;
    --radius-sm: 9px;
    --shadow: 0 1px 2px rgba(32,43,37,0.04), 0 8px 24px rgba(32,43,37,0.06);
    --shadow-lift: 0 10px 30px rgba(32,43,37,0.14);
  }

  *{ box-sizing: border-box; }

  html,body{
    margin:0; padding:0;
    background: var(--bg);
    color: var(--ink);
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  body{
    background-image:
      radial-gradient(circle at 8% 0%, rgba(169,203,180,0.35), transparent 40%),
      radial-gradient(circle at 100% 20%, rgba(124,147,176,0.18), transparent 45%);
    min-height: 100vh;
  }

  h1,h2,h3, .display{
    font-family: 'Bricolage Grotesque', sans-serif;
  }

  ::selection{ background: var(--mint); color: var(--sage-deep); }

  :focus-visible{
    outline: 2.5px solid var(--sage);
    outline-offset: 3px;
    border-radius: 4px;
  }

  button{ font-family: inherit; cursor: pointer; }

  .app{
    max-width: 1080px;
    margin: 0 auto;
    padding: 56px 28px 140px;
  }

  /* ---------- Header ---------- */
  header{
    margin-bottom: 34px;
  }

  .eyebrow-row{
    display:flex;
    align-items:center;
    gap:10px;
    margin-bottom: 10px;
  }

  .leaf{
    width: 22px; height: 22px;
    flex-shrink: 0;
  }

  header h1{
    font-size: clamp(34px, 5.4vw, 52px);
    font-weight: 700;
    line-height: 1.02;
    margin: 0 0 10px 0;
    color: var(--sage-deep);
    letter-spacing: -0.02em;
  }

  header p{
    margin: 0;
    font-size: 16px;
    color: var(--ink-soft);
    max-width: 46ch;
    line-height: 1.55;
  }

  .stat-row{
    display:flex;
    gap: 22px;
    margin-top: 22px;
    flex-wrap: wrap;
  }

  .stat{
    background: var(--card);
    border: 1px solid var(--sage-line);
    border-radius: var(--radius-md);
    padding: 12px 18px;
    min-width: 108px;
  }

  .stat b{
    display:block;
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 22px;
    color: var(--sage-deep);
    line-height: 1.1;
  }

  .stat span{
    font-size: 12.5px;
    color: var(--ink-faint);
  }

  /* ---------- Controls ---------- */
  .controls{
    display:flex;
    gap: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .search-wrap{
    position: relative;
    flex: 1 1 260px;
  }

  .search-wrap svg{
    position:absolute;
    left:16px; top:50%;
    transform: translateY(-50%);
    color: var(--ink-faint);
  }

  #search{
    width:100%;
    padding: 13px 16px 13px 42px;
    border-radius: 999px;
    border: 1px solid var(--sage-line);
    background: var(--card);
    color: var(--ink);
    font-size: 14.5px;
  }
  #search::placeholder{ color: var(--ink-faint); }

  select#filterTag, select#sortBy{
    padding: 13px 38px 13px 18px;
    border-radius: 999px;
    border: 1px solid var(--sage-line);
    background: var(--card);
    color: var(--ink);
    font-size: 14px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235C6B62' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
  }

  /* ---------- Grid ---------- */
  .grid{
    display:grid;
    grid-template-columns: repeat(auto-fill, minmax(252px, 1fr));
    gap: 20px;
  }

  .card{
    background: var(--card);
    border-radius: var(--radius-lg);
    border: 1px solid var(--sage-line);
    overflow: hidden;
    box-shadow: var(--shadow);
    display:flex;
    flex-direction: column;
    transition: transform .22s ease, box-shadow .22s ease;
    opacity: 0;
    transform: translateY(14px);
    animation: cardIn .5s ease forwards;
  }

  .card:hover{
    transform: translateY(-4px);
    box-shadow: var(--shadow-lift);
  }

  .card.removing{
    animation: cardOut .28s ease forwards;
  }

  @keyframes cardIn{
    to{ opacity: 1; transform: translateY(0); }
  }
  @keyframes cardOut{
    to{ opacity: 0; transform: scale(.92) translateY(6px); }
  }

  @media (prefers-reduced-motion: reduce){
    .card{ animation: none; opacity: 1; transform:none; }
    .card.removing{ animation: none; }
  }

  .swatch{
    height: 168px;
    position: relative;
    display:flex;
    align-items:flex-end;
    padding: 14px;
  }

  .swatch::after{
    content:"";
    position:absolute; inset:0;
    background: linear-gradient(to top, rgba(0,0,0,0.16), transparent 55%);
    pointer-events:none;
  }

  .swatch .initial{
    font-family: 'Bricolage Grotesque', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: rgba(255,255,255,0.92);
  }

  .swatch .card-actions{
    position:absolute;
    top: 10px; right: 10px;
    display:flex;
    gap: 6px;
    opacity: 0;
    transform: translateY(-4px);
    transition: opacity .18s ease, transform .18s ease;
  }

  .card:hover .card-actions, .card:focus-within .card-actions{
    opacity: 1;
    transform: translateY(0);
  }

  .icon-btn{
    width: 30px; height: 30px;
    border-radius: 999px;
    border: none;
    background: rgba(255,255,255,0.9);
    display:flex; align-items:center; justify-content:center;
    color: var(--sage-deep);
    transition: background .15s ease, transform .12s ease;
  }
  .icon-btn:hover{ background: #fff; transform: scale(1.08); }
  .icon-btn.danger{ color: var(--warn); }

  .card-body{
    padding: 16px 18px 18px;
    display:flex;
    flex-direction:column;
    gap: 9px;
    flex:1;
  }

  .card-body h3{
    margin:0;
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    line-height:1.25;
  }

  .loc-row{
    display:flex;
    align-items:center;
    gap:5px;
    font-size: 13px;
    color: var(--ink-soft);
  }
  .loc-row svg{ flex-shrink:0; color: var(--sage-deep); }

  .stars{
    display:flex;
    gap: 2px;
  }
  .stars svg{ width:16px; height:16px; }
  .star-fill{ color: var(--sage); }
  .star-empty{ color: var(--sage-line); }

  .rating-price-row{
    display:flex;
    align-items:center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }

  .rating-group{
    display:flex;
    align-items:center;
    gap: 6px;
  }

  .review-count{
    font-size: 12px;
    color: var(--ink-faint);
  }

  .hours-badge{
    display:flex;
    align-items:center;
    gap: 5px;
    font-size: 12.5px;
    color: var(--ink-soft);
    background: none;
    border: none;
    padding: 0;
    white-space: nowrap;
  }

  .hours-badge svg{ flex-shrink:0; color: var(--sage-deep); }

  .hours-badge .status-text{
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: .02em;
    padding-left: 6px;
    margin-left: 1px;
    border-left: 1px solid var(--sage-line);
  }

  .hours-badge.is-open .status-text{ color: var(--sage-deep); }
  .hours-badge.is-closed .status-text{ color: var(--warn); }

  .price-row{ margin-top: -2px; }

  .price-tag{
    display:flex;
    align-items:center;
    gap:5px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--teal);
    background: none;
    border: none;
    padding: 0;
    white-space: nowrap;
  }
  .price-tag svg{ flex-shrink:0; color: var(--sage-deep); }

  .tag-row{
    display:flex;
    flex-wrap:wrap;
    gap:6px;
    margin-top:2px;
  }

  .tag{
    font-size: 11.5px;
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--sage);
    color: #fff;
    border: 1px solid var(--sage);
    white-space: nowrap;
  }

  .notes{
    font-size: 13px;
    color: var(--ink-soft);
    line-height: 1.5;
    margin-top: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer{
    margin-top: auto;
    padding-top: 10px;
    border-top: 1px dashed var(--sage-line);
    font-size: 12px;
    color: var(--ink-faint);
  }

  /* ---------- Empty state ---------- */
  .empty{
    text-align:center;
    padding: 80px 20px;
    color: var(--ink-soft);
  }
  .empty.hidden{ display:none; }
  .empty h3{
    color: var(--sage-deep);
    font-size: 22px;
    margin: 14px 0 6px;
  }
  .empty p{ margin:0; font-size:14px; }
  .empty svg{ color: var(--mint); }

  /* ---------- FAB ---------- */
  .fab{
    position: fixed;
    right: 28px; bottom: 28px;
    width: 58px; height: 58px;
    border-radius: 999px;
    background: var(--sage-deep);
    color: #fff;
    border: none;
    box-shadow: 0 10px 24px rgba(62,87,71,0.38);
    display:flex; align-items:center; justify-content:center;
    transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease;
    z-index: 40;
  }
  .fab:hover{ transform: scale(1.07) rotate(90deg); box-shadow: 0 14px 30px rgba(62,87,71,0.46); }
  .fab:active{ transform: scale(.96) rotate(90deg); }

  /* ---------- Modal ---------- */
  .modal-backdrop{
    position: fixed; inset:0;
    background: rgba(32,43,37,0.42);
    backdrop-filter: blur(3px);
    display:flex; align-items:center; justify-content:center;
    padding: 20px;
    z-index: 50;
    opacity: 0;
    animation: fadeIn .18s ease forwards;
  }
  .modal-backdrop.hidden{ display:none; }
  @keyframes fadeIn{ to{ opacity:1; } }

  .modal{
    background: var(--bg);
    border-radius: 26px;
    width: 100%;
    max-width: 480px;
    max-height: 88vh;
    overflow-y: auto;
    padding: 30px 30px 26px;
    box-shadow: 0 30px 70px rgba(32,43,37,0.32);
    transform: translateY(14px) scale(.98);
    opacity: 0;
    animation: modalIn .22s cubic-bezier(.2,.9,.3,1) forwards;
  }
  @keyframes modalIn{ to{ transform: translateY(0) scale(1); opacity:1; } }

  .modal h2{
    margin: 0 0 4px;
    font-size: 24px;
    color: var(--sage-deep);
  }
  .modal .sub{
    margin: 0 0 22px;
    font-size: 13.5px;
    color: var(--ink-faint);
  }

  .field{ margin-bottom: 16px; }
  .field label{
    display:block;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--ink-soft);
    margin-bottom: 6px;
  }
  .field input[type=text], .field input[type=date], .field textarea{
    width:100%;
    padding: 11px 14px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--sage-line);
    background: var(--card);
    color: var(--ink);
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
  }
  .field textarea{ min-height: 70px; line-height:1.5; }

  .two-col{ display:grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .star-picker{ display:flex; gap: 6px; }
  .star-picker button{
    background:none; border:none; padding:2px;
    color: var(--sage-line);
    transition: color .12s ease, transform .12s ease;
  }
  .star-picker button svg{ width:24px; height:24px; }
  .star-picker button.active{ color: var(--sage); }
  .star-picker button:hover{ transform: scale(1.12); }

  .swatch-picker{ display:flex; gap:8px; flex-wrap:wrap; }
  .swatch-dot{
    width: 30px; height:30px; border-radius:999px;
    border: 2px solid transparent;
    cursor:pointer;
    transition: transform .12s ease, border-color .12s ease;
  }
  .swatch-dot.selected{ border-color: var(--ink); transform: scale(1.1); }

  .tag-picker{ display:flex; flex-wrap:wrap; gap:8px; }
  .tag-choice{
    padding: 7px 13px;
    border-radius: 999px;
    border: 1px solid var(--sage-line);
    background: var(--card);
    font-size: 12.5px;
    color: var(--ink-soft);
    transition: background .15s ease, color .15s ease, border-color .15s ease;
  }
  .tag-choice.selected{
    background: var(--sage-deep);
    border-color: var(--sage-deep);
    color: #fff;
  }

  .modal-actions{
    display:flex;
    gap: 10px;
    margin-top: 24px;
  }

  .btn{
    flex:1;
    padding: 13px 18px;
    border-radius: 999px;
    border: none;
    font-size: 14.5px;
    font-weight: 600;
    transition: background .15s ease, transform .12s ease, opacity .15s ease;
  }
  .btn:active{ transform: scale(.97); }
  .btn-primary{ background: var(--sage-deep); color:#fff; }
  .btn-primary:hover{ background: #33493c; }
  .btn-ghost{ background: transparent; color: var(--ink-soft); border: 1px solid var(--sage-line); flex: 0 0 auto; padding-inline: 22px; }
  .btn-ghost:hover{ background: var(--bg-soft); }
  .btn-danger{ background: var(--warn); color:#fff; }
  .btn-danger:hover{ background: #a95841; }

  .close-x{
    position:absolute;
    top: 22px; right: 22px;
    background:none; border:none;
    color: var(--ink-faint);
    width: 30px; height:30px;
    display:flex; align-items:center; justify-content:center;
    border-radius: 999px;
  }
  .close-x:hover{ background: var(--bg-soft); color: var(--ink); }
  .modal{ position:relative; }

  .confirm-modal{ max-width: 380px; text-align:center; padding: 34px 28px 28px; }
  .confirm-modal svg{ color: var(--warn); margin-bottom: 12px; }
  .confirm-modal h2{ font-size: 20px; }
  .confirm-modal p{ color: var(--ink-soft); font-size: 14px; margin: 8px 0 0; }

  /* ---------- Toast ---------- */
  .toast{
    position: fixed;
    left: 28px; bottom: 28px;
    background: var(--sage-deep);
    color: #fff;
    padding: 13px 20px;
    border-radius: 999px;
    font-size: 13.5px;
    box-shadow: 0 10px 24px rgba(32,43,37,0.25);
    display:flex; align-items:center; gap:9px;
    z-index: 60;
    animation: toastIn .3s cubic-bezier(.2,.9,.3,1) forwards;
  }
  .toast.hidden{ display:none; }
  @keyframes toastIn{ from{ opacity:0; transform: translateY(10px);} to{opacity:1; transform:translateY(0);} }

  @media (max-width: 560px){
    .app{ padding: 40px 18px 130px; }
    .two-col{ grid-template-columns: 1fr; }
    .modal{ padding: 26px 20px 22px; }
    .fab{ right:18px; bottom:18px; }
    .toast{ left:18px; right:18px; }
  }
