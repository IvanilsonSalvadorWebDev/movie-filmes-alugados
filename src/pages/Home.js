import { getPopularMovies, getMoviesByGenre } from '../utils/api.js';
import { createMovieCard } from '../components/MovieCard.js';

export async function renderHome(genreId = null) {
    const container = document.createElement('div');
    const title = genreId && genreId !== 'all' ? 'Resultados da Categoria' : 'Filmes Populares';
    
    container.innerHTML = `
        <h1 style="margin-bottom: 20px;">${title}</h1>
        <div id="movies-grid" class="movies-grid"></div>
    `;

    const grid = container.querySelector('#movies-grid');
    
    // Decidir qual função da API chamar
    const movies = (genreId && genreId !== 'all') 
        ? await getMoviesByGenre(genreId) 
        : await getPopularMovies();
    
    if (movies && movies.length > 0) {
        movies.forEach(movie => {
            grid.appendChild(createMovieCard(movie));
        });
    } else {
        grid.innerHTML = '<p>Nenhum filme encontrado nesta categoria.</p>';
    }

    return container;
}