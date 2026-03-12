// ── ESTADO ──
const carrinho = [];
let freteAtual = { valor: 0, label: '', prazo: '', calculado: false };

// ── TABELA DE FRETE POR ESTADO ──
const ZONAS_FRETE = {
  // Sul
  PR: { valor: 12.90, zona: 'Sul',          prazo: '3–5 dias úteis' },
  SC: { valor: 12.90, zona: 'Sul',          prazo: '3–5 dias úteis' },
  RS: { valor: 12.90, zona: 'Sul',          prazo: '3–5 dias úteis' },
  // Sudeste
  SP: { valor: 12.90, zona: 'Sudeste',      prazo: '2–4 dias úteis' },
  RJ: { valor: 12.90, zona: 'Sudeste',      prazo: '2–4 dias úteis' },
  MG: { valor: 14.90, zona: 'Sudeste',      prazo: '3–5 dias úteis' },
  ES: { valor: 14.90, zona: 'Sudeste',      prazo: '3–5 dias úteis' },
  // Centro-Oeste
  DF: { valor: 18.90, zona: 'Centro-Oeste', prazo: '4–7 dias úteis' },
  GO: { valor: 18.90, zona: 'Centro-Oeste', prazo: '5–8 dias úteis' },
  MT: { valor: 18.90, zona: 'Centro-Oeste', prazo: '6–9 dias úteis' },
  MS: { valor: 18.90, zona: 'Centro-Oeste', prazo: '5–8 dias úteis' },
  // Nordeste
  BA: { valor: 18.90, zona: 'Nordeste',     prazo: '6–9 dias úteis' },
  SE: { valor: 18.90, zona: 'Nordeste',     prazo: '6–9 dias úteis' },
  AL: { valor: 21.90, zona: 'Nordeste',     prazo: '7–10 dias úteis' },
  PE: { valor: 21.90, zona: 'Nordeste',     prazo: '7–10 dias úteis' },
  PB: { valor: 21.90, zona: 'Nordeste',     prazo: '7–10 dias úteis' },
  RN: { valor: 21.90, zona: 'Nordeste',     prazo: '7–10 dias úteis' },
  CE: { valor: 21.90, zona: 'Nordeste',     prazo: '7–10 dias úteis' },
  PI: { valor: 24.90, zona: 'Nordeste',     prazo: '8–11 dias úteis' },
  MA: { valor: 24.90, zona: 'Nordeste',     prazo: '8–11 dias úteis' },
  // Norte
  TO: { valor: 21.90, zona: 'Norte',        prazo: '9–12 dias úteis' },
  PA: { valor: 24.90, zona: 'Norte',        prazo: '10–14 dias úteis' },
  AM: { valor: 24.90, zona: 'Norte',        prazo: '10–14 dias úteis' },
  RO: { valor: 24.90, zona: 'Norte',        prazo: '10–14 dias úteis' },
  AC: { valor: 27.90, zona: 'Norte',        prazo: '12–16 dias úteis' },
  RR: { valor: 27.90, zona: 'Norte',        prazo: '12–16 dias úteis' },
  AP: { valor: 27.90, zona: 'Norte',        prazo: '12–16 dias úteis' },
};

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
  // Reseta frete
  freteAtual = { valor: 0, label: '', prazo: '', calculado: false };
  document.getElementById('cepInput').value = '';
  document.getElementById('freteResultado').classList.remove('visivel');
  document.getElementById('freteLinha').classList.remove('visivel');
  document.getElementById('btnCalcularFrete').textContent = 'Calcular';
  document.getElementById('btnCalcularFrete').disabled = false;

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

// ── FRETE ──
function formatarCep(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 8);
  if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5);
  input.value = v;
}

async function calcularFrete() {
  const cepRaw = document.getElementById('cepInput').value.replace(/\D/g, '');
  if (cepRaw.length !== 8) { mostrarToast('Digite um CEP válido com 8 dígitos'); return; }

  const btn = document.getElementById('btnCalcularFrete');
  btn.textContent = 'Buscando…';
  btn.disabled = true;

  try {
    const res  = await fetch('https://viacep.com.br/ws/' + cepRaw + '/json/');
    const data = await res.json();

    if (data.erro) {
      mostrarToast('CEP não encontrado. Verifique e tente novamente.');
      btn.textContent = 'Calcular';
      btn.disabled = false;
      return;
    }

    const uf             = data.uf;
    const totalProdutos  = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
    const freteGratis    = totalProdutos >= 199;
    const info           = ZONAS_FRETE[uf];

    if (!info && !freteGratis) {
      mostrarToast('Estado não mapeado. Entre em contato para consultar o frete.');
      btn.textContent = 'Recalcular';
      btn.disabled = false;
      return;
    }

    if (freteGratis) {
      freteAtual = { valor: 0, label: 'Frete Grátis', prazo: (info ? info.prazo : '5–14 dias úteis'), calculado: true };
    } else {
      freteAtual = { valor: info.valor, label: info.zona, prazo: info.prazo, calculado: true };
    }

    // Atualiza resultado visual
    const localidade = data.localidade + ' — ' + uf + ' (' + (freteGratis ? 'Frete Grátis 🎉' : freteAtual.label) + ')';
    const valorDisplay = freteGratis ? 'Grátis' : 'R$ ' + freteAtual.valor.toFixed(2).replace('.', ',');

    document.getElementById('freteLocalidade').textContent = localidade;
    const valEl = document.getElementById('freteValorDisplay');
    valEl.textContent = valorDisplay;
    valEl.className   = 'frete-resultado-val' + (freteGratis ? ' gratis' : '');
    document.getElementById('fretePrazo').textContent = '✦ Prazo estimado: ' + freteAtual.prazo;
    document.getElementById('freteResultado').classList.add('visivel');

    // Linha de frete no resumo
    document.getElementById('checkoutFreteValor').textContent = valorDisplay;
    document.getElementById('freteLinha').classList.add('visivel');

    // Total atualizado
    const totalFinal = totalProdutos + freteAtual.valor;
    const fmtTotal   = 'R$ ' + totalFinal.toFixed(2).replace('.', ',');
    document.getElementById('checkoutResumoTotal').textContent = fmtTotal;
    document.getElementById('checkoutTotalBadge').textContent  = fmtTotal;

    // Atualiza parcelas com frete incluso
    const sel = document.getElementById('ccParcelas');
    sel.innerHTML = '';
    for (let i = 1; i <= 3; i++) {
      const v = (totalFinal / i).toFixed(2).replace('.', ',');
      const o = document.createElement('option');
      o.value = i;
      o.textContent = i + 'x de R$ ' + v + (i === 1 ? ' (à vista)' : ' sem juros');
      sel.appendChild(o);
    }

  } catch (err) {
    mostrarToast('Erro ao buscar CEP. Verifique sua conexão.');
  }

  btn.textContent = 'Recalcular';
  btn.disabled = false;
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
  const subtotal   = carrinho.reduce((s, i) => s + i.preco * i.qtd, 0);
  const totalFinal = subtotal + freteAtual.valor;
  const itens      = carrinho.map(i => i.nome + ' ' + i.cor + ' · Tam ' + i.tam + ' (x' + i.qtd + ')').join('\n');
  const freteInfo  = freteAtual.calculado
    ? '\nFrete: ' + (freteAtual.valor === 0 ? 'Grátis' : 'R$ ' + freteAtual.valor.toFixed(2).replace('.', ','))
    : '';
  const msg = encodeURIComponent('Olá! Realizei o pagamento via PIX e gostaria de confirmar meu pedido:\n' + itens + freteInfo + '\nTotal: R$ ' + totalFinal.toFixed(2).replace('.', ',') + '\n\n[Anexe o comprovante PIX aqui]');
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
function trocarCorPolo(cardId, src, nome, el) {
  const card = document.getElementById(cardId).closest('.polo-card');
  card.querySelectorAll('.polo-swatch').forEach(b => b.classList.remove('ativo'));
  el.classList.add('ativo');
  card.querySelector('.polo-cor-ativa').textContent = nome;

  const img = document.getElementById(cardId).querySelector('.polo-img');
  img.style.opacity = 0;
  setTimeout(() => { img.src = src; img.style.opacity = 1; }, 200);
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

// ── DRY-FIT ──
function escolherCorDry(cor, el) {
  document.querySelectorAll('.cor-tag').forEach(b => b.classList.remove('ativo'));
  el.classList.add('ativo');
  document.getElementById('dryCorLabel').textContent = cor;
}
function escolherGeneroDry(gen, el) {
  document.querySelectorAll('.dry-gen').forEach(b => b.classList.remove('ativo'));
  el.classList.add('ativo');
  document.getElementById('dryGenLabel').textContent = gen;
}
function escolherTamDry(tam, el) {
  document.querySelectorAll('.dry-tam').forEach(b => b.classList.remove('ativo'));
  el.classList.add('ativo');
  document.getElementById('dryTamLabel').textContent = tam;
}
function adicionarDryCarrinho() {
  const cor = document.getElementById('dryCorLabel').textContent;
  const gen = document.getElementById('dryGenLabel').textContent;
  const tam = document.getElementById('dryTamLabel').textContent;
  if (cor === '—') { mostrarToast('Selecione uma cor para o Dry-Fit'); return; }
  if (gen === '—') { mostrarToast('Selecione Masculino ou Feminino'); return; }
  if (tam === '—') { mostrarToast('Selecione um tamanho'); return; }
  const nome = 'Dry-Fit ' + gen;
  const descCor = cor + ' · ' + gen;
  const idx = carrinho.findIndex(i => i.nome === nome && i.cor === descCor && i.tam === tam);
  if (idx >= 0) { carrinho[idx].qtd++; }
  else { carrinho.push({ nome, cor: descCor, tam, preco: 89.90, qtd: 1 }); }
  atualizarCarrinho();
  mostrarToast('✓ Dry-Fit adicionado ao carrinho');
}
function comprarDry() {
  const cor = document.getElementById('dryCorLabel').textContent;
  const gen = document.getElementById('dryGenLabel').textContent;
  const tam = document.getElementById('dryTamLabel').textContent;
  if (cor === '—') { mostrarToast('Selecione uma cor para o Dry-Fit'); return; }
  if (gen === '—') { mostrarToast('Selecione Masculino ou Feminino'); return; }
  if (tam === '—') { mostrarToast('Selecione um tamanho'); return; }
  adicionarDryCarrinho();
  setTimeout(() => abrirCheckout(), 300);
}

// ── ANIMAÇÕES POR SCROLL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.style.animationPlayState = 'running'; });
}, { threshold: 0.15 });
document.querySelectorAll('.anim').forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});
