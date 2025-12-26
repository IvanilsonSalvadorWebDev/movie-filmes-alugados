// src/pages/Cart.js
import { getCart, removeFromCart } from '../utils/storage.js';
import { IMG_URL } from '../utils/api.js';
import { navigate } from '../main.js'; // Importe o navigate aqui

export function renderCart() {
    const cartItems = getCart();
    const container = document.createElement('div');
    let total = cartItems.reduce((acc, item) => acc + item.price, 0);

    // 1. Primeiro definimos o HTML
    container.innerHTML = `
        <h1>Seu Carrinho</h1>
        <div class="cart-container">
            <div class="cart-list">
                ${cartItems.length === 0 ? '<p>O carrinho está vazio.</p>' : ''}
                ${cartItems.map((item, index) => `
                    <div class="cart-item">
                        <img src="${IMG_URL}${item.poster}" alt="${item.title}">
                        <div class="item-info">
                            <h3>${item.title}</h3>
                            <span>${item.type === 'rent' ? 'Aluguel (48h)' : 'Compra Vitalícia'}</span>
                        </div>
                        <div class="item-price">${item.price.toFixed(2)}€</div>
                        <button class="btn-remove" data-index="${index}"><i class="fas fa-trash"></i></button>
                    </div>
                `).join('')}
            </div>
            ${cartItems.length > 0 ? `
                <div class="cart-summary">
                    <h3>Resumo</h3>
                    <div class="summary-row"><span>Total:</span> <strong>${total.toFixed(2)}€</strong></div>
                    <button class="btn-orange btn-checkout">Finalizar Compra</button>
                </div>
            ` : ''}
        </div>
    `;

    // 2. AGORA buscamos o botão dentro do container já preenchido
    const btnCheckout = container.querySelector('.btn-checkout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => navigate('checkout'));
    }

    // Eventos de remoção
    container.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            removeFromCart(index);
            // Atualiza a tela limpando o main e reinjetando o renderCart
            const main = document.getElementById('main-content');
            main.innerHTML = '';
            main.appendChild(renderCart());
        });
    });

    return container;
}