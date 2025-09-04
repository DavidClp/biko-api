
import { serverHttp } from "./app";
import { database } from "../../database";
import 'dotenv/config';

const port = process.env.PORT || 3000;

async function testDatabaseConnection() {
    try {
        await database.$connect();
        console.log('✅🎲 - CONEXÃO COM BANCO DE DADOS ESTABELECIDA COM SUCESSO');
        return true;
    } catch (error) {
        console.error('❌ - ERRO AO CONECTAR COM BANCO DE DADOS:', error);
        return false;
    }
}

async function startServer() {
    const dbConnected = await testDatabaseConnection();
    
    if (dbConnected) {
        serverHttp.listen(port, "0.0.0.0", () => {
            console.log(`\n🚀 - SERVIDOR RODANDO NA PORTA ${port}`);
        });
    } else {
        console.error('❌ - SERVIDOR NÃO PODE INICIAR - PROBLEMA NO BANCO DE DADOS');
        process.exit(1);
    }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ - UNHANDLED PROMISE REJECTION:');
    console.error('🔗 - REASON:', reason);
    console.error('🔗 - PROMISE:', promise);
    
    // Em produção, você pode querer encerrar o processo
    // process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('❌ - UNCAUGHT EXCEPTION:', error);
    
    // Em produção, você pode querer encerrar o processo
    // process.exit(1);
});

startServer();

process.on('SIGTERM', async () => {
    console.log('🔄 - ENCERRANDO SERVIDOR...');
    await database.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🔄 - ENCERRANDO SERVIDOR...');
    await database.$disconnect();
    process.exit(0);
});