const CART_KEY = 'rockmovies_cart';

export function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

/**
 * Adiciona ao carrinho e retorna um objeto de status
 * para ser usado com showToast() nos componentes.
 */
export function addToCart(movie, type, price) {
    const cart = getCart();
    
    // 1. Verifica se já existe o mesmo filme
    // Nota: Removi a verificação de tipo (type) para evitar que o user 
    // compre E alugue o mesmo filme ao mesmo tempo, o que não faria sentido.
    const exists = cart.find(item => item.id === movie.id);
    
    if (exists) {
        return { 
            success: false, 
            message: "Este filme já está no seu carrinho!" 
        };
    }

    const newItem = {
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        type: type, // 'rent' ou 'buy'
        price: price,
        genre_ids: movie.genre_ids || movie.genres?.map(g => g.id) || [], // Garante os IDs para o filtro
        addedAt: Date.now()
    };

    cart.push(newItem);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();

    return { 
        success: true, 
        message: `"${movie.title}" adicionado ao carrinho!` 
    };
}

export function removeFromCart(index) {
    const cart = getCart();
    const movieRemoved = cart[index];
    
    cart.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    
    return movieRemoved; // Retornamos o filme para usar o título no Toast se quisermos
}

export function updateCartCount() {
    const cart = getCart();
    const badge = document.querySelector('.cart-count');
    if (badge) badge.innerText = cart.length;
}