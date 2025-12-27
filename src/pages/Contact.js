import { showToast } from '../utils/toast.js';

export function renderContact() {
    const user = JSON.parse(localStorage.getItem('rockmovies_user') || '{}');
    const container = document.createElement('div');
    container.className = 'contact-page';

    container.innerHTML = `
        <div class="profile-card" style="max-width: 600px; margin: 0 auto;">
            <h1><i class="fas fa-envelope"></i> Contactar Suporte</h1>
            <p style="color: #aaa; margin-bottom: 25px;">Preencha o formulário abaixo e o nosso administrador entrará em contacto.</p>
            
            <form id="contact-form">
                <div class="form-group">
                    <label>Nome Completo</label>
                    <input type="text" id="contact-name" value="${user.name || ''}" required class="profile-input">
                </div>
                <div class="form-group">
                    <label>E-mail</label>
                    <input type="email" id="contact-email" value="${user.email || ''}" required class="profile-input">
                </div>
                <div class="form-group">
                    <label>Assunto</label>
                    <select id="contact-subject" class="profile-input" style="background: #222;">
                        <option value="Suporte Técnico">Suporte Técnico</option>
                        <option value="Financeiro / Faturação">Financeiro / Faturação</option>
                        <option value="Sugestões">Sugestões</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Mensagem</label>
                    <textarea id="contact-message" required class="profile-input" style="height: 120px; resize: none;"></textarea>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 20px;">
                    <i class="fas fa-paper-plane"></i> Enviar para o Admin
                </button>
            </form>
        </div>
    `;

    container.querySelector('#contact-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const newMessage = {
            id: Date.now(),
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value,
            date: new Date().toLocaleString(),
            status: 'pendente'
        };

        // Guardar na lista de mensagens do Admin
        const messages = JSON.parse(localStorage.getItem('rockmovies_admin_messages') || '[]');
        messages.push(newMessage);
        localStorage.setItem('rockmovies_admin_messages', JSON.stringify(messages));

        showToast('Mensagem enviada com sucesso! O Admin será notificado.', 'success');
        e.target.reset(); // Limpa o formulário
    });

    return container;
}