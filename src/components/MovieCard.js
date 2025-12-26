// src/components/MovieCard.js
import { IMG_URL } from '../utils/api.js';

export function createMovieCard(movie) {
    const card = document.createElement('div');
    card.classList.add('movie-card');

    // Fallback para caso não haja imagem
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
                <button class="btn-detail" data-id="${movie.id}">Ver Mais</button>
                <button class="btn-orange btn-add-cart" data-id="${movie.id}">
                    <i class="fas fa-cart-plus"></i> Add
                </button>
            </div>
        </div>
    `;

    return card;
}