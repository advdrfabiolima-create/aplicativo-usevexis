// ── ESTADO ──
const carrinho = [];

// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

// ── MENU MOBILE ──
function toggleMenu() {
  document.getElementById('hamBtn').classList.toggle('aberto');
  document.querySelector('.nav-links').classList.toggle('aberto');
}
document.addEventListener('click', e => {
  const btn   = document.getElementById('hamBtn');
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
  const qtd   = carrinho.reduce((s, i) => s + i.qtd, 0);
  badge.textContent = qtd;
  badge.classList.toggle('visivel', qtd > 0);
  document.getElementById('cartTotal').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
  const itemsEl = document.getElementById('cartItems');
  itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());
  carrinho.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML =
      '<div class="cart-item-info">' +
        '<div class="cart-item-nome">' + item.nome + '</div>' +
        '<div class="cart-item-det">' + item.cor + ' · ' + item.tam + '</div>' +
      '</div>' +
      '<div class="cart-item-preco">R$ ' + (item.preco * item.qtd).toFixed(2).replace('.', ',') + '</div>' +
      '<button class="btn-rm" onclick="removerItem(' + idx + ')">&#10005;</button>';
    itemsEl.appendChild(div);
  });
  document.getElementById('cartVazio').style.display  = carrinho.length ? 'none'  : 'block';
  document.getElementById('cartFooter').style.display = carrinho.length ? 'block' : 'none';
}

function adicionarCarrinho() {
  const t = document.getElementById('tamLabel').textContent;
  const c = document.getElementById('corLabel').textContent;
  if (t === '—') { mostrarToast('Selecione um tamanho primeiro'); return; }
  const idx = carrinho.findIndex(i => i.cor === c && i.tam === t);
  if (idx >= 0) { carrinho[idx].qtd++; }
  else { carrinho.push({ nome: 'Camiseta Essential', cor: c, tam: t, preco: 79.90, qtd: 1 }); }
  atualizarCarrinho();
  mostrarToast('✓ Camiseta Essential adicionada ao carrinho');
}

function removerItem(idx) { carrinho.splice(idx, 1); atualizarCarrinho(); }

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

// ── GALERIA ──
function trocarFoto(src, nome, el) {
  const img = document.getElementById('fotoMain');
  img.style.opacity = 0;
  setTimeout(() => { img.src = src; img.style.opacity = 1; }, 250);
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('ativo'));
  el.classList.add('ativo');
  document.getElementById('corLabel').textContent = nome;
  sincronizarCor(nome);
}
function trocarCor(nome, el, src) {
  document.querySelectorAll('.cor-item').forEach(c => c.classList.remove('ativo'));
  el.classList.add('ativo');
  document.getElementById('corLabel').textContent = nome;
  const img = document.getElementById('fotoMain');
  img.style.opacity = 0;
  setTimeout(() => { img.src = src; img.style.opacity = 1; }, 200);
  sincronizarCor(nome);
}
function sincronizarCor(nome) {
  const mapa = ['Branco & Preto', 'Cinza Concreto', 'Off-White'];
  document.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('ativo', mapa[i] === nome));
}
function escolherTam(t, el) {
  document.querySelectorAll('.tam:not(.esgotado)').forEach(b => b.classList.remove('ativo'));
  el.classList.add('ativo');
  document.getElementById('tamLabel').textContent = t;
}

// ── CHECKOUT ──
function popularResumo() {
  const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
  const fmt   = 'R$ ' + total.toFixed(2).replace('.', ',');
  document.getElementById('checkoutTotalBadge').textContent = fmt;
  document.getElementById('checkoutResumoTotal').textContent = fmt;
  const el = document.getElementById('checkoutResumoItens');
  el.innerHTML = '';
  carrinho.forEach(item => {
    const d = document.createElement('div');
    d.className = 'checkout-item-linha';
    d.innerHTML = '<span>' + item.nome + ' <small style="color:var(--muted)">(' + item.cor + ' · ' + item.tam + ' ×' + item.qtd + ')</small></span><span>R$ ' + (item.preco * item.qtd).toFixed(2).replace('.', ',') + '</span>';
    el.appendChild(d);
  });
  const sel = document.getElementById('ccParcelas');
  sel.innerHTML = '';
  for (let i = 1; i <= 3; i++) {
    const v = (total / i).toFixed(2).replace('.', ',');
    const o = document.createElement('option');
    o.value = i;
    o.textContent = i + 'x de R$ ' + v + (i === 1 ? ' (à vista)' : ' sem juros');
    sel.appendChild(o);
  }
}
function abrirCheckout() {
  if (!carrinho.length) { mostrarToast('Adicione produtos ao carrinho primeiro'); return; }
  popularResumo();
  document.getElementById('checkoutConfirmacao').classList.remove('visivel');
  document.getElementById('checkoutBody').style.display = 'block';
  trocarTab('pix');
  document.getElementById('checkoutOverlay').classList.add('aberto');
  document.body.style.overflow = 'hidden';
}
function abrirCheckoutDireto() {
  const t = document.getElementById('tamLabel').textContent;
  if (!carrinho.length) {
    if (t === '—') {
      document.getElementById('produto').scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => mostrarToast('Selecione cor, tamanho e adicione ao carrinho'), 600);
      return;
    }
    adicionarCarrinho();
  }
  setTimeout(() => abrirCheckout(), 100);
}
function fecharCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('aberto');
  document.body.style.overflow = '';
}
document.getElementById('checkoutOverlay').addEventListener('click', function(e) {
  if (e.target === this) fecharCheckout();
});
function trocarTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('ativo'));
  document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('ativo');
  ['painelPix', 'painelCredito', 'painelDebito'].forEach(id => {
    document.getElementById(id).style.display = 'none';
    document.getElementById(id).classList.remove('ativo');
  });
  const alvo = tab === 'pix' ? 'painelPix' : tab === 'credito' ? 'painelCredito' : 'painelDebito';
  document.getElementById(alvo).style.display = 'block';
  document.getElementById(alvo).classList.add('ativo');
}
function copiarPix() {
  const chave = document.getElementById('pixChaveTexto').textContent;
  navigator.clipboard.writeText(chave).then(() => {
    const btn = document.getElementById('btnCopiarPix');
    btn.textContent = '✓ Copiado!';
    btn.classList.add('copiado');
    setTimeout(() => { btn.textContent = 'Copiar Chave'; btn.classList.remove('copiado'); }, 2500);
  }).catch(() => mostrarToast('Chave: ' + chave));
}
function confirmarPagamentoPix() {
  const total = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
  const itens = carrinho.map(i => i.nome + ' ' + i.cor + ' · Tam ' + i.tam + ' (x' + i.qtd + ')').join('\n');
  const msg = encodeURIComponent('Olá! Realizei o pagamento via PIX e gostaria de confirmar meu pedido:\n' + itens + '\nTotal: R$ ' + total.toFixed(2).replace('.', ',') + '\n\n[Anexe o comprovante PIX aqui]');
  window.open('https://wa.me/5500000000000?text=' + msg, '_blank');
  exibirConfirmacao('Pedido enviado! Encaminhe o comprovante PIX pelo WhatsApp que acabou de abrir para confirmar sua entrega.');
}
function formatarCartao(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}
function formatarValidade(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
  input.value = v;
}
function formatarCpf(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}
function processarPagamentoCartao(tipo) {
  const p      = tipo === 'credito' ? 'cc' : 'dc';
  const nome   = document.getElementById(p + 'Nome').value.trim();
  const numero = document.getElementById(p + 'Numero').value.replace(/\s/g, '');
  const val    = document.getElementById(p + 'Validade').value.trim();
  const cvv    = document.getElementById(p + 'Cvv').value.trim();
  const cpf    = document.getElementById(p + 'Cpf').value.replace(/\D/g, '');
  if (!nome)              { mostrarToast('Informe o nome no cartão'); return; }
  if (numero.length < 16) { mostrarToast('Número do cartão inválido'); return; }
  if (!val.includes('/')) { mostrarToast('Informe a validade'); return; }
  if (cvv.length < 3)     { mostrarToast('CVV inválido'); return; }
  if (cpf.length < 11)    { mostrarToast('CPF inválido'); return; }
  exibirConfirmacao('Pagamento via Cartão de ' + (tipo === 'credito' ? 'Crédito' : 'Débito') + ' aprovado! Você receberá a confirmação por e-mail. Obrigado por escolher a VEXIS! ✦');
}
function exibirConfirmacao(msg) {
  document.getElementById('checkoutBody').style.display = 'none';
  document.getElementById('confirmacaoMsg').innerHTML = msg;
  document.getElementById('checkoutConfirmacao').classList.add('visivel');
  carrinho.length = 0;
  atualizarCarrinho();
}
function comprar() {
  const t = document.getElementById('tamLabel').textContent;
  if (t === '—') { mostrarToast('Selecione um tamanho primeiro'); return; }
  adicionarCarrinho();
  setTimeout(() => abrirCheckout(), 300);
}

// ── POLO COLLECTION ──
function corEhClara(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 145;
}

function trocarCorPolo(cardId, cor, nome, el) {
  const visual = document.getElementById(cardId);
  const shirt  = visual.querySelector('.polo-shirt-inner');
  const card   = visual.closest('.polo-card');

  card.querySelectorAll('.polo-swatch').forEach(b => b.classList.remove('ativo'));
  el.classList.add('ativo');
  card.querySelector('.polo-cor-ativa').textContent = nome;

  // Swap animation: slide out → change color → slide in
  shirt.style.animation = 'none';
  shirt.offsetHeight; // force reflow
  shirt.classList.add('trocando');

  // Change color at 35% of 520ms = ~182ms (when shirt is invisible)
  setTimeout(() => {
    const body   = visual.querySelector('.shirt-body');
    const clara  = corEhClara(cor);
    body.style.fill = cor;
    visual.querySelectorAll('.shirt-button').forEach(b => {
      b.style.fill = clara ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.45)';
    });
    visual.querySelectorAll('.shirt-placket').forEach(b => {
      b.style.fill = clara ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.18)';
    });
  }, 182);

  setTimeout(() => {
    shirt.classList.remove('trocando');
    shirt.style.animation = '';
  }, 540);
}

function escolherTamPolo(el) {
  el.closest('.polo-tams').querySelectorAll('.polo-tam').forEach(b => b.classList.remove('ativo'));
  el.classList.add('ativo');
}

function adicionarPoloCarrinho(nome, preco, cardId) {
  const card  = document.getElementById(cardId).closest('.polo-card');
  const cor   = card.querySelector('.polo-cor-ativa').textContent;
  const tamEl = card.querySelector('.polo-tam.ativo');
  if (!tamEl) { mostrarToast('Selecione um tamanho para a ' + nome); return; }
  const tam = tamEl.textContent;
  const idx = carrinho.findIndex(i => i.nome === nome && i.cor === cor && i.tam === tam);
  if (idx >= 0) { carrinho[idx].qtd++; }
  else { carrinho.push({ nome, cor, tam, preco, qtd: 1 }); }
  atualizarCarrinho();
  mostrarToast('✓ ' + nome + ' adicionada ao carrinho');
}

// ── ANIMAÇÕES POR SCROLL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.style.animationPlayState = 'running'; });
}, { threshold: 0.15 });
document.querySelectorAll('.anim').forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});
