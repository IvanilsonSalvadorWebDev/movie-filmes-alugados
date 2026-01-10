import { IMG_URL } from '../utils/api.js';

export function renderMyMovies(params = {}) {
    // 1. Carregar dados (Certifique-se que a chave é a mesma usada no Checkout/Storage)
    const library = JSON.parse(localStorage.getItem('rockmovies_rentals') || '[]');
    
    // 2. Aplicar Filtros (Contexto Local)
    let filtered = library;

    // Filtro por Texto (Search input)
    if (params.query) {
        filtered = filtered.filter(movie => 
            movie.title.toLowerCase().includes(params.query.toLowerCase())
        );
    }

    // Filtro por Categoria
    // Corrigido: Garantimos que o ID é comparado corretamente
    if (params.genreId && params.genreId !== 'all') {
        const selectedGenre = parseInt(params.genreId);
        filtered = filtered.filter(movie => 
            movie.genre_ids && movie.genre_ids.map(Number).includes(selectedGenre)
        );
    }

    // 3. Separar por Tipo (Compra vs Aluguer)
    const purchased = filtered.filter(m => m.type === 'buy');
    const rented = filtered.filter(m => m.type === 'rent');

    const container = document.createElement('div');
    container.className = 'library-page';
    container.style.padding = '40px';

    // Função interna para gerar as grelhas
    const renderSection = (title, moviesList, emptyMsg) => {
        // Se a lista está vazia mas não há filtro ativo, não mostramos a seção (opcional)
        if (moviesList.length === 0 && !params.genreId && !params.query) return '';
        
        return `
            <div class="library-section" style="margin-bottom: 60px;">
                <h2 class="section-title" style="margin-bottom: 25px; font-family: 'Gilroy', sans-serif;">
                    ${title} <span style="color: var(--primary-orange); font-size: 1rem;">(${moviesList.length})</span>
                </h2>
                <div class="movies-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                    ${moviesList.length === 0 
                        ? `<p style="color: #888; grid-column: 1/-1;">${emptyMsg}</p>` 
                        : moviesList.map(movie => {
                            // Cálculo de Expiração
                            const now = Date.now();
                            const isExpired = movie.type === 'rent' && (movie.expiryDate - now <= 0);
                            
                            // Ajuste da Imagem (Trata se o poster já vier com a URL ou apenas o path)
                            const posterPath = movie.poster.startsWith('http') ? movie.poster : `${IMG_URL}${movie.poster}`;

                            return `
                                <div class="movie-card" style="background: #1a1a1a; border-radius: 12px; overflow: hidden; ${isExpired ? 'opacity: 0.5; filter: grayscale(1);' : ''}">
                                    <img src="${posterPath}" class="movie-img" style="width: 100%; aspect-ratio: 2/3; object-fit: cover;">
                                    <div class="movie-info" style="padding: 15px;">
                                        <h3 class="movie-title" style="font-size: 1rem; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                            ${movie.title}
                                        </h3>
                                        <div class="badge-status" style="margin-bottom: 15px;">
                                            ${movie.type === 'buy' 
                                                ? '<span style="color: #2ecc71; font-size: 0.8rem;"><i class="fas fa-check-circle"></i> Vitalício</span>' 
                                                : `<span style="color: var(--primary-orange); font-size: 0.8rem;"><i class="fas fa-clock"></i> Expira em ${Math.max(0, Math.floor((movie.expiryDate - now) / 3600000))}h</span>`
                                            }
                                        </div>
                                        <button class="btn-primary" style="width: 100%; padding: 10px; border-radius: 8px;" ${isExpired ? 'disabled' : ''}>
                                            ${isExpired ? 'Expirado' : '<i class="fas fa-play"></i> Assistir'}
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
        <div class="library-header" style="margin-bottom: 40px;">
            <h1 style="font-size: 2.5rem; font-weight: 900; margin-bottom: 10px;">Minha Biblioteca</h1>
            <p style="color: #aaa;">
                ${params.query || (params.genreId && params.genreId !== 'all') 
                    ? `Filtrando resultados para: <strong>${params.query || 'Categoria'}</strong>` 
                    : 'Gerencie seus filmes comprados e alugados.'}
            </p>
        </div>
        ${renderSection('Filmes Comprados', purchased, 'Você ainda não comprou nenhum filme.')}
        ${renderSection('Filmes Alugados', rented, 'Você não tem aluguéis ativos.')}
    `;

    return container;
}
