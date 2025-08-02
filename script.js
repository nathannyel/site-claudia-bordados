// Elementos principais do carrinho
const carrinhoContainer = document.getElementById('carrinho-itens');
const totalCarrinho = document.getElementById('total');
const finalizarBtn = document.getElementById('finalizar');
let carrinho = [];

// Função para adicionar item ao carrinho
function addToCart(nome, precoStr) {
  const preco = precoStr && precoStr !== 'sob consulta'
    ? parseFloat(precoStr.replace(',', '.'))
    : null;

  carrinho.push({ nome, preco });
  atualizarCarrinho();
}

// Ligar eventos aos botões com classe .add-to-cart (catálogo)
function inicializarBotoes() {
  document.querySelectorAll('.add-to-cart').forEach(botao => {
    botao.onclick = () => {
      const nome = botao.getAttribute('data-nome');
      const preco = botao.getAttribute('data-preco') || '';
      addToCart(nome, preco);
    };
  });
}

// Atualiza o conteúdo do carrinho
function atualizarCarrinho() {
  carrinhoContainer.innerHTML = '';
  let total = 0;

  carrinho.forEach((item, index) => {
    const preco = item.preco ? `R$ ${item.preco.toFixed(2).replace('.', ',')}` : 'Preço sob consulta';

    const div = document.createElement('div');
    div.innerHTML = `
      ${item.nome} - ${preco}
      <button onclick="removerItem(${index})">x</button>
    `;

    carrinhoContainer.appendChild(div);

    if (item.preco) {
      total += item.preco;
    }
  });

  totalCarrinho.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

  const mensagem = carrinho.map(item => {
    const preco = item.preco
      ? `R$ ${item.preco.toFixed(2).replace('.', ',')}`
      : 'Preço sob consulta';
    return `${item.nome} - ${preco}`;
  }).join('\n');

  if (carrinho.length === 0) {
    finalizarBtn.href = '#';
    finalizarBtn.setAttribute('disabled', 'disabled');
    finalizarBtn.style.opacity = 0.5;
  } else {
    const numero = '5599984893782'; // Substitua pelo seu número
    const texto = encodeURIComponent(
      `Olá! Gostaria de orçamento dos seguintes itens:\n${mensagem}\n\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`
    );
    finalizarBtn.href = `https://wa.me/${numero}?text=${texto}`;
    finalizarBtn.removeAttribute('disabled');
    finalizarBtn.style.opacity = 1;
  }
  // Atualizar contador no botão flutuante
const contador = document.getElementById("contador-carrinho");
if (contador) {
  contador.textContent = carrinho.length;

  if (carrinho.length === 0) {
    contador.style.display = "none";
  } else {
    contador.style.display = "flex";
  }
}

}

// Remover item
function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

// Inicializar botões quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  inicializarBotoes();
});
// Botão de fechar carrinho
document.addEventListener("DOMContentLoaded", () => {
  inicializarBotoes();

  const carrinho = document.querySelector(".carrinho");
  const botaoFechar = document.getElementById("fechar-carrinho");
  const botaoAbrir = document.getElementById("abrir-carrinho");

  // Começa visível no desktop, mas oculto no mobile
  if (window.innerWidth <= 480) {
    carrinho.classList.add("oculto");
    botaoAbrir.classList.add("ativo");
  }

  botaoFechar.addEventListener("click", () => {
    carrinho.classList.add("oculto");
    botaoAbrir.classList.add("ativo");
  });

  botaoAbrir.addEventListener("click", () => {
    carrinho.classList.remove("oculto");
    botaoAbrir.classList.remove("ativo");
  });
});
