// src/pages/History.js
export function renderHistory() {
    const history = JSON.parse(localStorage.getItem('rockmovies_rentals') || '[]');
    const container = document.createElement('div');

    container.innerHTML = `
        <h1>Histórico de Compras</h1>
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
                    ? '<tr><td colspan="4" style="text-align:center; padding: 20px;">Nenhuma transação encontrada.</td></tr>' 
                    : history.slice().reverse().map(item => `
                        <tr>
                            <td>${new Date(item.purchaseDate).toLocaleDateString()}</td>
                            <td><strong>${item.title}</strong></td>
                            <td>
                                <span class="status-dot ${item.type}"></span> 
                                ${item.type === 'rent' ? 'Aluguel' : 'Compra'}
                            </td>
                            <td>${item.price.toFixed(2)}€</td>
                        </tr>
                    `).join('')
                }
            </tbody>
        </table>
    `;

    return container;
}