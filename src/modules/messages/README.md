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
  "request_id": "uuid-da-requisicao",
  "content": "Conteúdo da mensagem",
  "sender_id": "uuid-do-remetente",
  "receiver_id": "uuid-do-destinatario",
  "type": "TEXT" // opcional: TEXT, IMAGE, VIDEO (padrão: TEXT)
}
```

### GET `/messages/request/:requestId`
Busca todas as mensagens de uma requisição específica.

### GET `/messages/sender/:senderId`
Busca todas as mensagens enviadas por um usuário específico.

### GET `/messages/receiver/:receiverId`
Busca todas as mensagens recebidas por um usuário específico.

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
│   ├── GetMessagesBySenderIdUseCase.ts
│   ├── GetMessagesByReceiverIdUseCase.ts
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

- RequestId, conteúdo, senderId e receiverId são obrigatórios para criação
- Conteúdo não pode estar vazio
- O remetente não pode ser o mesmo que o destinatário
- Tipo deve ser um dos valores válidos (TEXT, IMAGE, VIDEO)
- ID é obrigatório para operações de atualização e exclusão
- Campo viewed deve ser booleano para atualização de visualização

## Autenticação

Todas as rotas requerem autenticação através do middleware `userAuthenticatedMiddleware`.

## Campos do Schema

- **id**: Identificador único da mensagem (UUID)
- **request_id**: ID da requisição relacionada
- **content**: Conteúdo da mensagem
- **sender_id**: ID do usuário que enviou a mensagem
- **receiver_id**: ID do usuário que recebeu a mensagem
- **type**: Tipo da mensagem (TEXT, IMAGE, VIDEO)
- **viewed**: Status de visualização da mensagem
- **createdAt**: Data de criação
- **updatedAt**: Data da última atualização
