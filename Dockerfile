# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install --legacy-peer-deps

# Copia todo o código
COPY . .

# Gera client do Prisma
RUN npx prisma generate

# Compila TypeScript ignorando erros de tipagem
RUN npx tsc --noEmitOnError false --skipLibCheck

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copia dependências e build do stage anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Variáveis de ambiente (coloque seus secrets aqui)
ENV NODE_ENV=production
ENV PORT=3333
# Exemplo para API_URL se precisar
# ENV NEXT_PUBLIC_API_URL=http://api.bikoservicos.com.br

EXPOSE 3333

CMD ["node", "build/shared/infra/http/express/server.js"]
