import { getPopularMovies, getMoviesByGenre } from '../utils/api.js';
import { createMovieCard } from '../components/MovieCard.js';
import { createHero } from '../components/Hero.js';

export async function renderHome(genreId = null) {
const container = document.createElement('div');
container.className = 'home-container';

// 1. Decidir qual lista de filmes carregar
const isFiltered = genreId && genreId !== 'all';
const movies = isFiltered 
? await getMoviesByGenre(genreId) 
: await getPopularMovies();

// 2. Renderizar o HERO (Apenas na página inicial sem filtros)
if (!isFiltered && movies && movies.length > 0) {
const heroMovie = movies[0]; // O primeiro filme vira o destaque
container.appendChild(createHero(heroMovie));
}

// 3. Criar a área de conteúdo (Título + Grid)
const contentWrapper = document.createElement('div');
contentWrapper.style.padding = '0 40px 40px 40px'; // Alinhamento consistente

const titleText = isFiltered ? 'Resultados da Categoria' : 'Filmes Populares';

contentWrapper.innerHTML = `
<h1 style="margin: 40px 0 25px 0; font-family: 'Gilroy', sans-serif; font-weight: 900;">
${titleText}
</h1>
<div id="movies-grid" class="movies-grid"></div>
`;

const grid = contentWrapper.querySelector('#movies-grid');

// 4. Renderizar os Cards na Grid
if (movies && movies.length > 0) {
// Se houver Hero, começamos a grid a partir do segundo filme (index 1) para não repetir
const displayMovies = (!isFiltered) ? movies.slice(1) : movies;

displayMovies.forEach(movie => {
grid.appendChild(createMovieCard(movie));
});
} else {
grid.innerHTML = '<p style="color: var(--text-muted);">Nenhum filme encontrado nesta categoria.</p>';
}

container.appendChild(contentWrapper);

    return container;
    }
    