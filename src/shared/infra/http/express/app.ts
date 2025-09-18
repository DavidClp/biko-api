import http from "http";
import AppError from '../../../errors/AppError';
import express, { NextFunction, Request, Response } from 'express';
import { routes } from './routes/index.routes';
import cors from "cors";
import { Server } from 'socket.io'
import { database } from "../../database";
import { setupWebSocket } from "./websocket";
import { RoutineTrigger } from "@/routine";


export const notifications_in_progress: { [key: string]: boolean } = {};

const app = express();

app.use(cors());

app.use(express.json({ limit: '200mb' }));

app.use(routes);

RoutineTrigger.execute();

app.use((err: unknown, req: Request, res: Response, _: NextFunction) => {
    console.error('ERRO CAPTURADO:', err);

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
