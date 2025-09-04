import { PrismaClient } from "@prisma/client";

const database = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});

// Logs de eventos do Prisma
/* database.$on('query', (e: any) => {
    console.log('🔍 - QUERY:', e.query);
    console.log('⏱️ - DURAÇÃO:', e.duration + 'ms');
}); */

database.$on('error', (e: any) => {
    console.error('❌ - ERRO NO BANCO:', e.message);
});

/* database.$on('info', (e: any) => {
    console.log('ℹ️ - INFO DO BANCO:', e.message);
}); */

database.$on('warn', (e: any) => {
    console.warn('⚠️ - AVISO DO BANCO:', e.message);
});

export { database };
