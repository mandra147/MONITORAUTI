# MONITORA UTI 🏥

Sistema Avançado de Monitoramento de UTI - Uma plataforma completa para gerenciamento e monitoramento de pacientes em unidades de terapia intensiva.

![Logo do MONITORA UTI](generated-icon.png)

## Sobre o Projeto

O MONITORA UTI é um sistema desenvolvido para facilitar o trabalho de profissionais de saúde em unidades de terapia intensiva, permitindo o monitoramento em tempo real de pacientes, gerenciamento de leitos, e acompanhamento de dados clínicos importantes.

## Funcionalidades Principais

- 📊 **Dashboard Intuitivo**: Visualização clara e rápida do estado dos leitos e pacientes
- 🛏️ **Gerenciamento de Leitos**: Controle de ocupação e status dos leitos
- 👨‍⚕️ **Perfil do Paciente**: Dados completos de cada paciente, incluindo histórico médico e avaliações
- 📈 **Monitoramento de Sinais Vitais**: Acompanhamento em tempo real dos sinais vitais dos pacientes
- 📝 **Gestão de Avaliações**: Sistema para registro e acompanhamento de avaliações médicas, de enfermagem e multidisciplinares
- 🔔 **Sistema de Alertas**: Notificações sobre alterações importantes no estado dos pacientes

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Autenticação**: JWT e bcrypt

## Banco de Dados

O sistema utiliza um banco de dados PostgreSQL com 82 tabelas especializadas para armazenar de forma eficiente todos os dados necessários para o monitoramento completo de pacientes em UTI, incluindo:

- Dados pessoais e clínicos dos pacientes
- Informações sobre leitos e ocupação
- Registros de sinais vitais
- Avaliações médicas e de enfermagem
- Medicações e prescrições
- Resultados de exames
- E muito mais

## Instalação e Configuração

### Pré-requisitos

- Node.js
- PostgreSQL
- Git

### Passo a passo

1. Clone o repositório:
   ```
   git clone https://github.com/mandra147/MONITORAUTI.git
   cd MONITORAUTI
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as variáveis necessárias, como `DATABASE_URL`

4. Inicialize o banco de dados:
   ```
   npm run db:push
   ```

5. Inicie a aplicação:
   ```
   npm run dev
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Contato

Para mais informações, entre em contato através do GitHub ou e-mail.

---

Desenvolvido com ❤️ para profissionais de saúde.