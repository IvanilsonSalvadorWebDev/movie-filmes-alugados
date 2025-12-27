import { showToast } from '../utils/toast.js';

export function renderProfile() {
    // 1. Carregar dados e verificar se é Administrador
    const userData = JSON.parse(localStorage.getItem('rockmovies_user') || '{}');
    const isAdmin = userData.email === 'admin@rockmovies.com'; 
    
    const defaultUser = {
        name: "", email: "", nif: "", address: "", 
        cardNumber: "", cardExpiry: ""
    };
    const originalUser = { ...defaultUser, ...userData };

    const history = JSON.parse(localStorage.getItem('rockmovies_history') || '[]');
    const rentals = JSON.parse(localStorage.getItem('rockmovies_rentals') || '[]');
    const totalSpent = history.reduce((acc, item) => acc + (Number(item.price) || 0), 0);

    const container = document.createElement('div');
    container.className = 'profile-page-container';

    container.innerHTML = `
        <h1 style="margin-bottom: 30px;"><i class="fas fa-user-shield"></i> Painel de ${isAdmin ? 'Administração' : 'Conta'}</h1>
        
        <div style="display: grid; grid-template-columns: 1fr 350px; gap: 30px; align-items: start;">
            
            <div class="profile-main-content">
                
                ${isAdmin ? `
                <div class="profile-card" style="margin-bottom: 25px; border-top: 4px solid var(--primary-orange);">
                    <h3><i class="fas fa-inbox"></i> Mensagens Recebidas</h3>
                    <div id="admin-messages-list" style="margin-top: 15px; max-height: 400px; overflow-y: auto;">
                        </div>
                </div>
                ` : ''}

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
                        <h3 style="margin-bottom: 20px;"><i class="fas fa-credit-card"></i> Pagamento</h3>
                        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px;">
                            <input type="text" id="card-number" value="${originalUser.cardNumber}" placeholder="Número do Cartão" class="profile-input">
                            <input type="text" id="card-expiry" value="${originalUser.cardExpiry}" placeholder="MM/AA" class="profile-input">
                        </div>
                    </div>

                    <button type="submit" class="btn-primary" style="width: 100%; padding: 15px;">
                        <i class="fas fa-save"></i> Guardar Alterações de Perfil
                    </button>
                </form>

                ${!isAdmin ? `
                <div class="profile-card" style="margin-top: 30px;">
                    <h3><i class="fas fa-envelope-open-text"></i> Enviar Mensagem ao Admin</h3>
                    <form id="contact-admin-form" style="margin-top: 15px;">
                        <input type="text" id="contact-subject" placeholder="Assunto" class="profile-input" style="margin-bottom: 10px;" required>
                        <textarea id="contact-message" placeholder="A sua mensagem ou dúvida..." class="profile-input" style="height: 100px; resize: none; margin-bottom: 10px;" required></textarea>
                        <button type="submit" class="btn-secondary" style="width: 100%;">Enviar para Suporte</button>
                    </form>
                </div>
                ` : ''}

                <div class="profile-card" style="margin-top: 30px; border: 1px dashed #444;">
                    <h3><i class="fas fa-database"></i> Portabilidade</h3>
                    <button id="btn-export" class="btn-secondary" style="margin-top: 10px; background: #333;">
                        <i class="fas fa-download"></i> Exportar Backup (.json)
                    </button>
                </div>
            </div>

            <aside class="profile-sidebar">
                <div class="profile-card stats-dashboard" style="background: linear-gradient(145deg, #1e1e1e, #2a2a2a);">
                    <h3 style="color: var(--primary-orange);">Estatísticas</h3>
                    <div class="stat-box" style="margin-top: 15px;">
                        <p>Total Gasto</p>
                        <h2>${totalSpent.toFixed(2)}€</h2>
                    </div>
                    <div class="stat-box" style="margin-top: 15px;">
                        <p>Biblioteca</p>
                        <h2>${rentals.length} Filmes</h2>
                    </div>
                </div>
            </aside>
        </div>
    `;

    // --- LÓGICA: CONTACTAR ADMIN ---
    if (!isAdmin) {
        container.querySelector('#contact-admin-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const messages = JSON.parse(localStorage.getItem('rockmovies_admin_inbox') || '[]');
            const newMessage = {
                id: Date.now(),
                name: originalUser.name || 'Anónimo',
                email: originalUser.email,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value,
                date: new Date().toLocaleString()
            };
            messages.push(newMessage);
            localStorage.setItem('rockmovies_admin_inbox', JSON.stringify(messages));
            showToast('Mensagem enviada com sucesso!', 'success');
            e.target.reset();
        });
    }

    // --- LÓGICA: LISTAR MENSAGENS (VISÃO ADMIN) ---
    if (isAdmin) {
        const inbox = JSON.parse(localStorage.getItem('rockmovies_admin_inbox') || '[]');
        const listContainer = container.querySelector('#admin-messages-list');
        if (inbox.length === 0) {
            listContainer.innerHTML = '<p style="color: #666;">Nenhuma mensagem pendente.</p>';
        } else {
            listContainer.innerHTML = inbox.reverse().map(msg => `
                <div style="background: #222; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid var(--primary-orange);">
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #888;">
                        <span>De: ${msg.name} (${msg.email})</span>
                        <span>${msg.date}</span>
                    </div>
                    <h4 style="margin: 5px 0;">${msg.subject}</h4>
                    <p style="font-size: 0.9rem; color: #ccc;">${msg.message}</p>
                </div>
            `).join('');
        }
    }

    // --- LÓGICA: SALVAR PERFIL ---
    container.querySelector('#profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedUser = {
            name: document.getElementById('user-name').value.trim(),
            email: document.getElementById('user-email').value.trim(),
            nif: document.getElementById('user-nif').value.trim(),
            address: document.getElementById('user-address').value.trim(),
            cardNumber: document.getElementById('card-number').value.trim(),
            cardExpiry: document.getElementById('card-expiry').value.trim()
        };

        if (JSON.stringify(updatedUser) === JSON.stringify(originalUser)) {
            showToast('Nenhuma alteração detectada.', 'info');
            return;
        }

        localStorage.setItem('rockmovies_user', JSON.stringify(updatedUser));
        Object.assign(originalUser, updatedUser);
        showToast('Perfil atualizado!', 'success');
    });

    // --- LÓGICA: BACKUP ---
    container.querySelector('#btn-export').addEventListener('click', () => {
        const backup = {
            user: JSON.parse(localStorage.getItem('rockmovies_user')),
            library: JSON.parse(localStorage.getItem('rockmovies_rentals')),
            history: JSON.parse(localStorage.getItem('rockmovies_history'))
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
        const link = document.createElement('a');
        link.setAttribute("href", dataStr);
        link.setAttribute("download", `rockmovies_backup.json`);
        link.click();
        showToast('Backup gerado!', 'success');
    });

    return container;
}