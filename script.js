// -------- Data (Replace with real client videos)
    const VIDEOS = [
      {id:1, title:"UGC Ad – Hydrating Serum", cat:"Ecommerce", dur:"00:18", tags:["ad","ugc","skincare"],
        thumb:"https://picsum.photos/seed/serum/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"},
      {id:2, title:"Podcast Highlight – Episode 12", cat:"Shorts", dur:"00:58", tags:["shorts","podcast"],
        thumb:"https://picsum.photos/seed/podcast/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"},
      {id:3, title:"YouTube Video – Deep Dive", cat:"Long", dur:"08:12", tags:["youtube","educational"],
        thumb:"https://picsum.photos/seed/longform/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"},
      {id:4, title:"Montage – Football Finals", cat:"Football", dur:"01:09", tags:["football","sports"],
        thumb:"https://picsum.photos/seed/football/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"},
      {id:5, title:"Streamer Highlights #27", cat:"Gaming", dur:"00:41", tags:["gaming","twitch"],
        thumb:"https://picsum.photos/seed/gaming/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"},
      {id:6, title:"Documentary Teaser – City Stories", cat:"Documentary", dur:"01:00", tags:["doc","story"],
        thumb:"https://picsum.photos/seed/doc/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"},
      {id:7, title:"Color Grade – Before/After", cat:"Color", dur:"00:22", tags:["color","grade"],
        thumb:"https://picsum.photos/seed/color/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"},
      {id:8, title:"Anime Edit – Action Sync", cat:"Anime", dur:"00:35", tags:["anime","sync"],
        thumb:"https://picsum.photos/seed/anime/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"},
      {id:9, title:"Performance Ad – App Install", cat:"Ads", dur:"00:27", tags:["ads","performance"],
        thumb:"https://picsum.photos/seed/ads/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"},
      {id:10, title:"Mini‑Doc – Founder Story", cat:"Documentary", dur:"02:17", tags:["brand","story"],
        thumb:"https://picsum.photos/seed/minidoc/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"},
      {id:11, title:"Reel – Trend Remix", cat:"Shorts", dur:"00:21", tags:["reel","trend"],
        thumb:"https://picsum.photos/seed/trend/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"},
      {id:12, title:"Gameplay – Clutch Moments", cat:"Gaming", dur:"00:52", tags:["fps","montage"],
        thumb:"https://picsum.photos/seed/clutch/800/450", src:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"},
    ];

    const grid = document.getElementById('grid');
    const search = document.getElementById('search');

    function cardTemplate(v){
      return `
        <article class="card" data-cat="${v.cat}" data-title="${v.title.toLowerCase()}" data-tags="${v.tags.join(' ').toLowerCase()}">
          <div class="thumb">
            <img loading="lazy" src="${v.thumb}" alt="${v.title}">
            <span class="badge">${v.cat}</span>
            <span class="dur">${v.dur}</span>
            <div class="actions"><button class="play" data-id="${v.id}">▶ Play</button></div>
          </div>
          <div class="content">
            <h3 class="title">${v.title}</h3>
            <div class="meta">${v.tags.map(t=>`#${t}`).join(' ')}</div>
          </div>
        </article>`;
    }

    function render(items){
      grid.innerHTML = items.map(cardTemplate).join('');
      hookCards();
      observeCards();
    }

    function filterBy(cat){
      const q = search.value.trim().toLowerCase();
      let items = VIDEOS.filter(v=> cat==='all' ? true : v.cat === cat);
      if(q){ items = items.filter(v => v.title.toLowerCase().includes(q) || v.tags.join(' ').toLowerCase().includes(q)); }
      render(items);
    }

    function hookCards(){
      grid.querySelectorAll('.card').forEach(card=>{
        const btn = card.querySelector('.play');
        btn.addEventListener('click', ()=> openModal(+btn.dataset.id));
        // Hover preview – swap img to a muted video
        const thumb = card.querySelector('.thumb');
        let vidEl;
        card.addEventListener('mouseenter', ()=>{
          if(vidEl) return; const v = VIDEOS.find(x=>x.title === card.querySelector('.title').textContent);
          vidEl = document.createElement('video');
          vidEl.src = v.src; vidEl.muted = true; vidEl.loop = true; vidEl.playsInline = true; vidEl.autoplay = true;
          vidEl.setAttribute('aria-hidden', 'true');
          thumb.querySelector('img').style.display='none';
          thumb.prepend(vidEl);
        });
        card.addEventListener('mouseleave', ()=>{
          if(!vidEl) return; vidEl.remove(); vidEl = null; thumb.querySelector('img').style.display='block';
        });
      });
    }

    // Intersection reveal
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target);} });
    }, {threshold:.15});
    function observeCards(){ grid.querySelectorAll('.card').forEach(el=> io.observe(el)); }

    // Modal/lightbox
    const modal = document.getElementById('modal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalTag = document.getElementById('modalTag');
    document.getElementById('closeModal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });

    function openModal(id){
      const v = VIDEOS.find(x=> x.id === id); if(!v) return;
      modalVideo.src = v.src; modalVideo.currentTime = 0; modalVideo.play();
      modalTitle.textContent = v.title; modalTag.textContent = v.cat;
      modal.classList.add('open');
    }
    function closeModal(){ modal.classList.remove('open'); modalVideo.pause(); modalVideo.src=''; }

    // Filters UI
    let active = 'all';
    document.querySelectorAll('.filters .btn').forEach(b=>{
      b.addEventListener('click', ()=>{ active = b.dataset.filter; filterBy(active); setActiveBtn(b); });
    });
    function setActiveBtn(el){
      document.querySelectorAll('.filters .btn').forEach(x=> x.style.outline='none');
      el.style.outline = '2px solid var(--brand)'; el.style.outlineOffset = '2px';
    }
    search.addEventListener('input', ()=> filterBy(active));

    // Theme toggle with persistence
    const themeToggle = document.getElementById('themeToggle');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const saved = localStorage.getItem('theme');
    if(saved === 'light' || (!saved && prefersLight)) document.body.classList.add('light');
    themeToggle.addEventListener('click', ()=>{
      document.body.classList.toggle('light');
      localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
      themeToggle.textContent = document.body.classList.contains('light') ? '☀️ Theme' : '🌙 Theme';
    });

    // Init
    render(VIDEOS);
    setActiveBtn(document.querySelector('[data-filter="all"]'));