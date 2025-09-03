# Módulo Request

Este módulo gerencia as requisições de serviços entre clientes e providers.

## Estrutura

```
request/
├── controllers/
│   ├── RequestController.ts
│   └── index.ts
├── dtos/
│   ├── CreateRequestDTO.ts
│   ├── UpdateRequestDTO.ts
│   ├── RequestResponseDTO.ts
│   └── index.ts
├── repositories/
│   ├── IRequestRepository.ts
│   ├── RequestRepository.ts
│   └── index.ts
├── routes/
│   ├── request.routes.ts
│   └── index.ts
├── useCases/
│   ├── CreateRequestUseCase.ts
│   ├── UpdateRequestUseCase.ts
│   └── index.ts
└── index.ts
```

## Rotas

### GET /requests
Lista todas as requisições de serviço.

### GET /requests/:id
Busca uma requisição específica por ID.

### GET /requests/client/:clientId
Busca todas as requisições de um cliente específico.

### GET /requests/provider/:providerId
Busca todas as requisições de um provider específico.

### POST /requests
Cria uma nova requisição de serviço.

**Body:**
```json
{
  "clientId": "string",
  "providerId": "string",
  "service_type": "string",
  "description": "string (opcional)",
  "address": "string (opcional)",
  "urgency": "string (opcional)",
  "value": "number (opcional)"
}
```

### PUT /requests/:id
Atualiza uma requisição existente.

**Body:**
```json
{
  "service_type": "string (opcional)",
  "description": "string (opcional)",
  "address": "string (opcional)",
  "urgency": "string (opcional)",
  "value": "number (opcional)",
  "status": "PENDING | ACCEPTED | REJECTED | IN_PROGRESS | COMPLETED (opcional)"
}
```

## Status da Requisição

- `PENDING`: Aguardando resposta do provider
- `ACCEPTED`: Provider aceitou a requisição
- `REJECTED`: Provider rejeitou a requisição
- `IN_PROGRESS`: Serviço em andamento
- `COMPLETED`: Serviço concluído

## Autenticação

Todas as rotas requerem autenticação através do middleware `userAuthenticatedMiddleware`.
