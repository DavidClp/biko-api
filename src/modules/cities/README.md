# Módulo de Cidades

Este módulo fornece endpoints para gerenciar e consultar cidades do sistema.

## Endpoints

### GET /cities

Lista todas as cidades com suporte a filtros e paginação.

#### Parâmetros de Query

- `search` (opcional): Termo de busca para filtrar cidades por nome
- `limit` (opcional): Número máximo de resultados por página (padrão: 20)
- `page` (opcional): Número da página (padrão: 1)

#### Exemplos de Uso

```bash
# Listar cidades de Rondônia (máximo 20)
GET /cities

# Buscar cidades que contenham "São Paulo" (em qualquer estado)
GET /cities?search=São Paulo

# Buscar cidades com limite personalizado
GET /cities?limit=10

# Buscar cidades com paginação
GET /cities?page=2&limit=15

# Combinação de filtros
GET /cities?search=Rio&limit=25&page=1
```

#### Resposta

```json
{
  "success": true,
  "data": [
    {
      "id": "city-uuid",
      "name": "São Paulo",
      "state_id": "state-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "name_no_accents": "Sao Paulo",
      "state": {
        "id": "state-uuid",
        "name": "São Paulo",
        "initials": "SP"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

## Estrutura do Módulo

```
src/modules/cities/
├── controllers/
│   ├── CityController.ts
│   └── index.ts
├── dtos/
│   ├── ICityResponseDTO.ts
│   ├── CityResponseDTO.ts
│   ├── ListCitiesDTO.ts
│   └── index.ts
├── repositories/
│   ├── ICityRepository.ts
│   ├── CityRepository.ts
│   └── index.ts
├── routes/
│   ├── city.routes.ts
│   └── index.ts
├── useCases/
│   ├── ListCitiesUseCase.ts
│   └── index.ts
├── index.ts
└── README.md
```

## Funcionalidades

- **Busca por nome**: Suporte a busca case-insensitive por nome da cidade
- **Busca sem acentos**: Também busca por `name_no_accents` para melhor experiência do usuário
- **Filtro por estado**: 
  - **Sem busca**: Retorna apenas cidades de Rondônia (RO)
  - **Com busca**: Permite buscar cidades em qualquer estado
- **Paginação**: Suporte a paginação com limite configurável
- **Ordenação**: Cidades ordenadas alfabeticamente por nome
- **Relacionamentos**: Inclui informações do estado relacionado
- **Limite padrão**: Máximo de 20 resultados por página

## Uso no Frontend

Este endpoint é ideal para preencher campos de seleção múltipla (multi-select) no frontend, permitindo:

- **Comportamento padrão**: Mostra apenas cidades de Rondônia (ideal para usuários locais)
- **Busca expandida**: Quando o usuário digita, expande para buscar em todos os estados
- Busca em tempo real
- Paginação para grandes volumes de dados
- Filtros por nome da cidade
- Informações completas incluindo estado
