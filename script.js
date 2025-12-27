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
    const numero = localStorage.getItem('site_whatsapp_number') || '5599984893782';
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

// Função para carregar produtos do LocalStorage e renderizar na tela
function carregarProdutosDoSite() {
  const galeriaContainer = document.querySelector('.galeria-container');
  const catalogoContainer = document.querySelector('.catalogo-container');

  // Dados padrão caso não tenha nada no localStorage (mesmos do admin)
  const produtosPadrao = [
      { nome: 'Bordado Floral', preco: 35.00, imagem: 'imagens/toalha.jpg', secao: 'galeria' },
      { nome: 'Bordado Coração', preco: 40.00, imagem: 'imagens/kit-bebe.jpg', secao: 'galeria' },
      { nome: 'Toalha de Lavabo', preco: 25.00, imagem: 'imagens/toalha.jpg', secao: 'galeria' },
      { nome: 'Kit bebê bordado', preco: 0, imagem: 'imagens/kit-bebe.jpg', secao: 'catalogo' },
      { nome: 'Toalhas personalizadas', preco: 0, imagem: 'imagens/toalha.jpg', secao: 'catalogo' },
      { nome: 'Enxoval Completo', preco: 0, imagem: 'imagens/kit-bebe.jpg', secao: 'catalogo' }
  ];

  const produtos = JSON.parse(localStorage.getItem('produtos_site')) || produtosPadrao;

  // Limpar containers para substituir o conteúdo estático pelo dinâmico
  if (galeriaContainer) galeriaContainer.innerHTML = '';
  if (catalogoContainer) catalogoContainer.innerHTML = '';

  produtos.forEach(produto => {
      // Define se é catálogo ou galeria baseado na propriedade 'secao'
      // Se não tiver 'secao' (dados antigos), usa a lógica do preço
      let isCatalogo;
      if (produto.secao) {
          isCatalogo = produto.secao === 'catalogo';
      } else {
          isCatalogo = produto.preco === 0;
      }

      const container = isCatalogo ? catalogoContainer : galeriaContainer;
      const imagem = produto.imagem || 'imagens/toalha.jpg';
      
      if (!container) return;

      const precoTexto = isCatalogo ? 'Preço sob consulta' : `R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}`;
      const dataPreco = isCatalogo ? '' : `data-preco="${produto.preco}"`;

      const card = document.createElement('div');
      card.className = 'product-card reveal visible'; 
      card.innerHTML = `
        <div class="product-img">
            <div class="carousel" data-carousel tabindex="0">
              <button class="carousel-btn prev" aria-label="Imagem anterior">‹</button>
              <div class="carousel-viewport">
                <div class="carousel-track" data-slides>
                  <img src="${imagem}" alt="${produto.nome}" loading="lazy" data-active>
                </div>
              </div>
              <button class="carousel-btn next" aria-label="Próxima imagem">›</button>
              <div class="carousel-dots" data-dots></div>
            </div>
        </div>
        <div class="product-info">
            <h3>${produto.nome}</h3>
            <p class="price">${precoTexto}</p>
            <button class="btn-cart add-to-cart" data-nome="${produto.nome}" ${dataPreco}>Adicionar ao carrinho</button>
            <button class="btn-details">Ver Detalhes</button>
        </div>
      `;
      
      card.querySelector('.btn-details').addEventListener('click', () => {
        abrirModal(produto, imagem, precoTexto, produto.detalhes);
      });

      container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutosDoSite(); // Carrega os produtos do admin
  inicializarBotoes();

  // --- ATUALIZAR LINKS DO WHATSAPP COM NÚMERO CONFIGURADO ---
  const numeroWhats = localStorage.getItem('site_whatsapp_number') || '5599984893782';
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    if (!link.id || link.id !== 'finalizar') { // Não altera o botão do carrinho pois ele é dinâmico
        link.href = link.href.replace(/wa\.me\/\d+/, `wa.me/${numeroWhats}`);
    }
  });

  // --- RASTREAMENTO DE VISITANTES ---
  let visitantes = localStorage.getItem('site_visitantes') || 0;
  visitantes = parseInt(visitantes) + 1;
  localStorage.setItem('site_visitantes', visitantes);

  // --- RASTREAMENTO DE CLIQUES NO WHATSAPP ---
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      let clicks = localStorage.getItem('site_whatsapp_clicks') || 0;
      localStorage.setItem('site_whatsapp_clicks', parseInt(clicks) + 1);
    });
  });

  // --- REGISTRAR PEDIDO AO CLICAR NO BOTÃO DE FINALIZAR (WHATSAPP) ---
  const btnFinalizar = document.getElementById('finalizar');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      if (carrinho.length === 0) return;

      const pedidos = JSON.parse(localStorage.getItem('site_pedidos')) || [];
      const novoPedido = {
        id: '#' + Math.floor(Math.random() * 10000),
        cliente: 'Cliente via WhatsApp', // Como não tem login, usamos um genérico
        produtos: carrinho.map(item => item.nome).join(', '),
        status: 'Clicou no WhatsApp',
        data: new Date().toLocaleString()
      };

      pedidos.unshift(novoPedido); // Adiciona no topo da lista
      if (pedidos.length > 10) pedidos.pop(); // Mantém apenas os últimos 10
      localStorage.setItem('site_pedidos', JSON.stringify(pedidos));
    });
  }

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
  
  // Eventos do Modal
  const modal = document.getElementById('modal-produto');
  const btnFecharModal = document.getElementById('fechar-modal');
  
  if(btnFecharModal) btnFecharModal.addEventListener('click', fecharModal);
  if(modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
  });

  inicializarCarrossel(); // Inicializa o carrossel nos novos elementos
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
function inicializarCarrossel() {
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
}

// ----- FUNÇÕES DO MODAL -----
function abrirModal(produto, imagemUrl, precoTexto, detalhes) {
  const modal = document.getElementById('modal-produto');
  const modalImg = document.getElementById('modal-img');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalPreco = document.getElementById('modal-preco');
  const modalDescricao = document.getElementById('modal-descricao');
  const modalWhatsapp = document.getElementById('modal-whatsapp');

  if(modalImg) modalImg.src = imagemUrl;
  if(modalTitulo) modalTitulo.textContent = produto.nome;
  if(modalPreco) modalPreco.textContent = precoTexto;
  if(modalDescricao) modalDescricao.textContent = detalhes || 'Este produto é feito à mão com materiais de alta qualidade. Personalizamos cores e bordados conforme sua preferência.';
  
  const numero = localStorage.getItem('site_whatsapp_number') || '5599984893782';
  const texto = encodeURIComponent(`Olá! Gostaria de saber mais detalhes sobre o produto: ${produto.nome}`);
  if(modalWhatsapp) modalWhatsapp.href = `https://wa.me/${numero}?text=${texto}`;

  if(modal) modal.classList.add('aberto');
}

function fecharModal() {
  const modal = document.getElementById('modal-produto');
  if(modal) modal.classList.remove('aberto');
}
