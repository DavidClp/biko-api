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

# Compila TypeScript e ajusta aliases
RUN npx tsc && npx tsc-alias

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copia node_modules e build do stage anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "build/shared/infra/http/express/server.js"]
