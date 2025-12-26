// src/pages/Checkout.js
import { getCart } from '../utils/storage.js';
import { navigate } from '../main.js';

export function renderCheckout() {
    const cartItems = getCart();
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);

    const container = document.createElement('div');
    container.classList.add('checkout-container');

    container.innerHTML = `
        <h1>Finalizar Aluguel/Compra</h1>
        <div class="checkout-grid">
            <div class="checkout-form">
                <h3>Dados de Pagamento (Simulado)</h3>
                <form id="payment-form">
                    <div class="form-group">
                        <label>Nome no Cartão</label>
                        <input type="text" placeholder="Como no cartão" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Número do Cartão</label>
                            <input type="text" placeholder="0000 0000 0000 0000" required>
                        </div>
                        <div class="form-group">
                            <label>Validade</label>
                            <input type="text" placeholder="MM/AA" required>
                        </div>
                    </div>
                    <button type="submit" class="btn-orange btn-pay">Confirmar Pagamento de ${total.toFixed(2)}€</button>
                </form>
            </div>

            <div class="checkout-summary">
                <h3>Itens (${cartItems.length})</h3>
                <ul class="summary-list">
                    ${cartItems.map(item => `
                        <li>${item.title} <span class="price">${item.price.toFixed(2)}€</span></li>
                    `).join('')}
                </ul>
                <hr>
                <div class="summary-total">Total: <strong>${total.toFixed(2)}€</strong></div>
            </div>
        </div>
    `;

    // Lógica de finalização
    container.querySelector('#payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        processPurchase(cartItems);
    });

    return container;
}

function processPurchase(items) {
    // 1. Pegar o que já existe de alugados
    const currentRentals = JSON.parse(localStorage.getItem('rockmovies_rentals') || '[]');
    
    // 2. Adicionar novos itens com data de expiração (se for aluguel)
    const newRentals = items.map(item => ({
        ...item,
        purchaseDate: Date.now(),
        expiryDate: item.type === 'rent' ? Date.now() + (48 * 60 * 60 * 1000) : null
    }));

    const updatedLibrary = [...currentRentals, ...newRentals];
    
    // 3. Salvar na biblioteca e limpar carrinho
    localStorage.setItem('rockmovies_rentals', JSON.stringify(updatedLibrary));
    localStorage.removeItem('rockmovies_cart');
    
    alert('Pagamento aprovado! Os filmes já estão na sua biblioteca.');
    navigate('meus-filmes');
}