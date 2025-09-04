# 📨 Eventos do Chat - Socket.IO

## 🔌 Conectar ao Socket

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    userId: 'seu-user-id-aqui'
  }
});
```

## 📋 Eventos Disponíveis

### 1. `chat:join` - Entrar na sala do chat
**Enviar:**
```javascript
socket.emit('chat:join', {
  requestId: 'id-do-request'
});
```

**Receber:**
```javascript
// Sucesso - Carrega mensagens existentes
socket.on('chat:load_messages', (data) => {
  console.log('Mensagens carregadas:', data.messages);
  console.log('Request ID:', data.requestId);
});

// Erro
socket.on('chat:error', (error) => {
  console.error('Erro:', error.message);
});
```

### 2. `chat:send` - Enviar mensagem
**Enviar:**
```javascript
socket.emit('chat:send', {
  requestId: 'id-do-request',
  content: 'Conteúdo da mensagem',
  toUserId: 'id-do-usuario-destinatario'
});
```

**Receber:**
```javascript
// Nova mensagem (para todos na sala)
socket.on('chat:new_message', (message) => {
  console.log('Nova mensagem:', message);
  // message.sender.name - nome do remetente
  // message.content - conteúdo da mensagem
  // message.createdAt - data de criação
});
```

### 3. `chat:viewed` - Marcar mensagem como lida
**Enviar:**
```javascript
socket.emit('chat:viewed', {
  messageId: 'id-da-mensagem'
});
```

**Receber:**
```javascript
// Mensagem marcada como lida (para todos na sala)
socket.on('chat:message_viewed', (message) => {
  console.log('Mensagem marcada como lida:', message);
});
```

## 📊 Estrutura das Mensagens

Cada mensagem retornada contém:

```javascript
{
  id: "uuid-da-mensagem",
  request_id: "uuid-do-request",
  content: "Conteúdo da mensagem",
  sender_id: "uuid-do-remetente",
  receiver_id: "uuid-do-destinatario",
  type: "TEXT", // ou outro tipo
  viewed: false, // ou true
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  
  // Informações do remetente
  sender: {
    id: "uuid",
    email: "email@exemplo.com",
    client: {
      id: "uuid",
      name: "Nome do Cliente"
    },
    provider: {
      id: "uuid", 
      name: "Nome do Provider"
    }
  },
  
  // Informações do destinatário
  receiver: {
    id: "uuid",
    email: "email@exemplo.com",
    client: {
      id: "uuid",
      name: "Nome do Cliente"
    },
    provider: {
      id: "uuid",
      name: "Nome do Provider"
    }
  }
}
```

## 🚨 Tratamento de Erros

Todos os eventos podem retornar erros:

```javascript
socket.on('chat:error', (error) => {
  console.error('Erro no chat:', error.message);
  // Tratar erro na interface
});
```

## 📝 Exemplo de Uso Completo

```javascript
// 1. Conectar
const socket = io('http://localhost:3000', {
  auth: { userId: 'meu-user-id' }
});

// 2. Entrar na sala
socket.emit('chat:join', { requestId: 'request-123' });

// 3. Escutar mensagens carregadas
socket.on('chat:load_messages', (data) => {
  data.messages.forEach(msg => {
    console.log(`${msg.sender.client?.name || msg.sender.provider?.name}: ${msg.content}`);
  });
});

// 4. Escutar novas mensagens
socket.on('chat:new_message', (message) => {
  console.log(`Nova mensagem de ${message.sender.client?.name || message.sender.provider?.name}: ${message.content}`);
});

// 5. Enviar mensagem
socket.emit('chat:send', {
  requestId: 'request-123',
  content: 'Olá! Como posso ajudar?',
  toUserId: 'outro-user-id'
});

// 6. Marcar como lida
socket.emit('chat:viewed', { messageId: 'message-123' });
```
