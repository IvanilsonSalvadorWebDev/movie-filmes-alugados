// src/pages/Search.js
import { searchMovies } from '../utils/api.js';
import { createMovieCard } from '../components/MovieCard.js';

export async function renderSearch(query) {
    const container = document.createElement('div');
    container.innerHTML = `
        <h1>Resultados para: "${query}"</h1>
        <div id="search-grid" class="movies-grid"></div>
    `;

    const grid = container.querySelector('#search-grid');
    const movies = await searchMovies(query);

    if (movies && movies.length > 0) {
        movies.forEach(movie => {
            const card = createMovieCard(movie);
            grid.appendChild(card);
        });
    } else {
        grid.innerHTML = '<p>Nenhum filme encontrado para esta pesquisa.</p>';
    }

    return container;
}