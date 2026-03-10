// ── ESTADO ──
  const carrinho = [];

  // ── NAV SCROLL ──
  window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── MENU MOBILE ──
  function toggleMenu() {
    const btn = document.getElementById('hamBtn');
    const links = document.querySelector('.nav-links');
    btn.classList.toggle('aberto');
    links.classList.toggle('aberto');
  }
  document.addEventListener('click', e => {
    const btn = document.getElementById('hamBtn');
    const links = document.querySelector('.nav-links');
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      btn.classList.remove('aberto');
      links.classList.remove('aberto');
    }
  });

  // ── TOAST ──
  let toastTimer;
  function mostrarToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  // ── CARRINHO ──
  function atualizarCarrinho() {
    const badge = document.getElementById('cartBadge');
    const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
    const qtd = carrinho.reduce((s, i) => s + i.qtd, 0);
    badge.textContent = qtd;
    badge.classList.toggle('visivel', qtd > 0);
    document.getElementById('cartTotal').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    const vazio = document.getElementById('cartVazio');
    const footer = document.getElementById('cartFooter');
    const itemsEl = document.getElementById('cartItems');
    // render items
    const existingItems = itemsEl.querySelectorAll('.cart-item');
    existingItems.forEach(el => el.remove());
    carrinho.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = '<div class="cart-item-info"><div class="cart-item-nome">' + item.nome + '</div><div class="cart-item-det">' + item.cor + ' · ' + item.tam + '</div></div><div class="cart-item-preco">R$ ' + (item.preco * item.qtd).toFixed(2).replace('.', ',') + '</div><button class="btn-rm" onclick="removerItem(' + idx + ')">&#10005;</button>';
      itemsEl.appendChild(div);
    });
    vazio.style.display = carrinho.length ? 'none' : 'block';
    footer.style.display = carrinho.length ? 'block' : 'none';
  }

  function adicionarCarrinho() {
    const t = document.getElementById('tamLabel').textContent;
    const c = document.getElementById('corLabel').textContent;
    if (t === '—') { mostrarToast('Selecione um tamanho primeiro'); return; }
    const idx = carrinho.findIndex(i => i.cor === c && i.tam === t);
    if (idx >= 0) {
      carrinho[idx].qtd++;
    } else {
      carrinho.push({ nome: 'Camiseta Essential', cor: c, tam: t, preco: 79.90, qtd: 1 });
    }
    atualizarCarrinho();
    mostrarToast('✓ Camiseta Essential adicionada ao carrinho');
  }

  function removerItem(idx) {
    carrinho.splice(idx, 1);
    atualizarCarrinho();
  }

  function abrirCarrinho() {
    document.getElementById('cartDrawer').classList.add('aberto');
    document.getElementById('cartOverlay').classList.add('aberto');
    document.body.style.overflow = 'hidden';
  }

  function fecharCarrinho() {
    document.getElementById('cartDrawer').classList.remove('aberto');
    document.getElementById('cartOverlay').classList.remove('aberto');
    document.body.style.overflow = '';
  }

  function finalizarCompra() {
    if (!carrinho.length) return;
    const itens = carrinho.map(i => i.nome + ' ' + i.cor + ' · Tam ' + i.tam + ' (x' + i.qtd + ')').join('%0A');
    const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0).toFixed(2).replace('.', ',');
    const msg = encodeURIComponent('Olá! Gostaria de finalizar meu pedido:%0A' + itens.replace(/%0A/g, '%0A') + '%0ATotal: R$ ' + total);
    window.open('https://wa.me/5500000000000?text=' + msg, '_blank');
  }

  // ── TROCAR FOTO PRINCIPAL ──
  function trocarFoto(src, nome, el) {
    const img = document.getElementById('fotoMain');
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = src;
      img.style.opacity = 1;
    }, 250);
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('ativo'));
    el.classList.add('ativo');
    document.getElementById('corLabel').textContent = nome;
    // sync cor buttons
    document.querySelectorAll('.cor-item').forEach(c => {
      if (c.querySelector('.cor-name').textContent.trim().replace('/', ' & ') === nome ||
          nome.includes(c.querySelector('.cor-name').textContent.trim())) {
        c.classList.add('ativo');
      } else {
        c.classList.remove('ativo');
      }
    });
  }

  // Trocar cor (botões)
  function trocarCor(nome, el, src) {
    document.querySelectorAll('.cor-item').forEach(c => c.classList.remove('ativo'));
    el.classList.add('ativo');
    document.getElementById('corLabel').textContent = nome;
    const img = document.getElementById('fotoMain');
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = src;
      img.style.opacity = 1;
    }, 200);
    // sync thumbs
    const thumbs = document.querySelectorAll('.thumb');
    const nomes = ['Branco & Preto','Cinza Concreto','Off-White'];
    thumbs.forEach((t,i) => t.classList.toggle('ativo', nomes[i] === nome));
  }

  // Tamanho
  function escolherTam(t, el) {
    document.querySelectorAll('.tam:not(.esgotado)').forEach(b => b.classList.remove('ativo'));
    el.classList.add('ativo');
    document.getElementById('tamLabel').textContent = t;
  }

  // Comprar
  function comprar() {
    const t = document.getElementById('tamLabel').textContent;
    const c = document.getElementById('corLabel').textContent;
    if (t === '—') { alert('Selecione um tamanho antes de continuar.'); return; }
    alert('✅ Pedido iniciado!\n\nCamiseta Essential VEXIS\nCor: ' + c + ' · Tamanho: ' + t + '\n\nRedirecionando para o checkout...');
  }

  // Fade-in animação
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.style.animationPlayState = 'running'; });
  }, { threshold: 0.15 });
  document.querySelectorAll('.anim').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
