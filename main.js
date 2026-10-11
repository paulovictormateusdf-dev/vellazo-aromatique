// Fecha os itens abertos do FAQ ao abrir outro (comportamento de acordeão).
document.querySelectorAll('.faq details').forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (!item.open) return;
    document.querySelectorAll('.faq details[open]').forEach(function (other) {
      if (other !== item) other.removeAttribute('open');
    });
  });
});
