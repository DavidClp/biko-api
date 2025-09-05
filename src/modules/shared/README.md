# Módulo Shared - Serviços

Este módulo contém funcionalidades compartilhadas da aplicação, incluindo a gestão de serviços.

## Rotas de Serviços

### GET /services

Busca todos os serviços disponíveis com filtro opcional por nome.

**Parâmetros de Query:**
- `name` (opcional): Filtra serviços que contenham o nome especificado (busca case-insensitive)

**Exemplos de uso:**

```bash
# Buscar todos os serviços
GET /services

# Buscar serviços que contenham "pintor"
GET /services?name=pintor

# Buscar serviços que contenham "técnico"
GET /services?name=técnico
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-do-servico",
      "name": "Pintor",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Resposta de erro:**
```json
{
  "success": false,
  "error": {
    "title": "Erro ao buscar serviços",
    "detail": "Ocorreu um erro inesperado ao buscar os serviços",
    "statusCode": 500
  }
}
```

## Estrutura do Módulo

- `controllers/`: Controllers para gerenciar requisições HTTP
- `dtos/`: Data Transfer Objects para tipagem de dados
- `repositories/`: Repositórios para acesso aos dados
- `routes/`: Definição das rotas da API
