# Módulo de Mensagens

Este módulo gerencia as mensagens trocadas entre clientes e prestadores de serviço através das requisições.

## Funcionalidades

- **Criar mensagem**: Cria uma nova mensagem para uma requisição específica
- **Buscar mensagens por requestId**: Lista todas as mensagens de uma requisição
- **Atualizar status de visualização**: Marca uma mensagem como visualizada/não visualizada
- **Deletar mensagem**: Remove uma mensagem do sistema

## Rotas

### POST `/messages`
Cria uma nova mensagem.

**Body:**
```json
{
  "requestId": "uuid-da-requisicao",
  "content": "Conteúdo da mensagem",
  "type": "TEXT" // opcional: TEXT, IMAGE, VIDEO (padrão: TEXT)
}
```

### GET `/messages/request/:requestId`
Busca todas as mensagens de uma requisição específica.

### PATCH `/messages/:id/viewed`
Atualiza o status de visualização de uma mensagem.

**Body:**
```json
{
  "viewed": true // ou false
}
```

### DELETE `/messages/:id`
Remove uma mensagem do sistema.

## Estrutura do Projeto

```
messages/
├── controllers/
│   ├── MessageController.ts
│   └── index.ts
├── dtos/
│   ├── CreateMessageDTO.ts
│   ├── MessageResponseDTO.ts
│   ├── UpdateMessageViewedDTO.ts
│   └── index.ts
├── repositories/
│   ├── IMessageRepository.ts
│   ├── MessageRepository.ts
│   └── index.ts
├── routes/
│   ├── message.routes.ts
│   └── index.ts
├── useCases/
│   ├── CreateMessageUseCase.ts
│   ├── GetMessagesByRequestIdUseCase.ts
│   ├── UpdateMessageViewedUseCase.ts
│   ├── DeleteMessageUseCase.ts
│   └── index.ts
├── index.ts
└── README.md
```

## Tipos de Mensagem

- **TEXT**: Mensagem de texto simples
- **IMAGE**: Mensagem com imagem
- **VIDEO**: Mensagem com vídeo

## Validações

- RequestId e conteúdo são obrigatórios para criação
- Conteúdo não pode estar vazio
- Tipo deve ser um dos valores válidos (TEXT, IMAGE, VIDEO)
- ID é obrigatório para operações de atualização e exclusão
- Campo viewed deve ser booleano para atualização de visualização
