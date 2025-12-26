// src/pages/Profile.js
export function renderProfile() {
    const user = JSON.parse(localStorage.getItem('rockmovies_user') || '{"name": "Visitante"}');
    const container = document.createElement('div');

    container.innerHTML = `
        <h1>Minha Conta</h1>
        <div class="profile-box" style="background: white; padding: 30px; border-radius: 12px; margin-top: 20px;">
            <p>Olá, <strong id="user-display-name">${user.name}</strong>!</p>
            <div class="form-group" style="margin-top: 20px;">
                <label>Alterar Nome:</label>
                <input type="text" id="new-name" placeholder="Digite seu nome">
                <button id="btn-save-profile" class="btn-orange" style="margin-top: 10px;">Salvar</button>
            </div>
        </div>
    `;

    container.querySelector('#btn-save-profile').addEventListener('click', () => {
        const name = container.querySelector('#new-name').value;
        if(name) {
            localStorage.setItem('rockmovies_user', JSON.stringify({ name }));
            alert('Perfil atualizado!');
            location.reload(); // Recarrega para aplicar o nome em todo o site
        }
    });

    return container;
}