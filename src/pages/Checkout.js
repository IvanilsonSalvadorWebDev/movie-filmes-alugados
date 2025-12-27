import { getCart, updateCartCount } from '../utils/storage.js';
import { navigate } from '../main.js';
import { showToast } from '../utils/toast.js';

export function renderCheckout() {
    const cartItems = getCart();
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    const container = document.createElement('div');
    container.className = 'checkout-page';

    container.innerHTML = `
        <h1>Finalizar Pagamento</h1>
        <div class="checkout-grid" style="display: grid; grid-template-columns: 1fr 350px; gap: 30px; margin-top: 20px;">
            
            <div class="payment-form profile-card">
                <h3>Dados de Pagamento</h3>
                <form id="pay-form" style="margin-top: 20px;">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label>Número do Cartão</label>
                        <input type="text" placeholder="0000 0000 0000 0000" class="form-control" required style="width: 100%; padding: 10px; margin-top: 5px;">
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <div style="flex: 1;">
                            <label>Validade</label>
                            <input type="text" placeholder="MM/AA" style="width: 100%; padding: 10px;">
                        </div>
                        <div style="flex: 1;">
                            <label>CVV</label>
                            <input type="text" placeholder="123" style="width: 100%; padding: 10px;">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 25px; padding: 15px;">
                        Pagar ${total.toFixed(2)}€
                    </button>
                </form>
            </div>

            <div class="checkout-summary profile-card">
                <h3>Resumo</h3>
                <p style="margin: 15px 0;">Total de filmes: <strong>${cartItems.length}</strong></p>
                <h2 style="color: var(--primary-orange)">${total.toFixed(2)}€</h2>
            </div>
        </div>
    `;

    // Lógica de Processamento da Compra
    container.querySelector('#pay-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Pegar o que está no carrinho e o que já está na biblioteca
        const cart = getCart();
        const library = JSON.parse(localStorage.getItem('rockmovies_rentals') || '[]');
        const history = JSON.parse(localStorage.getItem('rockmovies_history') || '[]');

        // 2. Mover itens do carrinho para a biblioteca e histórico
        const purchasedItems = cart.map(item => ({
            ...item,
            purchaseDate: Date.now(),
            // Se for aluguer, adiciona 48h de validade
            expiryDate: item.type === 'rent' ? Date.now() + (48 * 60 * 60 * 1000) : null
        }));

        const newLibrary = [...library, ...purchasedItems];
        const newHistory = [...history, ...purchasedItems];

        // 3. Salvar nos Storages
        localStorage.setItem('rockmovies_rentals', JSON.stringify(newLibrary));
        localStorage.setItem('rockmovies_history', JSON.stringify(newHistory));

        // 4. Limpar Carrinho
        localStorage.removeItem('rockmovies_cart');
        updateCartCount();

        // 5. Feedback Visual com Toast
        showToast('Pagamento aprovado! Os filmes já estão na sua biblioteca.', 'success');

        // 6. Redirecionar após um pequeno delay para o user ler a mensagem
        setTimeout(() => {
            navigate('meus-filmes');
        }, 1500);
    });

    return container;
}