import { getCart, removeFromCart, updateCartCount } from '../utils/storage.js';
import { IMG_URL } from '../utils/api.js';
import { navigate } from '../main.js';
import { showToast } from '../utils/toast.js';

export function renderCart() {
    const cartItems = getCart();
    const container = document.createElement('div');
    
    // Cálculo do total usando reduce de forma segura
    const total = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

    container.innerHTML = `
        <h1 style="margin-bottom: 25px;">Meu Carrinho</h1>
        <div class="cart-container">
            <div class="cart-list">
                ${cartItems.length === 0 ? `
                    <div class="profile-card" style="text-align: center; padding: 50px;">
                        <i class="fas fa-shopping-basket" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                        <p>O seu carrinho está vazio.</p>
                        <button class="btn-primary btn-explore" style="margin-top: 20px;">Explorar Filmes</button>
                    </div>
                ` : ''}

                ${cartItems.map((item, index) => `
                    <div class="cart-item">
                        <img src="${IMG_URL}${item.poster}" alt="${item.title}" style="width: 70px; border-radius: 8px;">
                        
                        <div class="item-info" style="flex: 1; margin-left: 20px;">
                            <h3 style="font-size: 1.1rem; margin-bottom: 5px;">${item.title}</h3>
                            <span class="badge ${item.type}">${item.type === 'rent' ? 'Aluguel (48h)' : 'Compra Vitalícia'}</span>
                        </div>

                        <div class="item-price" style="font-weight: bold; font-size: 1.1rem; margin-right: 20px;">
                            ${(Number(item.price) || 0).toFixed(2)}€
                        </div>

                        <button class="btn-remove" data-index="${index}" data-title="${item.title}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                `).join('')}
            </div>

            ${cartItems.length > 0 ? `
                <div class="cart-summary">
                    <h3>Resumo do Pedido</h3>
                    <hr style="margin: 15px 0;">
                    
                    <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span>Itens (${cartItems.length}):</span>
                        <span>${total.toFixed(2)}€</span>
                    </div>

                    <div class="summary-row" style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 1.4rem;">
                        <span><strong>Total:</strong></span>
                        <strong style="color: var(--primary-orange)">${total.toFixed(2)}€</strong>
                    </div>

                    <button class="btn-primary btn-checkout" style="width: 100%; padding: 15px; font-size: 1rem;">
                        Finalizar Compra <i class="fas fa-arrow-right" style="margin-left: 10px;"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `;

    // Listeners de navegação
    const btnExplore = container.querySelector('.btn-explore');
    if (btnExplore) btnExplore.addEventListener('click', () => navigate('home'));

    const btnCheckout = container.querySelector('.btn-checkout');
    if (btnCheckout) btnCheckout.addEventListener('click', () => navigate('checkout'));

    // Lógica de remoção com feedback visual
    container.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            const title = e.currentTarget.dataset.title;
            
            removeFromCart(index);
            
            showToast(`"${title}" removido do carrinho.`, 'info');

            // Re-renderização rápida da página de carrinho
            const main = document.getElementById('main-content');
            main.innerHTML = '';
            main.appendChild(renderCart());

            // Chama a função global do storage para atualizar badges em toda a app
            updateCartCount(); 
        });
    });

    return container;
}