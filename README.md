# Plataforma de Processamento de PDF

Uma plataforma completa para manipulação e compartilhamento de documentos PDF, com ferramentas avançadas de edição e um sistema de acesso baseado em limites diários.

## Visão Geral

Esta plataforma oferece um conjunto completo de ferramentas para trabalhar com arquivos PDF:

- **Visualização de PDF** - Visualização interativa de documentos
- **Edição de Metadados** - Modificação de informações de autor, título e outros
- **Proteção com Senha** - Adição de segurança aos documentos
- **Manipulação de Páginas** - Excluir, extrair, rotacionar páginas
- **Conversão de Formatos** - PDF para Word, PDF para Imagem
- **Compressão** - Redução do tamanho de arquivos PDF
- **Mesclagem/Divisão** - Combinação ou separação de documentos
- **Marca d'água** - Inserção de textos personalizados

## Stack Tecnológico

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL com Drizzle ORM
- **Manipulação de PDF**: pdftk, pdf2docx, sharp

## Modelo de Negócio

A plataforma opera com o seguinte modelo:

### Usuários Gratuitos
- Acesso a todas as ferramentas PDF
- Limite de 5 operações por dia
- Limite de 3 downloads de PDF compartilhados por dia

### Usuários Premium
- Acesso ilimitado a todas as ferramentas
- Downloads ilimitados
- Armazenamento estendido

## Atualizações Recentes

### Atualização de Modelo de Negócio (Abril 2025)
- Todas as ferramentas PDF agora estão disponíveis para usuários gratuitos (anteriormente algumas eram exclusivas para premium)
- O limite diário de 5 operações para usuários gratuitos é mantido
- Removido o conceito de "ferramentas premium" e substituído por um sistema de limite diário de uso

## Instalação e Configuração

Para instruções detalhadas sobre como configurar e implantar o sistema, consulte o arquivo [DEPLOY.md](DEPLOY.md).

### Implantação no Coolify

Existem três formas principais de implantar a aplicação no Coolify:

#### Opção 1: Usando o Dockerfile específico (Recomendado)
Consulte [COOLIFY.md](COOLIFY.md) para instruções sobre como usar o `Dockerfile.coolify`.
- Renomeie `Dockerfile.coolify` para `Dockerfile` antes de implantar
- Utiliza as configurações padrão do Coolify para build Docker

#### Opção 2: Usando comandos shell diretamente
Consulte [COOLIFY.md](COOLIFY.md) para instruções detalhadas usando:
- Build Command: `chmod +x ./coolify-build.sh && ./coolify-build.sh`
- Start Command: `chmod +x ./coolify-start.sh && ./coolify-start.sh`

#### Opção 3: Usando comandos npm com dependências
Consulte [COOLIFY-SIMPLE.md](COOLIFY-SIMPLE.md) para instruções simplificadas usando:
- Build Command: `apt-get update && apt-get install -y python3 python3-pip pdftk poppler-utils ghostscript imagemagick && pip3 install pdf2docx && npm install && npm run build && npm run db:push`
- Start Command: `NODE_ENV=production node dist/index.js`

Antes de implantar, execute o script `setup-deploy.sh` para verificar se tudo está configurado corretamente:
```bash
chmod +x setup-deploy.sh && ./setup-deploy.sh
```

### Requisitos Básicos
- Node.js 18+
- PostgreSQL 14+
- pdftk
- Python 3.11 com pdf2docx
- poppler-utils
- ghostscript
- imagemagick

### Configuração Rápida (Desenvolvimento)

```bash
# Clonar o repositório
git clone [url-do-repositorio]

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Preparar ambiente de produção
node prepare-production.js

# Iniciar em desenvolvimento
npm run dev

# Ou em produção
npm run start
```

## Estrutura de Diretórios

```
/client          # Código frontend React
/server          # Backend Node.js/Express
/shared          # Código compartilhado (esquemas, tipos)
/uploads         # Arquivos enviados pelos usuários
/migrations      # Migrações do banco de dados
```

## Administração

Um usuário admin é criado automaticamente na primeira execução:
- Username: admin
- Senha: admin123

É altamente recomendado alterar esta senha após o primeiro login.

## Licença

Todos os direitos reservados.