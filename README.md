# 📊 TaskFlow Pro - Dashboard de Produtividade

O TaskFlw Pro é uma Single Page Application (SPA) construída com JavaScript Vanilla (puro), focada na gestão de tarefas com priorização e monitorização de tempo (Time Tracking).

## 🚀 Funcionalidades Principal
- Autenticação Local: Sistema de login e registo persistido no LocalStorage.
- Dashboard de Métricas: Visualização em tempo real de tarefas totais, concluídas e tempo de foco.
- Gestão de Tarefas (CRUD): Adição, listagem, conclusão e remoção de tarefas.
-Priorização: Ordenação automática por níveis (Alta, Média, Baixa).
- Time Tracking: Cronómetro individual por tarefa para medir produtividade.
- Exportação de Dados: Download de relatórios em formato JSON.

## 🛠️ Tecnologias Utilizadas
- HTML5 (Estrutura semântica)
- CSS3 (Layout Dashboard com Grid e Flexbox)
- JavaScript (ES6+) (Módulos, Arrow Functions, LocalStorage)

## 📂 Estrutura de Ficheiros
- `/src`
  - `/components`: Componentes funcionais que geram o HTML (AuthForm, TaskItem, Profile).
  - `state.js`: Gestão de estado global, lógica de persistência e cálculos.
  - `main.js`: Controlador principal, roteamento de vistas e eventos.
  - `style.css`: Estilização completa do dashboard e botões.

## 🔧 Como Instalar e Correr
1. Clone o repositório ou descarregue os ficheiros.
2. Como o projeto utiliza Módulos ES6, é necessário correr através de um servidor local.
   - Se usas o VS Code, instala a extensão Live Server.
   - Clica com o botão direito no `index.html` e seleciona "Open with Live Server".