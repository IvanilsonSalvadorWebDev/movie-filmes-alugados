// src/pages/History.js
export function renderHistory() {
    const history = JSON.parse(localStorage.getItem('rockmovies_rentals') || '[]');
    const container = document.createElement('div');
    
    // Adicionamos a classe section-content para manter as margens que definimos no CSS
    container.className = 'section-content';

    container.innerHTML = `
        <h1 style="margin: 20px 0;">Histórico de Transações</h1>
        <table class="history-table">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Filme</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                ${history.length === 0 
                    ? '<tr><td colspan="4" style="text-align:center; padding: 40px;">Nenhuma transação encontrada no seu histórico.</td></tr>' 
                    : history.slice().reverse().map(item => {
                        // PROTEÇÃO: Garante que o preço é um número antes de usar toFixed
                        const price = item.price || 0;
                        const date = item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : '---';
                        
                        return `
                            <tr>
                                <td>${date}</td>
                                <td><strong>${item.title || 'Filme Indisponível'}</strong></td>
                                <td>
                                    <span class="status-dot ${item.type || 'buy'}"></span> 
                                    ${item.type === 'rent' ? 'Aluguel' : 'Compra'}
                                </td>
                                <td>${Number(price).toFixed(2)}€</td>
                            </tr>
                        `;
                    }).join('')
                }
            </tbody>
        </table>
    `;

    return container;
}