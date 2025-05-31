# ----------------- STAGE 1: BUILD -----------------
    FROM node:20-alpine AS builder

    # Definimos diretório de trabalho
    WORKDIR /app
    
    # Copia os arquivos de configuração e dependências
    COPY package.json package-lock.json ./
    
    # Instala somente as dependências de desenvolvimento para o build
    RUN npm install
    
    # Copia o restante do código
    COPY . .
    
    # Gera o build TypeScript (supondo que você tem o tsconfig configurado)
    RUN npx tsc
    
    # ----------------- STAGE 2: RUNTIME -----------------
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    # Instala apenas dependências de produção
    COPY package.json package-lock.json ./
    RUN npm install --omit=dev
    
    # Copia apenas os arquivos já compilados da build anterior
    COPY --from=builder /app/dist ./dist
    COPY drizzle.config.json ./
    COPY .env ./
    
    # Expor a porta do Fastify (ajustável caso use outra porta)
    EXPOSE 3000
    
    # Comando de inicialização
    CMD ["node", "dist/server.js"]
    