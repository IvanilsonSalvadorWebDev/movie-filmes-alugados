// src/utils/storage.js

const CART_KEY = 'rockmovies_cart';

export function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

export function addToCart(movie, type, price) {
    const cart = getCart();
    
    // Verifica se já existe o mesmo filme com o mesmo tipo (aluguel ou compra)
    const exists = cart.find(item => item.id === movie.id && item.type === type);
    
    if (exists) {
        alert("Este item já está no seu carrinho!");
        return;
    }

    const newItem = {
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        type: type, // 'rent' ou 'buy'
        price: price,
        addedAt: Date.now()
    };

    cart.push(newItem);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    alert(`"${movie.title}" adicionado ao carrinho!`);
}

export function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

// Função simples para atualizar o ícone do carrinho no menu lateral
export function updateCartCount() {
    const cart = getCart();
    const badge = document.querySelector('.cart-count');
    if (badge) badge.innerText = cart.length;
}