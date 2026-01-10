import { renderHome } from './pages/Home.js';
import { renderMovieDetails } from './pages/MovieDetails.js';
import { renderCart } from './pages/Cart.js';
import { updateCartCount } from './utils/storage.js';
import { renderSearch } from './pages/Search.js';
import { renderCheckout } from './pages/Checkout.js';
import { renderMyMovies } from './pages/MyMovies.js';
import { renderHistory } from './pages/History.js';
import { renderProfile } from './pages/Profile.js';
import { renderLogin } from './pages/Login.js';

let currentPage = 'home'; 

/**
 * Sincroniza visualmente a barra lateral e adapta o menu conforme o papel (User/Admin)
 */
function updateSidebarUI(page, user) {
    const isAdmin = user && user.role === 'admin';
    const cartIcon = document.querySelector('.cart-icon');

    if (cartIcon) {
        cartIcon.style.display = isAdmin ? 'none' : 'block';
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        const itemPage = item.getAttribute('data-page');
        
        if (isAdmin && ['meus-filmes', 'carrinho', 'historico'].includes(itemPage)) {
            item.style.display = 'none';
        } else if (item.id !== 'btn-logout') {
            item.style.display = 'flex';
        }

        item.classList.remove('active');
        const targetPage = (page === 'pesquisa') ? 'home' : page;
        if (itemPage === targetPage) item.classList.add('active');
    });
}

function loadUser() {
    const userData = localStorage.getItem('rockmovies_user');
    const userDisplay = document.querySelector('.user-status');
    const logoutBtn = document.getElementById('btn-logout'); 
    
    if (!userData) {
        if (userDisplay) {
            const userNameEl = userDisplay.querySelector('.user-name');
            if (userNameEl) userNameEl.textContent = "Visitante";
        }
        if (logoutBtn) logoutBtn.style.display = 'none';
        return null;
    }

    const user = JSON.parse(userData);
    if (userDisplay) {
        const userNameEl = userDisplay.querySelector('.user-name');
        if (userNameEl) userNameEl.textContent = user.name + (user.role === 'admin' ? ' (Admin)' : '');
    }
    if (logoutBtn) logoutBtn.style.display = 'flex'; 
    
    return user;
}

const mainContent = document.getElementById('main-content');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');

/**
 * Roteador Principal
 */
export async function navigate(page, params = null) {
    const user = loadUser();
    const isAdmin = user && user.role === 'admin';

    // Segurança: Admin não entra em páginas de compra
    const forbiddenForAdmin = ['carrinho', 'checkout', 'meus-filmes', 'historico'];
    if (isAdmin && forbiddenForAdmin.includes(page)) {
        return navigate('home'); 
    }

    // Segurança: Cliente precisa logar para páginas privadas
    const privatePages = ['checkout', 'perfil', 'meus-filmes', 'historico'];
    if (!user && privatePages.includes(page)) {
        sessionStorage.setItem('redirect_after_login', page);
        page = 'login';
    }

    currentPage = page; 
    updateSidebarUI(page, user);
    
    const categoriesBar = document.querySelector('.categories-bar');
    const hideCategories = ['perfil', 'checkout', 'historico', 'detalhes', 'login'].includes(page);
    if (categoriesBar) {
        categoriesBar.style.display = hideCategories ? 'none' : 'flex';
    }

    mainContent.innerHTML = '<div class="loader">Carregando...</div>';

    try {
        let pageElement;

        switch (page) {
            case 'login':
                pageElement = renderLogin(() => {
                    const freshUser = loadUser();
                    const destination = freshUser?.role === 'admin' ? 'home' : (sessionStorage.getItem('redirect_after_login') || 'home');
                    sessionStorage.removeItem('redirect_after_login');
                    navigate(destination);
                });
                break;
            case 'home':
                pageElement = await renderHome(params); 
                break;
            case 'detalhes':
                pageElement = await renderMovieDetails(params); 
                break;
            case 'carrinho':
                pageElement = renderCart();
                break;
            case 'pesquisa':
                pageElement = await renderSearch(params); 
                break;
            case 'checkout':
                pageElement = renderCheckout();
                break;
            case 'meus-filmes':
                pageElement = renderMyMovies(params || {});
                break;
            case 'historico':
                pageElement = renderHistory(params); 
                break;
            case 'perfil':
                pageElement = renderProfile();
                break;
            default:
                mainContent.innerHTML = `<h1>404</h1><p>Página não encontrada.</p>`;
                return;
        }

        if (pageElement) {
            mainContent.innerHTML = '';
            mainContent.appendChild(pageElement);
            // Configura os ouvintes de clique após o conteúdo estar no DOM
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

/**
 * Eventos para elementos da Home (Cards e Hero)
 */
function setupHomeListeners() {
    // 1. Ouvinte para o botão do HERO
    const heroBtn = document.querySelector('.hero-btn-main');
    if (heroBtn) {
        heroBtn.onclick = (e) => {
            e.preventDefault();
            const movieId = heroBtn.getAttribute('data-id');
            if (movieId) navigate('detalhes', movieId);
        };
    }

    // 2. Ouvintes para os botões de detalhes dos Cards na Grid
    document.querySelectorAll('.btn-detail').forEach(button => {
        button.onclick = (e) => {
            e.preventDefault();
            const movieId = e.currentTarget.getAttribute('data-id');
            if (movieId) navigate('detalhes', movieId);
        };
    });
}

function showConfirmPopup(message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal-overlay';
    modal.innerHTML = `
        <div class="custom-modal">
            <div class="modal-icon"><i class="fas fa-exclamation-circle"></i></div>
            <p>${message}</p>
            <div class="modal-buttons">
                <button class="btn-confirm">Sim, Sair</button>
                <button class="btn-cancel">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.btn-confirm').onclick = () => {
        onConfirm();
        modal.remove();
    };
    modal.querySelector('.btn-cancel').onclick = () => modal.remove();
}

function setupUI() {
    const searchInput = document.getElementById('search-input');
    const logoutBtn = document.getElementById('btn-logout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showConfirmPopup('Tem a certeza que deseja terminar a sessão?', () => {
                localStorage.removeItem('rockmovies_user');
                loadUser();
                navigate('home');
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                navigate('pesquisa', searchInput.value);
            }
        });
    }

    document.querySelectorAll('.btn-category').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.btn-category.active')?.classList.remove('active');
            btn.classList.add('active');
            const genreId = btn.getAttribute('data-genre');
            navigate(currentPage === 'meus-filmes' ? 'meus-filmes' : 'home', genreId);
        });
    });

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.id === 'btn-logout') return;
            navigate(item.getAttribute('data-page'));
            if (window.innerWidth <= 768 && sidebar) sidebar.classList.remove('open');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupUI();
    loadUser();
    updateCartCount();
    navigate('home'); 
});