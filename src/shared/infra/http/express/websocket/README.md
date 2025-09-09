# WebSocket Service

Este serviço permite emitir eventos WebSocket de qualquer lugar da aplicação, mesmo fora do contexto de conexão.

## Como usar

### 1. Emitir nova solicitação
```typescript
import { WebSocketService } from '@/shared/infra/http/express/websocket/WebSocketService';

// Em qualquer lugar da aplicação
const webSocketService = WebSocketService.getInstance();
await webSocketService.emitNewRequest(requestData);
```

### 2. Emitir atualização de status
```typescript
const webSocketService = WebSocketService.getInstance();
await webSocketService.emitRequestStatusUpdate(requestData);
```

### 3. Emitir para usuário específico
```typescript
const webSocketService = WebSocketService.getInstance();
await webSocketService.emitToUser('userId123', 'custom:event', { message: 'Olá!' });
```

### 4. Emitir para todos os usuários
```typescript
const webSocketService = WebSocketService.getInstance();
await webSocketService.emitToAll('global:notification', { message: 'Sistema em manutenção' });
```

## Eventos disponíveis

### Para solicitações (requests):
- `request:new` - Nova solicitação criada
- `request:status_update` - Status da solicitação atualizado

### Para chat:
- `chat:message` - Nova mensagem
- `chat:viewed` - Mensagem visualizada

## Estrutura das salas

- `provider:{providerId}` - Usuários conectados de um provider específico
- `user:{userId}` - Usuário específico
- `room:{roomId}` - Sala de chat específica

## Tratamento de erros

O serviço não falha a operação principal se o WebSocket não estiver disponível. Os erros são logados no console.
