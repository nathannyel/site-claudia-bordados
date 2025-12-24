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

document.addEventListener("DOMContentLoaded", () => {
  inicializarBotoes();

  const carrinhoEl = document.querySelector(".carrinho");
  const botaoFechar = document.getElementById("fechar-carrinho");
  const botaoAbrir = document.getElementById("abrir-carrinho");

  // Carrinho começa oculto (tanto no desktop quanto no mobile)
  carrinhoEl.classList.add("oculto");
  botaoAbrir.classList.add("ativo");

  botaoFechar.addEventListener("click", () => {
    carrinhoEl.classList.add("oculto");
    botaoAbrir.classList.add("ativo");
  });

  botaoAbrir.addEventListener("click", () => {
    carrinhoEl.classList.remove("oculto");
    botaoAbrir.classList.remove("ativo");
  })
});
// ----- MENU HAMBÚRGUER -----
document.addEventListener('DOMContentLoaded', () => {
  const btnMenu = document.getElementById('btn-menu');
  const navLinks = document.getElementById('nav-links');

  if (!btnMenu || !navLinks) return;

  btnMenu.addEventListener('click', () => {
    const aberto = navLinks.classList.toggle('aberto');
    btnMenu.setAttribute('aria-expanded', String(aberto));
  });

  // Fecha o menu ao clicar em um link (melhor UX)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('aberto');
      btnMenu.setAttribute('aria-expanded', 'false');
    });
  });
});
// ----- ANIMAÇÃO DE ENTRADA -----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
// Abrir carrinho
document.getElementById('abrir-carrinho').addEventListener('click', () => {
  document.querySelector('.carrinho').classList.remove('oculto');
});

// Fechar carrinho
document.getElementById('fechar-carrinho').addEventListener('click', () => {
  document.querySelector('.carrinho').classList.add('oculto');
});

// Atualizar contador do botão flutuante
function atualizarContador() {
  document.getElementById('contador-carrinho').textContent = carrinho.length;
}

// Chame essa função sempre que adicionar ou remover item
// (adicione dentro de onde você atualiza o carrinho)
// ===== Animação Reveal ao rolar a página =====
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 }); // ativa quando 20% do elemento estiver visível

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});

// ----- LÓGICA DO CARROSSEL -----
document.querySelectorAll('.carousel').forEach(carousel => {
  const buttons = carousel.querySelectorAll('.carousel-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Verifica se é botão de próximo (1) ou anterior (-1)
      const offset = button.classList.contains('next') ? 1 : -1;
      const slides = button.closest('.carousel').querySelector('[data-slides]');
      
      const activeSlide = slides.querySelector('[data-active]');
      let newIndex = [...slides.children].indexOf(activeSlide) + offset;
      
      // Loop infinito (se passar do último volta pro primeiro e vice-versa)
      if (newIndex < 0) newIndex = slides.children.length - 1;
      if (newIndex >= slides.children.length) newIndex = 0;
      
      // Troca o atributo data-active
      slides.children[newIndex].dataset.active = true;
      delete activeSlide.dataset.active;
    });
  });
});
