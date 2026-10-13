// Fecha os itens abertos do FAQ ao abrir outro (comportamento de acordeão).
document.querySelectorAll('.faq details').forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (!item.open) return;
    document.querySelectorAll('.faq details[open]').forEach(function (other) {
      if (other !== item) other.removeAttribute('open');
    });
  });
});

// Monta os cards de produtos a partir de data/produtos.json
(function () {
  var box = document.getElementById('lista-produtos');
  if (!box) return;
  var WA = 'https://wa.me/5522981478782?text=';
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function render(lista) {
    var itens = (lista || []).filter(function (p) { return p && p.nome && p.disponivel !== false; });
    if (!itens.length) return;
    box.innerHTML = '';
    itens.forEach(function (p) {
      var card = el('div', 'card');
      if (p.imagem) {
        var img = el('img');
        img.src = p.imagem;
        img.alt = p.nome;
        img.loading = 'lazy';
        card.appendChild(img);
      } else {
        card.appendChild(el('div', 'ph', p.nome));
      }
      var t = el('div', 't');
      t.appendChild(el('h3', '', p.nome));
      if (p.descricao) t.appendChild(el('p', '', p.descricao));
      if (p.preco) t.appendChild(el('span', 'preco', p.preco));
      var a = el('a', 'pedir', 'Pedir pelo WhatsApp');
      a.href = WA + encodeURIComponent('Olá! Quero saber mais sobre: ' + p.nome);
      a.target = '_blank';
      a.rel = 'noopener';
      t.appendChild(a);
      card.appendChild(t);
      box.appendChild(card);
    });
  }
  if (window.PRODUTOS_INLINE) { render(window.PRODUTOS_INLINE.produtos); return; }
  // 1º tenta a lista salva pelo painel (/api/produtos); se não houver, usa data/produtos.json
  fetch('/api/produtos', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d && d.produtos && d.produtos.length) return d.produtos;
      throw new Error('sem lista do painel');
    })
    .catch(function () {
      return fetch('data/produtos.json', { cache: 'no-cache' })
        .then(function (r) { return r.json(); })
        .then(function (d) { return d.produtos; });
    })
    .then(render)
    .catch(function () {});
})();
