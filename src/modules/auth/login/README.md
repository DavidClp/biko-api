# Módulo de Autenticação

Este módulo gerencia a autenticação de usuários na aplicação.

## Endpoints

### POST /auth/login

Autentica um usuário com email e senha.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "email": "usuario@exemplo.com",
    "role": "CLIENT",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "provider": null,
    "client": {
      "id": "uuid-do-cliente",
      "name": "Nome do Cliente",
      "city": "São Paulo"
    }
  },
  "token": "jwt-token-gerado"
}
```

**Response (400):**
```json
{
  "error": "Email e senha são obrigatórios"
}
```

**Response (401):**
```json
{
  "error": "Email ou senha incorretos"
}
```

## Estrutura do Módulo

- `useCases/` - Lógica de negócio
- `controllers/` - Controladores HTTP
- `routes/` - Definição das rotas
- `validators/` - Validação de entrada
- `index.ts` - Exportações do módulo

## Funcionalidades

- Validação de email e senha
- Verificação de credenciais no banco
- Geração de token JWT
- Retorno de informações do usuário
- Inclusão de dados de provider/client vinculados
- Validação de formato de email
- Verificação de tamanho mínimo de senha
