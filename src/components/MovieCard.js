// src/components/MovieCard.js
import { IMG_URL } from '../utils/api.js';
import { addToCart, updateCartCount } from '../utils/storage.js';

/**
 * Cria uma notificação toast temporária na tela
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    // Remove o toast após 3 segundos
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

export function createMovieCard(movie) {
    const card = document.createElement('div');
    card.classList.add('movie-card');

    const poster = movie.poster_path 
        ? `${IMG_URL}${movie.poster_path}` 
        : 'https://via.placeholder.com/500x750?text=Sem+Poster';

    card.innerHTML = `
        <img src="${poster}" alt="${movie.title}" class="movie-img">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-prices">
                <span>Aluguel: <strong>9,90€</strong></span>
                <span>Compra: <strong>19,90€</strong></span>
            </div>
            <div class="movie-actions">
                <button class="btn-detail btn-secondary" data-id="${movie.id}">Ver Mais</button>
                
                <div class="cart-menu-container">
                    <button class="btn-orange btn-add-cart" data-id="${movie.id}">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                    
                    <div class="cart-options-dropdown">
                        <button class="opt-rent">
                            Alugar <span>9,90€</span>
                        </button>
                        <button class="opt-buy">
                            Comprar <span>19,90€</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const cartBtn = card.querySelector('.btn-add-cart');
    const dropdown = card.querySelector('.cart-options-dropdown');

    // 1. Abrir/Fechar menu
    cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.cart-options-dropdown.active').forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.toggle('active');
    });

    // 2. Fechar ao clicar fora
    document.addEventListener('click', () => dropdown.classList.remove('active'));

    // 3. Ações sem alert()
    card.querySelector('.opt-rent').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(movie, 'aluguel', 9.90);
        updateCartCount(); // Atualiza o ícone do carrinho no header
        dropdown.classList.remove('active');
        showToast(`${movie.title} adicionado para alugar!`);
    });

    card.querySelector('.opt-buy').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(movie, 'compra', 19.90);
        updateCartCount(); 
        dropdown.classList.remove('active');
        showToast(`${movie.title} adicionado à coleção!`);
    });

    return card;
}