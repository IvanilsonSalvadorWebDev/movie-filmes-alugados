import { getCart, updateCartCount, removeFromCart } from '../utils/storage.js';
import { navigate } from '../main.js';
import { showToast } from '../utils/toast.js';
import { IMG_URL } from '../utils/api.js';

export function renderCheckout() {
    const cartItems = getCart();
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    const container = document.createElement('div');
    container.className = 'checkout-page-wrapper';

    // Lógica para gerar o leque (fan-out) idêntico à imagem
    const movieStackHTML = cartItems.map((item, index) => {
        const posterSrc = item.poster_path || item.poster; 
        const fullURL = `${IMG_URL}${posterSrc}`;
        
        const totalItems = cartItems.length;
        const middleIndex = (totalItems - 1) / 2;
        
        // Cálculos de transformação para o arco perfeito
        const rotation = totalItems > 1 ? (index - middleIndex) * 15 : 0;
        const translateY = Math.abs(index - middleIndex) * 15;
        const translateX = (index - middleIndex) * 10;

        return `
            <div class="stack-card" 
                 style="--rotation: ${rotation}deg; --translateY: ${translateY}px; --translateX: ${translateX}px; z-index: ${index};">
                <img src="${fullURL}" alt="${item.title}" onerror="this.src='https://via.placeholder.com/150x225?text=Filme'">
                <button class="remove-stack-item" data-id="${item.id}">×</button>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <style>
            
        </style>

        <div class="checkout-grid">
            <div class="payment-section">
                <div class="payment-card-glass">
                    <h3>Payment Details</h3>
                    <form id="pay-form">
                        <div class="form-group">
                            <label>Cardholder Name</label>
                            <input type="text" placeholder="John Doe" required>
                        </div>
                        <div class="form-group">
                            <label>Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Expiry Date</label>
                                <input type="text" placeholder="MM/AA" required>
                            </div>
                            <div class="form-group">
                                <label>CVV</label>
                                <input type="text" placeholder="123" required>
                            </div>
                        </div>
                        <button type="submit" class="btn-card-pay">Card Mard</button>
                    </form>
                </div>
            </div>

            <div class="summary-section">
                <h2 class="summary-title" style="margin-bottom: 60px; font-weight: 400; opacity: 0.8;">Summary</h2>
                <div class="movie-fan-display">
                    ${movieStackHTML || '<p>Seu carrinho está vazio</p>'}
                </div>
                <div class="summary-footer" style="text-align: center;">
                    <p style="color: #888;">Total de filmes: ${cartItems.length}</p>
                    <h1 class="grand-total">${total.toFixed(2).replace('.', ',')}€</h1>
                </div>
            </div>
        </div>
    `;

    // Ativação dos botões de remover
    container.querySelectorAll('.remove-stack-item').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const id = btn.getAttribute('data-id');
            removeFromCart(id); 
            updateCartCount();
            navigate('checkout'); 
        };
    });

    // Submissão do formulário
    container.querySelector('#pay-form').onsubmit = (e) => {
        e.preventDefault();
        showToast('Pagamento processado com sucesso!');
        localStorage.removeItem('rockmovies_cart');
        updateCartCount();
        navigate('meus-filmes');
    };

    return container;
}