import { getMovieDetails, IMG_URL, getMovieTrailer } from '../utils/api.js';
import { addToCart } from '../utils/storage.js';
import { showToast } from '../utils/toast.js';
import { navigate } from '../main.js'; 

export async function renderMovieDetails(movieId) {
    const movie = await getMovieDetails(movieId);
    const container = document.createElement('div');
    container.classList.add('movie-details-container');

    // Verifica se o utilizador logado é Admin
    const userData = localStorage.getItem('rockmovies_user');
    const user = userData ? JSON.parse(userData) : null;
    const isAdmin = user && user.role === 'admin';

    const backdrop = movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
        : '';

    container.innerHTML = `
        <button id="btn-back" class="btn-back">
            <i class="fas fa-arrow-left"></i> Voltar
        </button>
        
        <div class="details-header" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.4), var(--bg-light)), url('${backdrop}')">
            <div class="details-content">
                <img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}" class="details-poster">
                
                <div class="details-text">
                    <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                        <h1>${movie.title}</h1>
                        <button class="btn-primary" id="btn-trailer" style="background: var(--text-rock);">
                            <i class="fas fa-play"></i> Ver Trailer
                        </button>
                    </div>

                    <p class="overview">${movie.overview}</p>
                    
                    <div class="purchase-box">
                        ${isAdmin ? `
                            <div class="admin-view-notice">
                                <i class="fas fa-user-shield"></i>
                                <p>Modo de Administrador: Compra desativada.</p>
                            </div>
                        ` : `
                            <div class="price-option">
                                <p>Alugar (48h)</p>
                                <button class="btn-primary" id="btn-rent">9,90€</button>
                            </div>
                            <div class="price-option">
                                <p>Comprar</p>
                                <button class="btn-primary" id="btn-buy">19,90€</button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- EVENTOS DE CLIQUE ---

    // Voltar para a Home
    container.querySelector('#btn-back').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('home'); 
    });

    // Lógica do Trailer
    container.querySelector('#btn-trailer').addEventListener('click', async () => {
        const trailerUrl = await getMovieTrailer(movieId);
        if (trailerUrl) {
            openTrailerModal(trailerUrl);
        } else {
            showToast('Trailer não disponível para este filme.', 'info');
        }
    });

    // Se NÃO for admin, adiciona os eventos do carrinho
    if (!isAdmin) {
        const handleAdd = (type, price) => {
            const item = {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                genre_ids: movie.genres ? movie.genres.map(g => g.id) : []
            };

            const result = addToCart(item, type, price);

            if (result && result.success) {
                showToast(result.message, 'success');
                updateUIIcon();
            } else if (result && !result.success) {
                showToast(result.message, 'info');
            } else if (result === false) { 
                showToast('Este filme já está no seu carrinho.', 'info');
            }
        };

        container.querySelector('#btn-rent').addEventListener('click', () => {
            handleAdd('rent', 9.90);
        });

        container.querySelector('#btn-buy').addEventListener('click', () => {
            handleAdd('buy', 19.90);
        });
    }

    return container;
}

// Atualiza o contador visual no menu/header
function updateUIIcon() {
    const cart = JSON.parse(localStorage.getItem('rockmovies_cart') || '[]');
    const counter = document.querySelector('.cart-count');
    if (counter) counter.innerText = cart.length;
}

// Modal do Youtube/Trailer
function openTrailerModal(url) {
    const modal = document.getElementById('trailer-modal');
    const container = document.getElementById('trailer-container');
    
    if (!modal || !container) return;

    let embedUrl = url;
    if (url.includes('watch?v=')) {
        embedUrl = url.replace('watch?v=', 'embed/');
    }

    container.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
            container.innerHTML = ''; 
        };
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            container.innerHTML = '';
        }
    };
}