// src/components/AuthForm.js

/**
 * Gera o formulário de Autenticação.
 * @param {string} mode - 'login' ou 'register'
 */
 export const AuthForm = (mode = 'login') => {
    const isLogin = mode === 'login';

    return `
        <div class="auth-container">
            <h2>${isLogin ? 'Entrar' : 'Criar Conta'}</h2>
            <form id="auth-form">
                ${!isLogin ? `
                    <div class="form-group">
                        <label>Nome</label>
                        <input type="text" id="auth-name" placeholder="Seu nome" required>
                    </div>
                ` : ''}
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="auth-email" placeholder="seu@email.com" required>
                </div>

                <div class="form-group">
                    <label>Palavra-passe</label>
                    <input type="password" id="auth-password" placeholder="******" required>
                </div>

                <button type="submit" class="btn-primary">
                    ${isLogin ? 'Entrar' : 'Registar'}
                </button>
            </form>

            <p class="auth-toggle">
                ${isLogin ? 'Não tem conta?' : 'Já tem conta?'} 
                <a href="#" id="toggle-auth">${isLogin ? 'Registe-se' : 'Faça Login'}</a>
            </p>
        </div>
    `;
};