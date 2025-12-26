// src/pages/MyMovies.js
import { IMG_URL } from '../utils/api.js';

export function renderMyMovies() {
    const library = JSON.parse(localStorage.getItem('rockmovies_rentals') || '[]');
    const container = document.createElement('div');
    
    container.innerHTML = `
        <h1>Minha Biblioteca</h1>
        <p style="margin-bottom: 20px;">Aqui esto os teus filmes comprados e alugados.</p>
        <div class="movies-grid" id="library-grid">
            ${library.length === 0 ? '<p>Ainda não tens filmes. Começa a explorar o catálogo!</p>' : ''}
        </div>
    `;

    const grid = container.querySelector('#library-grid');

    library.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        // Lógica de Expiração
        let statusHTML = '';
        if (movie.type === 'buy') {
            statusHTML = `<span class="badge buy">Vitalício</span>`;
        } else {
            const now = Date.now();
            const timeLeft = movie.expiryDate - now;

            if (timeLeft <= 0) {
                statusHTML = `<span class="badge expired">Expirado</span>`;
                movieCard.style.opacity = '0.5'; // Deixa o card cinzento
            } else {
                const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                statusHTML = `<span class="badge rent">Expira em: ${hoursLeft}h</span>`;
            }
        }

        movieCard.innerHTML = `
            <img src="${IMG_URL}${movie.poster}" alt="${movie.title}" class="movie-img">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                ${statusHTML}
                <button class="btn-orange" style="width:100%; margin-top:10px;" 
                    ${movie.expiryDate && (movie.expiryDate - Date.now() <= 0) ? 'disabled' : ''}>
                    Assistir Agora
                </button>
            </div>
        `;
        grid.appendChild(movieCard);
    });

    return container;
}