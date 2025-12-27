import { renderHome } from './pages/Home.js';
import { renderMovieDetails } from './pages/MovieDetails.js';
import { renderCart } from './pages/Cart.js';
import { updateCartCount } from './utils/storage.js';
import { renderSearch } from './pages/Search.js';
import { renderCheckout } from './pages/Checkout.js';
import { renderMyMovies } from './pages/MyMovies.js';
import { renderHistory } from './pages/History.js';
import { renderProfile } from './pages/Profile.js';

let currentPage = 'home'; 

function loadUser() {
    const user = JSON.parse(localStorage.getItem('rockmovies_user') || '{"name": "Visitante"}');
    const userDisplay = document.querySelector('.user-status');
    if (userDisplay) userDisplay.title = `Logado como: ${user.name}`;
}

const mainContent = document.getElementById('main-content');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

/**
 * Roteador Principal com Filtro Contextual
 */
export async function navigate(page, params = null) {
    currentPage = page; 
    
    // 1. Controle de UI: Esconder categorias no Perfil/Checkout/Histórico/Detalhes
    const categoriesBar = document.querySelector('.categories-bar');
    const hideCategories = ['perfil', 'checkout', 'historico', 'detalhes'].includes(page);
    if (categoriesBar) {
        categoriesBar.style.display = hideCategories ? 'none' : 'flex';
    }

    // 2. Feedback visual de carregamento
    mainContent.innerHTML = '<div class="loader">Carregando...</div>';

    try {
        let pageElement;

        switch (page) {
            case 'home':
                pageElement = await renderHome(params); // params = genreId
                break;
            case 'detalhes':
                pageElement = await renderMovieDetails(params); // params = movieId
                break;
            case 'carrinho':
                pageElement = renderCart();
                break;
            case 'pesquisa':
                pageElement = await renderSearch(params); // params = query string
                break;
            case 'checkout':
                pageElement = renderCheckout();
                break;
            case 'meus-filmes':
                // Converte params para objeto se for apenas string de pesquisa
                const myFilter = typeof params === 'string' ? { query: params } : params;
                pageElement = renderMyMovies(myFilter || {});
                break;
            case 'historico':
                pageElement = renderHistory(params); // params = query string
                break;
            case 'perfil':
                pageElement = renderProfile();
                break;
            default:
                mainContent.innerHTML = `<h1>404</h1><p>Página não encontrada.</p>`;
                return;
        }

        // 3. Renderização Final
        if (pageElement) {
            mainContent.innerHTML = '';
            mainContent.appendChild(pageElement);
            
            // Re-ativa os ouvintes de clique nos cards se estiver na loja
            if (page === 'home' || page === 'pesquisa') {
                setupHomeListeners();
            }
        }
    } catch (error) {
        console.error("Erro na navegação:", error);
        mainContent.innerHTML = `<p>Erro ao carregar a página.</p>`;
    }

    window.scrollTo(0, 0);
}

function setupHomeListeners() {
    document.querySelectorAll('.btn-detail').forEach(button => {
        button.addEventListener('click', (e) => {
            const movieId = e.currentTarget.getAttribute('data-id');
            navigate('detalhes', movieId);
        });
    });
}

function setupUI() {
    const searchInput = document.getElementById('search-input');

    // Pesquisa Dinâmica
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (currentPage === 'home' || currentPage === 'pesquisa') {
            // Na Home, esperamos o Enter (lógica global)
            return;
        } else {
            // Nas outras tabs, filtra em tempo real (lógica local)
            navigate(currentPage, query);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            if (currentPage === 'home' || currentPage === 'pesquisa') {
                navigate('pesquisa', searchInput.value);
            }
        }
    });

    // Categorias Contextuais
    document.querySelectorAll('.btn-category').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.btn-category.active')?.classList.remove('active');
            btn.classList.add('active');
            
            const genreId = btn.getAttribute('data-genre');
            
            if (currentPage === 'meus-filmes') {
                // Filtra apenas os teus filmes por essa categoria
                navigate('meus-filmes', { genreId: genreId });
            } else {
                // Pesquisa novos filmes na loja
                navigate('home', genreId);
            }
        });
    });

    // Menu Mobile
    menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

    // Navegação Sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelector('.nav-item.active')?.classList.remove('active');
            item.classList.add('active');
            const page = item.getAttribute('data-page');
            navigate(page);
            if (window.innerWidth <= 768) sidebar.classList.remove('open');
        });
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    setupUI();
    loadUser();
    updateCartCount();
    navigate('home');
});