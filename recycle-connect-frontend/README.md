# Documentação da Primeira Fase do Projeto

## 1. Objetivo da Fase
O objetivo dessa fase foi desenvolver as interfaces para:
- Login de usuários e coletores.
- Cadastro de novas contas.
- Seleção inicial entre os tipos de login.

Essa fase buscou criar uma interface funcional e amigável, utilizando componentes reutilizáveis e garantindo a navegação básica entre as páginas.

---

## 2. Funcionalidades Desenvolvidas
### **Página de Login de Usuários Comuns**
- Entrada de e-mail e senha.
- Opção de exibir/ocultar senha.
- Botão funcional para login (placeholder para futuras integrações).
- Mensagens de erro planejadas, mas ainda não implementadas.

### **Página de Login de Coletores**
- Mesma estrutura da página de login de usuários comuns.
- Navegação funcional para essa página a partir da seleção inicial.

### **Página de Seleção Inicial**
- Botões para redirecionar para:
  - Login de Usuários Comuns.
  - Login de Coletores.
  - Página de criação de conta.
  - Página para recuperação de senha.


---

## 3. Tecnologias e Ferramentas Utilizadas
- **Linguagens:** JavaScript (React.js).
- **Bibliotecas:**
  - [React Router DOM](https://reactrouter.com/) para navegação.
  - [Bootstrap](https://getbootstrap.com/) para estilização responsiva.
- **Ferramentas:**
  - **Editor de Código:** Visual Studio Code.
  - **Gestor de Pacotes:** npm.
  - **Controle de Versão:** Git (repositório hospedado no GitHub).

---

## 4. Estrutura de Arquivos e Código
Abaixo está a estrutura dos arquivos relevantes para essa fase:

src/
├── assets/
├── components/
│   ├── Footer.jsx
│   ├── Header.jsx
│   ├── Map.jsx
├── pages/
│   ├── About.jsx
│   ├── AccountTypeChoice.jsx
│   ├── CollectorLoginPage.jsx
│   ├── CollectorRegister.jsx
│   ├── CommonUserLoginPage.jsx
│   ├── CommonUserRegister.jsx
│   ├── Home.jsx
│   ├── LoginSelectionPage.jsx
│   ├── RecoverCollectorPassword.jsx
│   ├── RecoverCommonUserPassword.jsx
│   ├── Rewards.jsx
│   ├── WelcomePage.jsx
├── styles/
│   ├── components/
│   │   ├── Footer.css
│   │   ├── Header.css
│   │   ├── Map.css
│   ├── pages/
│       ├── AccountTypeChoice.css
│       ├── Login.css
│       ├── Register.css
│       ├── WelcomePage.css
├── App.jsx
├── Index.css
├── Main.jsx    
   
---

## 5. Dificuldades e Soluções
### **Desafio 1: Design Consistente**
- **Problema:** Garantir que todas as páginas tenham uma aparência uniforme.
- **Solução:** Utilizar Bootstrap e classes CSS compartilhadas para estilos consistentes.

### **Desafio 2: Navegação Funcional**
- **Problema:** Algumas rotas quebravam devido a erros de importação.
- **Solução:** Revisar todas as importações e configurar corretamente as rotas com o React Router DOM.

### **Desafio 3: Responsividade**
- **Problema:** Certas páginas não estavam responsivas em telas menores.
- **Solução:** Ajustar classes do Bootstrap e testar em dispositivos diferentes.

---

## 6. Próximos Passos
- Implementar validação de formulários para login e cadastro.
- Adicionar mensagens de erro claras para entradas inválidas.
- Integrar as interfaces com a API para autenticação.
- Testar o design em navegadores diferentes e dispositivos móveis.

---

## 7. Screenshots e Demonstrações
### **Tela Inicial de Seleção**
![Tela Inicial](caminho/para/imagem.png)

### **Tela de Login de Usuário**
![Tela de Login de Usuário](caminho/para/imagem.png)

### **Tela de Login de Coletor**
![Tela de Login de Coletor](caminho/para/imagem.png)

---

## 8. Conclusão
A primeira fase foi concluída com sucesso, entregando interfaces básicas para login, seleção e cadastro. O uso de React e Bootstrap garantiu uma base sólida e consistente para futuras melhorias. A próxima etapa envolverá a implementação de validações e a integração com APIs para uma experiência mais completa.

---

**Autor:** Seu Nome  
**Projeto:** Nome do Projeto  
**Data:** Janeiro de 2025





# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
