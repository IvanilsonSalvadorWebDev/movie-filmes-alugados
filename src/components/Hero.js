import { IMG_URL } from '../utils/api.js';
import { addToCart, updateCartCount } from '../utils/storage.js';
import { showToast } from '../utils/toast.js'; // Assumindo que moveu o showToast para utils

export function createHero(movie) {
    if (!movie) return document.createElement('div');

    const hero = document.createElement('section');
    hero.className = 'hero-section';

    // Usamos o backdrop_path para uma imagem horizontal e larga
    const backdrop = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : 'https://via.placeholder.com/1920x1080?text=Sem+Imagem';

    hero.innerHTML = `
        <div class="hero-overlay"></div>
        <div class="hero-background" style="background-image: url('${backdrop}')"></div>
        
        <div class="hero-content">
            <span class="hero-badge">Destaque da Semana</span>
            <h1 class="hero-title">${movie.title}</h1>
            <p class="hero-description">${movie.overview ? movie.overview.substring(0, 180) + '...' : 'Explora os melhores filmes e séries na RockMovies.'}</p>
            
            <div class="hero-actions">
                <button class="btn-primary hero-btn-main" data-id="${movie.id}">
                    <i class="fas fa-play"></i> Assistir Trailer
                </button>
                
                <div class="hero-cart-wrapper">
                    <button class="btn-outline hero-btn-cart">
                        <i class="fas fa-shopping-cart"></i> Adicionar
                    </button>
                </div>
            </div>
        </div>
    `;

    // Lógica do Dropdown (Semelhante ao MovieCard)
    const cartBtn = hero.querySelector('.hero-btn-cart');
    const dropdown = hero.querySelector('.hero-dropdown');

    cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => dropdown.classList.remove('active'));

    // Eventos de Compra
    hero.querySelector('.hero-opt-rent').addEventListener('click', () => {
        addToCart(movie, 'rent', 9.90);
        updateCartCount();
        showToast(`${movie.title} adicionado para alugar!`);
    });

    hero.querySelector('.hero-opt-buy').addEventListener('click', () => {
        addToCart(movie, 'buy', 19.90);
        updateCartCount();
        showToast(`${movie.title} adicionado à coleção!`);
    });

    return hero;
}

