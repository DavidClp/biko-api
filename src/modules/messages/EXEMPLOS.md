# Exemplos de Uso - Rotas de Mensagens

## 1. Criar uma nova mensagem

**POST** `/messages`

```json
{
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "content": "Olá! Gostaria de saber mais sobre o seu serviço.",
  "type": "TEXT"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "987fcdeb-51a2-43d1-9f12-345678901234",
    "requestId": "123e4567-e89b-12d3-a456-426614174000",
    "content": "Olá! Gostaria de saber mais sobre o seu serviço.",
    "type": "TEXT",
    "viewed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Mensagem criada com sucesso"
}
```

## 2. Buscar mensagens por requestId

**GET** `/messages/request/123e4567-e89b-12d3-a456-426614174000`

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "987fcdeb-51a2-43d1-9f12-345678901234",
      "requestId": "123e4567-e89b-12d3-a456-426614174000",
      "content": "Olá! Gostaria de saber mais sobre o seu serviço.",
      "type": "TEXT",
      "viewed": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "abc123de-45f6-7890-abcd-ef1234567890",
      "requestId": "123e4567-e89b-12d3-a456-426614174000",
      "content": "Claro! Posso te ajudar com isso.",
      "type": "TEXT",
      "viewed": true,
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  ],
  "count": 2
}
```

## 3. Atualizar status de visualização

**PATCH** `/messages/987fcdeb-51a2-43d1-9f12-345678901234/viewed`

```json
{
  "viewed": true
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "987fcdeb-51a2-43d1-9f12-345678901234",
    "requestId": "123e4567-e89b-12d3-a456-426614174000",
    "content": "Olá! Gostaria de saber mais sobre o seu serviço.",
    "type": "TEXT",
    "viewed": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  },
  "message": "Status de visualização atualizado com sucesso"
}
```

## 4. Deletar uma mensagem

**DELETE** `/messages/987fcdeb-51a2-43d1-9f12-345678901234`

**Resposta:**
```json
{
  "success": true,
  "message": "Mensagem deletada com sucesso"
}
```

## 5. Exemplo de mensagem com imagem

**POST** `/messages`

```json
{
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "content": "https://exemplo.com/imagem.jpg",
  "type": "IMAGE"
}
```

## 6. Exemplo de mensagem com vídeo

**POST** `/messages`

```json
{
  "requestId": "123e4567-e89b-12d3-a456-426614174000",
  "content": "https://exemplo.com/video.mp4",
  "type": "VIDEO"
}
```

## Códigos de Erro

### 400 - Dados inválidos
```json
{
  "success": false,
  "error": {
    "title": "Dados inválidos",
    "detail": "RequestId e conteúdo são obrigatórios",
    "statusCode": 400
  }
}
```

### 404 - Mensagem não encontrada
```json
{
  "success": false,
  "error": {
    "title": "Mensagem não encontrada",
    "detail": "A mensagem especificada não foi encontrada",
    "statusCode": 404
  }
}
```

### 500 - Erro interno do servidor
```json
{
  "success": false,
  "error": {
    "title": "Erro interno do servidor",
    "detail": "Ocorreu um erro inesperado",
    "statusCode": 500
  }
}
```
