// src/utils/api.js

const API_KEY = '0b2bc4cea499b0be8de4fc2ac25c92c5';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const LANGUAGE = 'pt-BR';

/**
 * Busca filmes populares para a Home
 */
 
 export async function getPopularMovies() {
     const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${LANGUAGE}`);
     const data = await response.json();
     return data.results;
 }

/**
 * Busca detalhes de um filme específico por ID
 */
export async function getMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=${LANGUAGE}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar detalhes do filme:", error);
    }
}

/**
 * Pesquisa filmes por nome
 */
 export async function searchMovies(query) {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=${LANGUAGE}&query=${query}`);
    const data = await response.json();
    return data.results;
}

/**
 * Busca filmes por ID de gênero
 */
 export async function getMoviesByGenre(genreId) {
    const endpoint = genreId === 'all' ? '/movie/popular' : `/discover/movie?with_genres=${genreId}`;
    const response = await fetch(`${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}&language=${LANGUAGE}`);
    const data = await response.json();
    return data.results;
}

export { IMG_URL };