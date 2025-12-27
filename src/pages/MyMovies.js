import { IMG_URL } from '../utils/api.js';

export function renderMyMovies(params = {}) {
    // 1. Carregar dados do LocalStorage
    const library = JSON.parse(localStorage.getItem('rockmovies_rentals') || '[]');
    
    // 2. Aplicar Filtros (Contexto Local)
    let filtered = library;

    // Filtro por Texto
    if (params.query) {
        filtered = filtered.filter(movie => 
            movie.title.toLowerCase().includes(params.query.toLowerCase())
        );
    }

    // Filtro por Categoria (Importante: ignora se for 'all' ou null)
    if (params.genreId && params.genreId !== 'all') {
        const selectedGenre = parseInt(params.genreId);
        filtered = filtered.filter(movie => 
            movie.genre_ids && movie.genre_ids.includes(selectedGenre)
        );
    }

    // 3. Separar por Tipo (Compra vs Aluguer)
    const purchased = filtered.filter(m => m.type === 'buy');
    const rented = filtered.filter(m => m.type === 'rent');

    const container = document.createElement('div');
    container.className = 'library-page';

    // Função interna para gerar as grelhas
    const renderSection = (title, moviesList, emptyMsg) => {
        if (moviesList.length === 0 && !params.genreId && !params.query) return '';
        
        return `
            <div class="library-section" style="margin-bottom: 40px;">
                <h2 class="section-title" style="border-bottom: 2px solid var(--primary-orange); display: inline-block; margin-bottom: 20px;">
                    ${title} (${moviesList.length})
                </h2>
                <div class="movies-grid">
                    ${moviesList.length === 0 ? `<p style="color: #888;">${emptyMsg}</p>` : moviesList.map(movie => {
                        const isExpired = movie.type === 'rent' && (movie.expiryDate - Date.now() <= 0);
                        return `
                            <div class="movie-card" style="${isExpired ? 'opacity: 0.5; filter: grayscale(1);' : ''}">
                                <img src="${IMG_URL}${movie.poster}" class="movie-img">
                                <div class="movie-info">
                                    <h3 class="movie-title">${movie.title}</h3>
                                    <div class="badge-status" style="margin: 5px 0;">
                                        ${movie.type === 'buy' 
                                            ? '<span style="color: #2ecc71; font-size: 0.8rem;">● Vitalício</span>' 
                                            : `<span style="color: var(--primary-orange); font-size: 0.8rem;">● Expira em ${Math.max(0, Math.floor((movie.expiryDate - Date.now()) / 3600000))}h</span>`
                                        }
                                    </div>
                                    <button class="btn-primary" style="width: 100%;" ${isExpired ? 'disabled' : ''}>
                                        ${isExpired ? 'Expirado' : 'Assistir Agora'}
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    };

    container.innerHTML = `
        <div class="library-header" style="margin-bottom: 30px;">
            <h1>Minha Biblioteca</h1>
            <p>${params.query || (params.genreId && params.genreId !== 'all') ? 'A filtrar resultados...' : 'Todos os teus conteúdos adquiridos.'}</p>
        </div>
        ${renderSection('Filmes Comprados', purchased, 'Nenhum filme comprado encontrado para este filtro.')}
        ${renderSection('Filmes Alugados', rented, 'Nenhum aluguer ativo encontrado para este filtro.')}
    `;

    return container;
}