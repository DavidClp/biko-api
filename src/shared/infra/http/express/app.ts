import http from "http";
import AppError from '../../../errors/AppError';
import express, { NextFunction, Request, Response } from 'express';
import { routes } from './routes/index.routes';
import cors from "cors";
import { Server } from 'socket.io'
import { RoutineTrigger } from "@/routine";
import { pinoHttp } from "pino-http";
import { logger } from "@/shared/utils/logger";
import { setupWebSocket } from "./websocket";
import { v4 as uuidv4 } from "uuid";

export const notifications_in_progress: { [key: string]: boolean } = {};

const app = express();

app.use(cors());

app.use(express.json({ limit: '200mb' }));

// Middleware para gerar requestId
if (process.env.MODE === 'PROD') {
app.use((req, res, next) => {
    req.id = uuidv4(); // adiciona o requestId à requisição
    res.setHeader("X-Request-Id", req.id); // opcional: retorna no header
    next();
});
}

// Middleware pino-http com requestId
if (process.env.MODE === 'PROD') {
    app.use(
        pinoHttp({
            logger,
            customProps: (req) => ({
                requestId: req.id, // adiciona ao log
            }),
            serializers: {
                req(req) {
                    return {
                        method: req.method,
                        url: req.url,
                        body: req.raw.body,
                    };
                },
                res(res) {
                    return { statusCode: res.statusCode };
                },
            },
        })
    );
}

app.use(routes);

RoutineTrigger.execute();

app.use((err: unknown, req: Request, res: Response, _: NextFunction) => {
    //logger.error('ERRO CAPTURADO:', err);
    logger.error({ err: new Error("ERRO CAPTURADO:") }, err as string);
    // Se for um AppError, retornar com o formato correto
    if (err instanceof AppError) {
        return res.status(err.error.statusCode).json({
            success: false,
            error: {
                title: err.error.title,
                detail: err.error.detail,
                origin: err.error.origin,
                type: err.error.type,
                field: err.error.field,
                statusCode: err.error.statusCode,
            },
        });
    }

    // Se for um erro de validação do Prisma
    if (err && typeof err === 'object' && 'code' in err) {
        const prismaError = err as any;

        if (prismaError.code === 'P2002') {
            return res.status(409).json({
                success: false,
                error: {
                    title: 'Conflito de dados',
                    detail: 'Já existe um registro com esses dados',
                    statusCode: 409,
                },
            });
        }

        if (prismaError.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: {
                    title: 'Registro não encontrado',
                    detail: 'O registro solicitado não foi encontrado',
                    statusCode: 404,
                },
            });
        }
    }

    // Erro genérico para outros tipos de erro
    return res.status(500).json({
        success: false,
        error: {
            title: 'Erro interno do servidor',
            detail: 'Ocorreu um erro inesperado',
            statusCode: 500,
        },
    });
});

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, { cors: { origin: '*' } });

setupWebSocket(io);

export { app, serverHttp, io };
