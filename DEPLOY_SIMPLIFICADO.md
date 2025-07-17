# 🚀 Deploy Simplificado - PDFxandria

## ✅ Configuração Mínima para Coolify

### Variáveis de Ambiente Necessárias:
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
```

### Configuração do Build:
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`
- **Port:** 5000

### Health Check:
- **Path:** `/api/health`
- **Resposta esperada:** `{"status":"ok"}`

### Credenciais de Admin:
- **URL:** `/admin`
- **Username:** `Hisoka`
- **Password:** `Fudencio992#`

## 📋 Passos no Coolify:

1. **Importe o repositório**
2. **Configure apenas as 3 variáveis acima**
3. **Configure o domínio e SSL**
4. **Execute o deploy**

## 🎯 Resultado:
- Sistema 100% funcional
- Warning de tema não afeta funcionamento
- Banco inicializado automaticamente
- Admin user criado automaticamente

**Exemplo de DATABASE_URL:**
```
postgresql://pdfuser:senha123@db.exemplo.com:5432/pdfxandria
```

Simples assim! 🎉