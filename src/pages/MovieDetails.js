// src/pages/MovieDetails.js
import { getMovieDetails, IMG_URL } from '../utils/api.js';
import { addToCart } from '../utils/storage.js';

export async function renderMovieDetails(movieId) {
    const movie = await getMovieDetails(movieId);
    const container = document.createElement('div');
    container.classList.add('movie-details-container');

    const backdrop = movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
        : '';

    container.innerHTML = `
        <button id="btn-back" class="btn-back"><i class="fas fa-arrow-left"></i> Voltar</button>
        <div class="details-header" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.3), var(--bg-light)), url('${backdrop}')">
            <div class="details-content">
                <img src="${IMG_URL}${movie.poster_path}" alt="${movie.title}" class="details-poster">
                <div class="details-text">
                    <h1>${movie.title}</h1>
                    <p class="overview">${movie.overview}</p>
                    <div class="purchase-box">
                        <div class="price-option">
                            <p>Alugar (48h)</p>
                            <button class="btn-orange" id="btn-rent">9,90€</button>
                        </div>
                        <div class="price-option">
                            <p>Comprar</p>
                            <button class="btn-orange" id="btn-buy">19,90€</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Eventos de Clique
    container.querySelector('#btn-rent').addEventListener('click', () => {
        addToCart(movie, 'rent', 9.90);
    });

    container.querySelector('#btn-buy').addEventListener('click', () => {
        addToCart(movie, 'buy', 19.90);
    });

    return container;
}