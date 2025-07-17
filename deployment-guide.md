# Guia de Deploy no Coolify - PDFxandria

## Pré-requisitos

### 1. Servidor com Coolify
- Servidor com Docker instalado
- Coolify instalado e configurado
- Acesso SSH ao servidor

### 2. Banco de Dados PostgreSQL
- PostgreSQL 15 ou superior
- Banco de dados criado
- Usuário com permissões completas

## Configuração do Ambiente

### 1. Variáveis de Ambiente Obrigatórias

```bash
# Configuração do Banco de Dados
DATABASE_URL=postgresql://usuario:senha@host:5432/database

# Configuração da Aplicação
NODE_ENV=production
PORT=5000
```

### 2. Configuração do Domínio
- Configure o domínio no Coolify
- Ative HTTPS/SSL automaticamente
- Configure redirecionamentos se necessário

## Passos para Deploy

### 1. Preparar o Repositório
```bash
# Clone o repositório
git clone seu-repositorio
cd pdfxandria

# Instalar dependências
npm ci

# Verificar configurações
npm run build
```

### 2. Configurar no Coolify

1. **Criar Nova Aplicação**
   - Tipo: Node.js
   - Versão: 20
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`

2. **Configurar Variáveis de Ambiente**
   - Adicione todas as variáveis listadas acima
   - Marque as variáveis sensíveis como secretas

3. **Configurar Volumes**
   - Monte `./uploads` para `/app/uploads`
   - Garanta permissões de escrita

4. **Configurar Health Check**
   - URL: `/api/health`
   - Intervalo: 30s
   - Timeout: 10s
   - Retries: 3

### 3. Deploy da Aplicação

1. **Fazer Deploy Inicial**
   ```bash
   # No Coolify, clique em "Deploy"
   # Aguarde o build completar
   ```

2. **Verificar Logs**
   - Verifique se não há erros no console
   - Confirme que o banco foi inicializado
   - Verifique se o admin foi criado

3. **Testar Funcionalidade**
   - Acesse o endpoint de saúde: `https://seu-dominio.com/api/health`
   - Teste a página inicial
   - Verifique upload de arquivos

## Troubleshooting

### Problema: Erro de Tema
```
AssertError: Expected union value at /variant
```

**Solução:**
- Verifique se `theme.json` tem `variant: "default"`
- Certifique-se de que o arquivo está no root do projeto

### Problema: Erro de Banco de Dados
```
DATABASE_URL must be set
```

**Solução:**
- Verifique todas as variáveis de ambiente do PostgreSQL
- Confirme conectividade com o banco
- Execute `npm run db:push` para criar tabelas

### Problema: Erro de Permissions
```
EACCES: permission denied, mkdir 'uploads'
```

**Solução:**
- Configure volumes corretamente no Coolify
- Verifique permissões de escrita no diretório
- Use usuário não-root no container

### Problema: Build Falha
```
npm ERR! code ELIFECYCLE
```

**Solução:**
- Limpe cache: `npm cache clean --force`
- Remova node_modules: `rm -rf node_modules`
- Reinstale: `npm ci`

## Monitoramento

### Logs Importantes
- `Server running on port 5000` - Servidor iniciado
- `Database initialization completed` - Banco configurado
- `Admin user created` - Usuário admin criado
- `Default categories setup completed` - Categorias criadas

### Health Check
- URL: `/api/health`
- Resposta esperada: `{"status":"ok","timestamp":"..."}`

### Métricas
- CPU: < 50% em uso normal
- Memória: < 512MB em uso normal
- Disco: Monitore diretório `/uploads`

## Backup e Manutenção

### Backup do Banco
```bash
# Dump do banco
pg_dump -h $PGHOST -p $PGPORT -U $PGUSER $PGDATABASE > backup.sql

# Restore do banco
psql -h $PGHOST -p $PGPORT -U $PGUSER $PGDATABASE < backup.sql
```

### Backup de Arquivos
```bash
# Backup dos uploads
tar -czf uploads-backup.tar.gz uploads/
```

### Atualizações
1. Teste em ambiente de desenvolvimento
2. Faça backup do banco e arquivos
3. Deploy da nova versão
4. Verifique funcionalidade
5. Monitore logs por 24h

## Recursos Adicionais

### Scripts Úteis
- `scripts/deploy-init.sh` - Inicialização do deploy
- `scripts/health-check.sh` - Verificação de saúde
- `scripts/pre-deploy-check.ts` - Verificação pré-deploy

### Configurações
- `Dockerfile` - Container de produção
- `docker-compose.yml` - Orquestração local
- `coolify-config.json` - Configuração do Coolify

## Suporte

Para problemas específicos:
1. Verifique logs do Coolify
2. Teste localmente com Docker
3. Execute scripts de diagnóstico
4. Verifique configurações de rede e DNS