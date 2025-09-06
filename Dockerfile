FROM node:20

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install --legacy-peer-deps

# Copia todo o código
COPY . .

# Compila o TypeScript
RUN npm run db:generate
RUN npm run build

# Variáveis de ambiente
ARG PORT
ENV PORT=$PORT
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET

# Expõe porta para Nginx Proxy Manager
EXPOSE $PORT

# Comando de start
CMD ["npm", "start"]
