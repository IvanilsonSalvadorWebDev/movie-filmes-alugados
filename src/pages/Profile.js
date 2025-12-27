import { showToast } from '../utils/toast.js';

export function renderProfile() {
    // 1. Carregamos os dados ORIGINAIS do localStorage para comparação posterior
    const userData = JSON.parse(localStorage.getItem('rockmovies_user') || '{}');
    const defaultUser = {
        name: "", email: "", nif: "", address: "", 
        cardNumber: "", cardExpiry: ""
    };
    
    // Este é o nosso estado de referência (Original)
    const originalUser = { ...defaultUser, ...userData };

    const history = JSON.parse(localStorage.getItem('rockmovies_history') || '[]');
    const rentals = JSON.parse(localStorage.getItem('rockmovies_rentals') || '[]');
    const totalSpent = history.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

    const container = document.createElement('div');
    container.className = 'profile-page-container';

    container.innerHTML = `
        <h1 style="margin-bottom: 30px;"><i class="fas fa-user-cog"></i> Definições de Conta</h1>
        
        <div style="display: grid; grid-template-columns: 1fr 350px; gap: 30px; align-items: start;">
            
            <div class="profile-main-content">
                <form id="profile-form">
                    <div class="profile-card" style="margin-bottom: 20px;">
                        <h3 style="margin-bottom: 20px;"><i class="fas fa-file-invoice"></i> Dados de Faturação</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div class="form-group">
                                <label>Nome Completo</label>
                                <input type="text" id="user-name" value="${originalUser.name}" class="profile-input">
                            </div>
                            <div class="form-group">
                                <label>E-mail</label>
                                <input type="email" id="user-email" value="${originalUser.email}" class="profile-input">
                            </div>
                            <div class="form-group">
                                <label>NIF (Opcional)</label>
                                <input type="text" id="user-nif" value="${originalUser.nif}" placeholder="123456789" class="profile-input">
                            </div>
                            <div class="form-group">
                                <label>Morada</label>
                                <input type="text" id="user-address" value="${originalUser.address}" placeholder="Rua, Cidade, CP" class="profile-input">
                            </div>
                        </div>
                    </div>

                    <div class="profile-card" style="margin-bottom: 20px;">
                        <h3 style="margin-bottom: 20px;"><i class="fas fa-credit-card"></i> Método de Pagamento Pré-definido</h3>
                        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px;">
                            <div class="form-group">
                                <label>Número do Cartão</label>
                                <input type="text" id="card-number" value="${originalUser.cardNumber}" placeholder="**** **** **** ****" class="profile-input">
                            </div>
                            <div class="form-group">
                                <label>Validade</label>
                                <input type="text" id="card-expiry" value="${originalUser.cardExpiry}" placeholder="MM/AA" class="profile-input">
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="btn-primary" style="width: 100%; padding: 15px;">
                        <i class="fas fa-save"></i> Guardar Todas as Alterações
                    </button>
                </form>

                <div class="profile-card" style="margin-top: 30px; border: 1px dashed var(--primary-orange);">
                    <h3><i class="fas fa-database"></i> Portabilidade de Dados</h3>
                    <p style="font-size: 0.9rem; color: #aaa; margin: 10px 0;">Exporte o seu backup completo.</p>
                    <button id="btn-export" class="btn-secondary" style="background: #333;">
                        <i class="fas fa-download"></i> Exportar Backup (.json)
                    </button>
                </div>
            </div>

            <aside class="profile-sidebar">
                <div class="profile-card stats-dashboard" style="background: linear-gradient(145deg, #1e1e1e, #2a2a2a);">
                    <h3 style="margin-bottom: 20px; color: var(--primary-orange);">Estatísticas</h3>
                    <div class="stat-box">
                        <p>Filmes na Biblioteca</p>
                        <h2>${rentals.length}</h2>
                    </div>
                    <div class="stat-box" style="margin-top: 15px;">
                        <p>Investimento Total</p>
                        <h2>${totalSpent.toFixed(2)}€</h2>
                    </div>
                </div>
            </aside>
        </div>
    `;

    // --- LÓGICA DE BACKUP ---
    container.querySelector('#btn-export').addEventListener('click', () => {
        const fullBackup = {
            user: JSON.parse(localStorage.getItem('rockmovies_user')),
            library: JSON.parse(localStorage.getItem('rockmovies_rentals')),
            history: JSON.parse(localStorage.getItem('rockmovies_history')),
            cart: JSON.parse(localStorage.getItem('rockmovies_cart')),
            exportedAt: new Date().toISOString()
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `rockmovies_backup_${new Date().toLocaleDateString()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showToast('Backup gerado!', 'success');
    });

    // --- LÓGICA DE SALVAMENTO COM COMPARAÇÃO ---
    container.querySelector('#profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Criamos o objeto com os valores ATUAIS dos inputs
        const updatedUser = {
            name: document.getElementById('user-name').value.trim(),
            email: document.getElementById('user-email').value.trim(),
            nif: document.getElementById('user-nif').value.trim(),
            address: document.getElementById('user-address').value.trim(),
            cardNumber: document.getElementById('card-number').value.trim(),
            cardExpiry: document.getElementById('card-expiry').value.trim()
        };

        // COMPARADOR: Verifica se o JSON do que está nos campos é igual ao JSON que carregámos no início
        if (JSON.stringify(updatedUser) === JSON.stringify(originalUser)) {
            showToast('Nenhuma alteração detectada para guardar.', 'info');
            return; // Bloqueia o salvamento
        }

        // Se chegou aqui, é porque algo mudou
        localStorage.setItem('rockmovies_user', JSON.stringify(updatedUser));
        
        // Atualizamos o originalUser para que, se o utilizador clicar de novo sem mudar nada, o bloqueio funcione
        Object.assign(originalUser, updatedUser);

        showToast('Perfil atualizado com sucesso!', 'success');
    });

    return container;
}