# Sistema de Recomendações

Este módulo implementa o sistema de código de recomendação para a plataforma ListUp.

## Funcionalidades

### 1. Geração de Código de Recomendação
- **Endpoint**: `POST /recommendations/generate-code`
- **Autenticação**: Requerida
- **Descrição**: Gera um código único de recomendação para o usuário
- **Body**:
  ```json
  {
    "cpf": "12345678901",
    "pixKey": "usuario@email.com"
  }
  ```

### 2. Criação de Recomendação
- **Endpoint**: `POST /recommendations/create`
- **Autenticação**: Requerida
- **Descrição**: Cria uma recomendação usando o código de outro usuário
- **Body**:
  ```json
  {
    "recommendationCode": "REC1234567890123456"
  }
  ```

### 3. Listar Recomendações Feitas
- **Endpoint**: `GET /recommendations/my-recommendations`
- **Autenticação**: Requerida
- **Descrição**: Lista todas as recomendações feitas pelo usuário autenticado

### 4. Buscar Usuário por Código
- **Endpoint**: `GET /recommendations/user/:code`
- **Autenticação**: Não requerida (público)
- **Descrição**: Busca informações do usuário pelo código de recomendação (usado na tela de cadastro)

## Regras de Negócio

1. **Apenas prestadores podem ser recomendados**: Somente usuários com role `PROVIDER` podem receber recomendações
2. **Tanto clientes quanto prestadores podem gerar códigos**: Qualquer usuário pode criar seu código de recomendação
3. **Código único**: Cada usuário pode ter apenas um código de recomendação
4. **Não auto-recomendação**: Um usuário não pode usar seu próprio código
5. **Não duplicação**: Não é possível recomendar o mesmo prestador mais de uma vez

## Estrutura do Banco de Dados

### Tabela `Recommendation`
- `id`: UUID único
- `giverId`: ID do usuário que fez a recomendação
- `receiverId`: ID do usuário que foi recomendado (sempre um prestador)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Campos Adicionais na Tabela `User`
- `recommendation_code`: Código único de recomendação (gerado automaticamente)
- `cpf`: CPF do usuário (obrigatório para gerar código)
- `pix_key`: Chave PIX do usuário (obrigatória para gerar código)

## Formato do Código de Recomendação

O código é gerado no formato: `REC{últimos4dígitosCPF}{timestamp}`

Exemplo: `REC890112345678`

## Fluxo de Uso

1. **Usuário gera código**: Acessa a área de recomendações e informa CPF + chave PIX
2. **Sistema gera código**: Cria código único e salva no banco
3. **Usuário compartilha**: Compartilha o código ou link com o código
4. **Novo usuário usa código**: Na tela de cadastro de prestador, informa o código
5. **Sistema registra recomendação**: Cria o relacionamento entre os usuários

## Integração Frontend

### Tela de Recomendações (Clientes e Prestadores)
- Campo para CPF
- Campo para chave PIX
- Botão "Gerar Código"
- Exibição do código gerado
- Link para compartilhamento

### Tela de Cadastro de Prestador
- Campo opcional "Código de Recomendação"
- Validação em tempo real do código
- Exibição das informações do usuário que fez a recomendação

## Exemplos de Uso

### Gerar Código
```bash
curl -X POST http://localhost:3000/recommendations/generate-code \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cpf": "12345678901",
    "pixKey": "usuario@email.com"
  }'
```

### Criar Recomendação
```bash
curl -X POST http://localhost:3000/recommendations/create \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recommendationCode": "REC890112345678"
  }'
```

### Buscar Usuário por Código
```bash
curl -X GET http://localhost:3000/recommendations/user/REC890112345678
```
