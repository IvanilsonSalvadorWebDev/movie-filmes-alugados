import { renderHome } from './pages/Home.js';
import { renderMovieDetails } from './pages/MovieDetails.js';
import { renderCart } from './pages/Cart.js';
import { updateCartCount } from './utils/storage.js';
import { renderSearch } from './pages/Search.js';
import { renderCheckout } from './pages/Checkout.js';
import { renderMyMovies } from './pages/MyMovies.js';
import { renderHistory } from './pages/History.js'; // Importar Histórico
import { renderProfile } from './pages/Profile.js'; // Importar Perfil

function loadUser() {
    const user = JSON.parse(localStorage.getItem('rockmovies_user') || '{"name": "Visitante"}');
    const userDisplay = document.querySelector('.user-status');
    if (userDisplay) {
        // Isso assume que você tem um elemento para o nome no topo
        userDisplay.title = `Logado como: ${user.name}`;
    }
}

const mainContent = document.getElementById('main-content');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

/**
 * Roteador Principal
 */
export async function navigate(page, params = null) {
    // 1. Efeito de carregamento e limpeza
    mainContent.innerHTML = '<div class="loader">Carregando...</div>';
    
    // 2. Lógica de Troca de Páginas
    switch (page) {
        case 'home':
            const home = await renderHome(params); // params aqui será o genreId
            mainContent.innerHTML = '';
            mainContent.appendChild(home);
            setupHomeListeners(); 
            break;

        case 'detalhes':
            const details = await renderMovieDetails(params);
            mainContent.innerHTML = '';
            mainContent.appendChild(details);
            document.getElementById('btn-back').addEventListener('click', () => navigate('home'));
            break;

        case 'carrinho':
            mainContent.innerHTML = '';
            mainContent.appendChild(renderCart());
            break;

        case 'pesquisa':
            const searchPage = await renderSearch(params);
            mainContent.innerHTML = '';
            mainContent.appendChild(searchPage);
            setupHomeListeners(); 
            break;

        case 'checkout':
            mainContent.innerHTML = '';
            mainContent.appendChild(renderCheckout());
            break;

        case 'meus-filmes':
            mainContent.innerHTML = '';
            mainContent.appendChild(renderMyMovies());
            break;

        case 'historico': // ADICIONE ESTE CASO
            mainContent.innerHTML = '';
            mainContent.appendChild(renderHistory());
            break;

        case 'perfil': // ADICIONE ESTE CASO
            mainContent.innerHTML = '';
            mainContent.appendChild(renderProfile());
            break;

        default:
            mainContent.innerHTML = `<h1>Página não encontrada</h1><p>A rota "${page}" ainda não foi mapeada.</p>`;
    }
    
    window.scrollTo(0, 0); // Volta ao topo em cada troca
}

/**
 * Ouvintes para os Cards da Home
 */
function setupHomeListeners() {
    document.querySelectorAll('.btn-detail').forEach(button => {
        button.addEventListener('click', (e) => {
            const movieId = e.currentTarget.getAttribute('data-id');
            navigate('detalhes', movieId);
        });
    });
}

/**
 * Lógica de Interface (Sidebar e Menu)
 */
function setupUI() {

    const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim() !== '') {
        navigate('pesquisa', searchInput.value);
    }
});

// Dentro de setupUI no main.js
const categoryButtons = document.querySelectorAll('.btn-category');

categoryButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        // Estilo visual do botão ativo
        document.querySelector('.btn-category.active')?.classList.remove('active');
        btn.classList.add('active');

        const genreId = btn.getAttribute('data-genre');
        
        // Se estivermos em outra página, voltamos para a Home com o filtro
        navigate('home', genreId);
    });
});

    // Toggle Hambúrguer
    menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

    // Cliques nos itens de navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            // Estilo Ativo
            document.querySelector('.nav-item.active')?.classList.remove('active');
            item.classList.add('active');

            // Navegação
            const page = item.getAttribute('data-page');
            navigate(page);

            // Fechar sidebar no mobile após clicar
            if (window.innerWidth <= 768) sidebar.classList.remove('open');
        });
    });
}

// Inicialização Geral
document.addEventListener('DOMContentLoaded', () => {
    setupUI();
    loadUser();
    updateCartCount();
    navigate('home');
});