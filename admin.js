document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE LOGIN ---
    const loginScreen = document.getElementById('login-screen');
    const adminWrapper = document.getElementById('admin-wrapper');
    const formLogin = document.getElementById('form-login');
    const btnTogglePass = document.getElementById('btn-toggle-pass');
    const inputPass = document.getElementById('login-pass');

    // Comentado para forçar a tela de login sempre que recarregar a página
    // if (sessionStorage.getItem('admin_logado') === 'true') {
    //     mostrarAdmin();
    // }

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-user').value;
        const pass = inputPass.value;

        // Credenciais simples (Pode alterar aqui)
        const senhaSalva = localStorage.getItem('admin_password') || 'admin';
        if (user === 'admin' && pass === senhaSalva) {
            sessionStorage.setItem('admin_logado', 'true');
            mostrarAdmin();
        } else {
            document.getElementById('login-msg').style.display = 'block';
        }
    });

    btnTogglePass.addEventListener('click', () => {
        inputPass.type = inputPass.type === 'password' ? 'text' : 'password';
    });

    function mostrarAdmin() {
        document.body.classList.remove('login-body');
        document.body.classList.add('admin-body');
        loginScreen.style.display = 'none';
        adminWrapper.style.display = 'flex';
    }

    // Logout
    document.getElementById('btn-logout').addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('admin_logado');
        window.location.reload();
    });

    // --- NAVEGAÇÃO DO MENU ---
    const views = {
        dashboard: document.getElementById('view-dashboard'),
        produtos: document.getElementById('view-produtos'),
        pedidos: document.getElementById('view-pedidos'),
        config: document.getElementById('view-config')
    };

    const menus = {
        dashboard: document.getElementById('menu-dashboard'),
        produtos: document.getElementById('menu-produtos'),
        pedidos: document.getElementById('menu-pedidos'),
        config: document.getElementById('menu-config')
    };

    function switchView(viewName) {
        // Remove classe active de tudo
        Object.values(views).forEach(el => { if(el) el.classList.remove('active'); });
        Object.values(menus).forEach(el => { if(el) el.classList.remove('active'); });

        // Adiciona active no alvo
        if(views[viewName]) views[viewName].classList.add('active');
        if(menus[viewName]) menus[viewName].classList.add('active');

        // Atualiza Título
        const titles = {
            dashboard: 'Dashboard',
            produtos: 'Gerenciar Produtos',
            pedidos: 'Pedidos Recentes',
            config: 'Configurações'
        };
        const pageTitle = document.getElementById('page-title');
        if(pageTitle) pageTitle.textContent = titles[viewName];

        // Carrega dados específicos
        if(viewName === 'dashboard') carregarDashboard();
        if(viewName === 'pedidos') carregarPedidos();
        if(viewName === 'config') carregarConfig();
    }

    // Eventos de clique no menu
    Object.keys(menus).forEach(key => {
        if(menus[key]) {
            menus[key].addEventListener('click', (e) => {
                e.preventDefault();
                switchView(key);
            });
        }
    });

    // Funções de Dados das Telas
    function carregarDashboard() {
        document.getElementById('dash-total-produtos').textContent = produtos.length;
        document.getElementById('dash-visitantes').textContent = localStorage.getItem('site_visitantes') || 0;
        document.getElementById('dash-pedidos').textContent = localStorage.getItem('site_whatsapp_clicks') || 0;
    }

    function carregarPedidos() {
        const tbody = document.getElementById('tabela-pedidos');
        const pedidos = JSON.parse(localStorage.getItem('site_pedidos')) || [];
        tbody.innerHTML = '';
        
        if (pedidos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Nenhum pedido registrado ainda.</td></tr>';
            return;
        }

        pedidos.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${p.data}</td><td>${p.cliente}</td><td>${p.produtos}</td><td>${p.status}</td>`;
            tbody.appendChild(tr);
        });
    }

    function carregarConfig() {
        const currentNumber = localStorage.getItem('site_whatsapp_number') || '5599984893782';
        document.getElementById('config-whatsapp').value = currentNumber;
    }

    document.getElementById('btn-save-config').addEventListener('click', () => {
        const num = document.getElementById('config-whatsapp').value;
        if(num) {
            localStorage.setItem('site_whatsapp_number', num);
            alert('Número salvo com sucesso!');
        }
    });

    // Salvar Nova Senha
    const btnSavePass = document.getElementById('btn-save-pass');
    if(btnSavePass) {
        btnSavePass.addEventListener('click', () => {
            const novaSenha = document.getElementById('config-senha').value;
            if(novaSenha) {
                localStorage.setItem('admin_password', novaSenha);
                alert('Senha de administrador alterada com sucesso!');
                document.getElementById('config-senha').value = '';
            } else {
                alert('Por favor, digite uma senha.');
            }
        });
    }

    // Limpar Histórico de Pedidos
    const btnLimparPedidos = document.getElementById('btn-limpar-pedidos');
    if(btnLimparPedidos) {
        btnLimparPedidos.addEventListener('click', () => {
            if(confirm('Tem certeza que deseja apagar todo o histórico de pedidos?')) {
                localStorage.removeItem('site_pedidos');
                carregarPedidos(); // Recarrega a tabela (ficará vazia)
                alert('Histórico limpo com sucesso!');
            }
        });
    }

    const form = document.getElementById('form-produto');
    const tabela = document.getElementById('tabela-produtos');
    
    // Carregar produtos do localStorage
    let produtos = JSON.parse(localStorage.getItem('produtos_site')) || [];

    function salvarProdutos() {
        localStorage.setItem('produtos_site', JSON.stringify(produtos));
        renderizarTabela();
    }

    function renderizarTabela() {
        tabela.innerHTML = '';
        produtos.forEach((produto, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${produto.imagem || 'imagens/toalha.jpg'}" width="50" style="border-radius:5px"></td>
                <td>${produto.nome}</td>
                <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                <td>${produto.secao === 'catalogo' ? 'Catálogo' : 'Galeria'}</td>
                <td>
                    <button onclick="editarProduto(${index})" class="action-btn edit-btn">Editar</button>
                    <button onclick="deletarProduto(${index})" class="action-btn delete-btn">Excluir</button>
                </td>
            `;
            tabela.appendChild(tr);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const preco = parseFloat(document.getElementById('preco').value);
        const imagemInput = document.getElementById('imagem');
        const secao = document.getElementById('secao').value;
        const detalhes = document.getElementById('detalhes').value;
        const editIndex = document.getElementById('edit-index').value;

        const salvarNoLocalStorage = (imagemBase64) => {
            const novoProduto = {
                nome,
                preco,
                imagem: imagemBase64,
                secao,
                detalhes
            };

            if (editIndex !== '') {
                // Atualizar existente
                produtos[editIndex] = novoProduto;
                alert('Produto atualizado com sucesso!');
            } else {
                // Criar novo
                produtos.push(novoProduto);
                alert('Produto cadastrado com sucesso!');
            }

            salvarProdutos();
            resetarFormulario();
        };

        if (imagemInput.files && imagemInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                salvarNoLocalStorage(e.target.result);
            };
            reader.readAsDataURL(imagemInput.files[0]);
        } else {
            // Se não selecionou nova imagem
            let imagemFinal = 'imagens/toalha.jpg'; // Padrão
            if (editIndex !== '') {
                imagemFinal = produtos[editIndex].imagem;
            }
            salvarNoLocalStorage(imagemFinal);
        }
    });

    function resetarFormulario() {
        form.reset();
        document.getElementById('edit-index').value = '';
        document.getElementById('btn-submit').textContent = 'Salvar Produto';
        document.getElementById('btn-cancel').style.display = 'none';
        document.getElementById('preview-imagem').style.display = 'none';
        document.getElementById('preview-imagem').src = '';
    }

    document.getElementById('btn-cancel').addEventListener('click', resetarFormulario);

    window.editarProduto = (index) => {
        const produto = produtos[index];
        document.getElementById('nome').value = produto.nome;
        document.getElementById('preco').value = produto.preco;
        // Não podemos definir o value de um input file por segurança
        // document.getElementById('imagem').value = produto.imagem;
        document.getElementById('secao').value = produto.secao;
        document.getElementById('detalhes').value = produto.detalhes || '';
        
        document.getElementById('edit-index').value = index;
        document.getElementById('btn-submit').textContent = 'Atualizar Produto';
        document.getElementById('btn-cancel').style.display = 'inline-block';

        const preview = document.getElementById('preview-imagem');
        if (produto.imagem) {
            preview.src = produto.imagem;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
        
        document.querySelector('.admin-content').scrollTop = 0; // Rola para o topo
    };

    window.deletarProduto = (index) => {
        if(confirm('Tem certeza que deseja excluir este produto?')) {
            produtos.splice(index, 1);
            salvarProdutos();
        }
    };

    // Se não houver produtos, carrega alguns de exemplo (opcional, para teste)
    if (produtos.length === 0) {
        produtos = [
            { 
                nome: 'Bordado Floral', 
                preco: 35.00, 
                imagem: 'imagens/toalha.jpg', 
                secao: 'galeria',
                detalhes: 'Lindo bordado floral feito à mão em toalha de algodão egípcio.'
            },
            { 
                nome: 'Kit Bebê', 
                preco: 0, 
                imagem: 'imagens/kit-bebe.jpg', 
                secao: 'catalogo',
                detalhes: 'Kit completo com fralda, toalha e manta personalizada.'
            }
        ];
        salvarProdutos();
    }

    renderizarTabela();
});