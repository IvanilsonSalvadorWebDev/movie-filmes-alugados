import { showToast } from '../utils/toast.js';

export function renderLogin(onLoginSuccess) {
    const container = document.createElement('div');
    container.className = 'login-page-container';

    container.innerHTML = `
        <div class="profile-card" style="max-width: 400px; margin: 100px auto; text-align: center;">
            <h2 style="margin-bottom: 20px;"><i class="fas fa-lock"></i> RockMovies Login</h2>
            <form id="login-form">
                <div class="form-group" style="text-align: left;">
                    <label>E-mail</label>
                    <input type="email" id="login-email" placeholder="admin@rockmovies.com ou seu email" class="profile-input" required>
                </div>
                <div class="form-group" style="text-align: left; margin-top: 15px;">
                    <label>Palavra-passe</label>
                    <input type="password" id="login-pass" placeholder="••••••••" class="profile-input" required>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 25px; padding: 12px;">
                    Entrar no Sistema
                </button>
            </form>
            <p style="margin-top: 20px; font-size: 0.8rem; color: #888;">
                Dica: Use <strong>admin@rockmovies.com</strong> para aceder ao painel de mensagens.
            </p>
        </div>
    `;

    container.querySelector('#login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-pass').value;

        // Simulação de autenticação
        if (email && pass.length >= 4) {
            const userObj = {
                email: email,
                name: email.split('@')[0], // Nome automático baseado no email
                isLoggedIn: true,
                lastLogin: new Date().toISOString()
            };

            // Guardar sessão
            localStorage.setItem('rockmovies_user', JSON.stringify(userObj));
            
            showToast(`Bem-vindo, ${userObj.name}!`, 'success');
            
            // Callback para atualizar a interface principal (mudar de página)
            if (onLoginSuccess) onLoginSuccess();
        } else {
            showToast('Dados inválidos. A senha deve ter 4 dígitos.', 'error');
        }
    });

    return container;
}