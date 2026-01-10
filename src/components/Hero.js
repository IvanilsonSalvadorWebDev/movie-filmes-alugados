import { IMG_URL } from '../utils/api.js';

export function createHero(movie) {
    if (!movie) return document.createElement('div');

    const hero = document.createElement('section');
    hero.className = 'hero-section';

    // Imagem horizontal (backdrop)
    const backdrop = movie.backdrop_path 
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
        : 'https://via.placeholder.com/1920x1080?text=Sem+Imagem';

    hero.innerHTML = `
        <div class="hero-overlay"></div>
        <div class="hero-background" style="background-image: url('${backdrop}')"></div>
        
        <div class="hero-content">
            <span class="hero-badge">Destaque da Semana</span>
            <h1 class="hero-title">${movie.title}</h1>
            <p class="hero-description">
                ${movie.overview ? movie.overview.substring(0, 160) + '...' : 'Explora os melhores filmes e séries na RockMovies.'}
            </p>
            
            <div class="hero-actions">
                <button class="btn-primary hero-btn-main" data-id="${movie.id}">
                    <i class="fas fa-info-circle"></i> Ver Detalhes
                </button>
            </div>
        </div>
    `;

    // O listener de clique será gerenciado pelo Roteador (navigate) 
    // através da função setupHomeListeners que configuramos anteriormente.

    return hero;
}